function downloadChatHistory() {
    let chatHistory = '';
    $(".chats").children().each(function () {
        // Skip quick replies
        if (!$(this).hasClass("quickReplies") && !shouldBeSkipped($(this))) {
            // Check if the message is from the user or the bot
            if ($(this).hasClass("clearfix")) {
                chatHistory += 'Bot: ' + $(this).text() + '\n';
            } else if ($(this).hasClass("userMsg")) {
                chatHistory += 'User: ' + $(this).text() + '\n';
            } else {
                // For any other type of message
                chatHistory += $(this).text() + '\n';
            }
        }
    });

    // Create a Blob from the chat history text
    const chatBlob = new Blob([chatHistory], { type: 'text/plain' });

    // Create a link element for the download
    const chatLink = document.createElement("a");
    chatLink.href = URL.createObjectURL(chatBlob);
    chatLink.download = "chat_history.txt";

    // Append the link to the body, click it, and remove it
    document.body.appendChild(chatLink);
    chatLink.click();
    document.body.removeChild(chatLink);
}


function shouldBeSkipped(element) {
    // Add your conditions here to determine if an element should be skipped
    // Example: Skip if the element has a specific class or contains specific text
    return element.hasClass('userAvatar') || element.text().trim() === '' || element.text().trim() === 'Start Chat';
}