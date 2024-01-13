function appendCitationTrigger() {
    // Create and append the citation trigger after the bot's message
    const citationTrigger = `<div class="citation-trigger"><i style="font-size:14px" class="fa">&#xf05a;</i>Where did this answer come from?</div>`;
    $(citationTrigger).appendTo(".chats").show();
    scrollToBottomOfResults();
}

async function showCitationCarousel(citations, hostname) {
    // Data for the citations
    const payload = {
        citations: citations,
        hostname: hostname
      };
    try {
        const response = await fetch(chat_server_url + "/sources/", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const citationsData = await response.json();
        showCardsCarousel(citationsData);
      } catch (error) {
        console.error('Error sending citations:', error);
      }
}

// Assuming this is called whenever the bot sends a message
function onBotMessageSent(citations, hostname) {
    // Bot message logic
    // ...

    // Append the citation trigger
    if (citations !== null && citations.length > 0) {
        appendCitationTrigger();
    }

    // Add click event listener to the citation trigger
    $('.chats').on('click', '.citation-trigger', function() {
        showCitationCarousel(citations, hostname);
        $(this).hide(); // Optional: Hide the trigger after clicking
    });
}
