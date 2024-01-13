/* module for importing other js files */
function include(file) {
  const script = document.createElement('script');
  script.src = file;
  script.type = 'text/javascript';
  script.defer = true;

  document.getElementsByTagName('head').item(0).appendChild(script);
}

/* import components */
include('./static/js/components/index.js');

function initializeChatWidget() {
  // Reset form inputs
  $("#userNameInput").val("");
  $("#userEmailInput").val("");

  // Other initialization code...
  $("div").removeClass("tap-target-origin");
  $(".dropdown-trigger").dropdown();

  // Always show user form
  $("#userInfoForm").show();

  // Handle form submission
    $("#submitUserInfo").click(() => {
        const userName = $("#userNameInput").val().trim();
        const userEmail = $("#userEmailInput").val().trim();

        // Simple validation
        if (isValidName(userName) && isValidEmail(userEmail)) {
            localStorage.setItem('userName', userName);
            localStorage.setItem('userEmail', userEmail);

            // Hide the form and start the chat
            $("#userInfoForm").hide();
            startChatbotConversation();
        } else {
            // Handle invalid input
        }
  });
  // Handle click event for the skip button
  $("#skipUserInfo").click(function() {
    // Hide the user info form
    $("#userInfoForm").hide();
    // Start the chatbot conversation without user info
    startChatbotConversation();
  });
}

function startChatbotConversation() {
  // Logic to start the normal chatbot conversation
  if (pathname.includes("msudenver")) {
    setBotResponse("Hello, I'm the AI Advisor for MSU Denver. You can ask me about academics, admissions, and more.");
  } else if (pathname.includes("wgu")) {
    setBotResponse("Hello, I'm the AI Advisor for Western Governors University. You can ask me about academics, admissions, and more.");
  }
  showQuickReplies();
  $("#userInput").prop("disabled", false);
}


// Bot pop-up intro
document.addEventListener("DOMContentLoaded", () => {
  const elemsTap = document.querySelector(".tap-target");
  const instancesTap = M.TapTarget.init(elemsTap, {});
  instancesTap.open();
  setTimeout(() => {
    instancesTap.close();
  }, 4000);
});

// Event Listener for Window Load
window.addEventListener('load', () => {
  $(document).ready(initializeChatWidget);

  // Toggle the chatbot screen
  $("#profile_div").click(() => {
    $(".profile_div").toggle();
    $(".invokexr-widget").toggle();
  });

  // Clear function to clear the chat contents of the widget.
  $("#clear").click(() => {
    $(".chats").fadeOut("normal", () => {
      $(".chats").html("");
      $(".chats").fadeIn();
    });
  });

  // Close function to close the widget.
  $("#close").click(() => {
    $(".profile_div").toggle();
    $(".invokexr-widget").toggle();
    scrollToBottomOfResults();
  });

  $("#download-chat").click(downloadChatHistory);

});
