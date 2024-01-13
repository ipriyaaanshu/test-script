/**
 * scroll to the bottom of the chats after new message has been added to chat
 */

const textarea = document.querySelector('.keypad textarea');

textarea.addEventListener('input', function() {
    this.style.height = 'auto';
    if (this.scrollHeight < 150) { // Match max-height in CSS
        this.style.height = (this.scrollHeight) + 'px';
    }
});


const converter = new showdown.Converter();
function scrollToBottomOfResults() {
  const terminalResultsDiv = document.getElementById("chats");
  terminalResultsDiv.scrollTop = terminalResultsDiv.scrollHeight;
}

/**
 * Set user response on the chat screen
 * @param {String} message user message
 */
function setUserResponse(message) {
  const user_response = `<img class="userAvatar" src='./static/img/userAvatar.png'><p class="userMsg">${message} </p><div class="clearfix"></div>`;
  $(user_response).appendTo(".chats").show("slow");

  $(".usrInput").val("");
  scrollToBottomOfResults();
  showBotTyping();
  $(".suggestions").remove();
}

/**
 * returns formatted bot response
 * @param {String} text bot message response's text
 *
 */
function getBotResponse(text) {
  botResponse = `<img class="botAvatar" src="./static/img/botAvatar.png"/><span class="botMsg">${text}</span><div class="clearfix"></div>`;
  return botResponse;
}

/**
 * renders bot response on to the chat screen
 * @param {Array} response json array containing different types of bot response
 *
 * for more info: `https://rasa.com/docs/rasa/connectors/your-own-website#request-and-response-format`
 */
function setBotResponse(botResponse, status) {
  // Check the status and act accordingly
  hideBotTyping();
  switch (status) {
      case "progress":
        // Apply markdown conversion and formatting
        let html = converter.makeHtml(botResponse);
        html = html
          .replaceAll("<p>", "")
          .replaceAll("</p>", "")
          .replaceAll("<strong>", "<b>")
          .replaceAll("</strong>", "</b>");
        html = html.replace(/(?:\r\n|\r|\n)/g, "<br>");

        // Check for blockquotes
        if (html.includes("blockquote")) {
          html = html.replaceAll("<br>", "");
          botResponse = getBotResponse(html);
        }

        // Check for images
        if (html.includes("<img")) {
          html = html.replaceAll("<img", '<img class="imgcard_mrkdwn" ');
          botResponse = getBotResponse(html);
        }

        // Check for preformatted text
        if (html.includes("<pre") || html.includes("<code>")) {
          botResponse = getBotResponse(html);
        }

        // Check for list text
        if (
          html.includes("<ul") ||
          html.includes("<ol") ||
          html.includes("<li") ||
          html.includes("<h3")
        ) {
          html = html.replaceAll("<br>", "");
        } 
        else {
          // If no markdown formatting found, render the text as it is.
          if (!botResponse) {
            botResponse = `<img class="botAvatar" src="./static/img/botAvatar.png"/><p class="botMsg">${botResponse}</p><div class="clearfix"></div>`;
          }
        }

        // Append the bot response to the chat screen
        botResponse = getBotResponse(html);

        // Get the last bot message bubble
        const lastChatMessage = $(".chats").children().last();
        lastChatMessage.html(botResponse);
        scrollToBottomOfResults();

      case "finish":
          // Final actions when the message is complete 
          hideBotTyping();
          scrollToBottomOfResults();
          break;

      default:
          // Create a new message with the response body if no status is provided
          const newMessage = getBotResponse(botResponse);
          $(newMessage).appendTo(".chats");
          break;
  }

  // Scroll to bottom of results and focus user input
  scrollToBottomOfResults();
  $(".usrInput").focus();
}


/**
 * sends the user message to the rasa server,
 * @param {String} message user message
 */
async function send(message) {
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  
  try {
    const response = await fetch(chat_server_url + "/chat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: message, session_id: session_id, hostname: hostname}),
    });

    if (response.ok) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = '';
      let chunkedResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, {stream: true});

        // Process each complete JSON chunk in the buffer
        let boundary = buffer.indexOf('\n');
        while (boundary !== -1) {
          let chunk = buffer.substring(0, boundary).trim();
          buffer = buffer.substring(boundary + 1);
          boundary = buffer.indexOf('\n');

          if (chunk) {
            try {
              const data = JSON.parse(chunk);

              // Handle the data based on its content
              // For example, using a status field in the JSON
              if (data.status === "progress") {
                chunkedResponse += data.message;
                setBotResponse(chunkedResponse, data.status);
              } 
              else if (data.status === "finish") {
                setBotResponse("", data.status);
                const citations = data.citations;
                onBotMessageSent(citations, hostname);
                console.log(data);
              }
            } catch (e) {
              console.error("Error parsing JSON chunk: ", e);
            }
          }
        }
      }
    } else {
      console.error("Error from Chat Server: ", response.statusText);
    }
  } catch (error) {
    console.error("Error sending message to Chat Server: ", error);
  }
}


/**
 * clears the conversation from the chat screen
 * & sends the `/resart` event to the Rasa server
 */
function restartConversation() {
  $("#userInput").prop("disabled", true);
  // destroy the existing chart
  $(".collapsible").remove();

  if (typeof chatChart !== "undefined") {
    chatChart.destroy();
  }

  $(".chart-container").remove();
  if (typeof modalChart !== "undefined") {
    modalChart.destroy();
  }
  $(".chats").html("");
  $(".usrInput").val("");

  initializeChatWidget();
}
// triggers restartConversation function.
$("#restart").click(() => {
  restartConversation();
});

/**
 * if user hits enter or send button
 * */
$(".usrInput").on("keyup keypress", (e) => {
  const keyCode = e.keyCode || e.which;

  const text = $(".usrInput").val();
  if (keyCode === 13) {
    if (text === "" || $.trim(text) === "") {
      e.preventDefault();
      return false;
    }
    // destroy the existing chart, if yu are not using charts, then comment the below lines
    /*
    $(".collapsible").remove();
    $(".dropDownMsg").remove();
    if (typeof chatChart !== "undefined") {
      chatChart.destroy();
    }
    */

    $(".chart-container").remove();
    if (typeof modalChart !== "undefined") {
      modalChart.destroy();
    }

    $("#paginated_cards").remove();
    $(".suggestions").remove();
    $(".quickReplies").remove();
    $(".usrInput").blur();
    setUserResponse(text);
    send(text);
    e.preventDefault();
    return false;
  }
  return true;
});

$("#sendButton").on("click", (e) => {
  const text = $(".usrInput").val();
  if (text === "" || $.trim(text) === "") {
    e.preventDefault();
    return false;
  }
  // destroy the existing chart
  if (typeof chatChart !== "undefined") {
    chatChart.destroy();
  }

  $(".chart-container").remove();
  if (typeof modalChart !== "undefined") {
    modalChart.destroy();
  }

  $(".suggestions").remove();
  $("#paginated_cards").remove();
  $(".quickReplies").remove();
  $(".usrInput").blur();
  $(".dropDownMsg").remove();
  setUserResponse(text);
  send(text);
  e.preventDefault();
  return false;
});
