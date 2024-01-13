/**
 * appends horizontally placed buttons carousel
 * on to the chat screen
 * @param {Array} quickRepliesData json array
 */
let quickRepliesData = [
    {
        title: "Who is my Advisor?",
        payload: "I don’t know who my advisor is. Where can I find that information?"
    },
    {
        title: "Can't register for classes",
        payload: "I can’t register for classes and don’t know why."
    },
    {
        title: "Need information about a hold",
        payload: "I have a hold and don’t know what it means. Where can I get that information?"
    },
    {
        title: "Information about online classes",
        payload: "I’m looking for online classes. Can you help me find some? "
    },
  ];

function showQuickReplies() {
    let chips = "";
    for (let i = 0; i < quickRepliesData.length; i += 1) {
        const chip = `<div class="chip" data-payload='${quickRepliesData[i].payload}'>${quickRepliesData[i].title}</div>`;
        chips += chip;
    }

    const quickReplies = `<div class="quickReplies">${chips}</div><div class="clearfix"></div>`;
    $(quickReplies).appendTo(".chats").fadeIn(1000);
    scrollToBottomOfResults();
    const slider = document.querySelector(".quickReplies");
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener("mousedown", (e) => {
        isDown = true;
        slider.classList.add("active");
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener("mouseleave", () => {
        isDown = false;
        slider.classList.remove("active");
    });
    slider.addEventListener("mouseup", () => {
        isDown = false;
        slider.classList.remove("active");
    });
    slider.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 3; // scroll-fast
        slider.scrollLeft = scrollLeft - walk;
    });
}

// on click of quickreplies, get the payload value and send it to rasa
$(document).on("click", ".quickReplies .chip", function () {
    const text = this.innerText;
    const payload = this.getAttribute("data-payload");
    console.log("chip payload: ", this.getAttribute("data-payload"));
    //setUserResponse(text);
    //send(payload);
    $(".usrInput").val(payload)

    // delete the quickreplies
    // $(".quickReplies").remove();
});
