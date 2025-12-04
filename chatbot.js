document.addEventListener("DOMContentLoaded", () => {
    
    const chatbotButton = document.getElementById("chatbot-button");
    const chatbotContainer = document.getElementById("chatbot-container");
    const minimizeBtn = document.getElementById("chatbot-minimize");
    const closeBtn = document.getElementById("chatbot-close");

    const msgContainer = document.getElementById("chatbot-messages");
    const inputBox = document.getElementById("chatbot-input");
    const sendBtn = document.getElementById("chatbot-send");

    // --- OPEN CHATBOT ---
    if (chatbotButton) {
        chatbotButton.addEventListener("click", () => {
            chatbotContainer.classList.remove("hidden");
        });
    }

    // --- CLOSE CHATBOT ---
    closeBtn.addEventListener("click", () => {
        chatbotContainer.classList.add("hidden");
    });

    // --- MINIMIZE CHATBOT ---
    minimizeBtn.addEventListener("click", () => {
        chatbotContainer.classList.toggle("minimized");
    });

    // --- SEND MESSAGE ---
    function sendMessage() {
        const text = inputBox.value.trim();
        if (text === "") return;

        const userMsg = document.createElement("div");
        userMsg.className = "msg user-msg";
        userMsg.textContent = text;
        msgContainer.appendChild(userMsg);

        inputBox.value = "";

        // Scroll down
        msgContainer.scrollTop = msgContainer.scrollHeight;

        // Fake bot reply
        setTimeout(() => {
            const botMsg = document.createElement("div");
            botMsg.className = "msg bot-msg";
            botMsg.textContent = "Thanks! This is a static demo response.";
            msgContainer.appendChild(botMsg);

            msgContainer.scrollTop = msgContainer.scrollHeight;
        }, 600);
    }

    sendBtn.addEventListener("click", sendMessage);

    inputBox.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });
});
