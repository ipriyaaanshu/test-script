
/**
 * removes the bot typing indicator from the chat screen
 */
function hideBotTyping() {
    $("#botAvatar").remove();
    $(".botTyping").remove();
}

/**
 * adds the bot typing indicator from the chat screen
 */
let typingInterval; // For interval control

function showBotTyping() {
    const steps = [
        "Thinking about your question...",
        "Reading thousands of resources to find the best answer...",
        "Summarizing my findings..."
    ];

    let stepIndex = 0;

    const typingHTML = `
        <img class="botAvatar" id="botAvatar" src="./static/img/botAvatar.png"/>
        <div class="botTyping">
            <div class="typing-animation">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
            <p id="botTypingMessage">Processing your request...</p>
        </div>`;

    $(typingHTML).appendTo(".chats");
    scrollToBottomOfResults();

    const updateBotTypingMessage = () => {
        if (stepIndex < steps.length) {
            $("#botTypingMessage").text(steps[stepIndex]);
            stepIndex++;
        } else {
            clearInterval(typingInterval); // Stop updating messages
        }
    };

    // Start cycling through messages every few seconds
    typingInterval = setInterval(updateBotTypingMessage, 2500);
    updateBotTypingMessage(); // Show first message immediately
}

function scrollToBottomOfResults() {
    // Your existing logic to scroll to bottom
}
