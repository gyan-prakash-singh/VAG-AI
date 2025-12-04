let step = 0;
let userData = { name: "", email: "", message: "" };

const chatbotBtn = document.getElementById("chatbot-button");
const chatbotContainer = document.getElementById("chatbot-container");
const chatbotClose = document.getElementById("chatbot-close");
const chatbotMinimize = document.getElementById("chatbot-minimize");

// Toggle chatbot on floating button click
chatbotBtn.onclick = () => {
    chatbotContainer.classList.toggle("hidden");
};

// Close completely
chatbotClose.onclick = () => {
    chatbotContainer.classList.add("hidden");
};

// Minimize
chatbotMinimize.onclick = () => {
    chatbotContainer.classList.add("hidden");
};

// Send message button
document.getElementById("chatbot-send").onclick = () => {
    processInput();
};

// Enter key support
document.getElementById("chatbot-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") processInput();
});

// Add messages to UI
function addMessage(text, sender) {
    const msgBox = document.createElement("div");
    msgBox.className = "message " + sender;
    msgBox.innerText = text;

    const chatArea = document.getElementById("chatbot-messages");
    chatArea.appendChild(msgBox);
    chatArea.scrollTop = chatArea.scrollHeight;
}

// Chatbot flow logic
function processInput() {
    const input = document.getElementById("chatbot-input");
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    if (step === 0) {
        addMessage("Hi! 👋 What is your name?", "bot");
        step = 1;
    }
    else if (step === 1) {
        userData.name = text;
        addMessage(`Nice to meet you, ${text}! What's your email?`, "bot");
        step = 2;
    }
    else if (step === 2) {
        userData.email = text;
        addMessage("What can I help you with today?", "bot");
        step = 3;
    }
    else if (step === 3) {
        userData.message = text;
        addMessage("Sending your details...", "bot");

        // Send to FormSubmit
        fetch("https://formsubmit.co/ajax/vagaisolution@gmail.com?_redirect=none", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                Name: userData.name,
                Email: userData.email,
                Query: userData.message
            })
        })
        .then(() => {
            addMessage("Your information has been sent successfully! 🎉", "bot");
        })
        .catch(() => {
            addMessage("There was an error sending your details. Please try again later.", "bot");
        });

        // Reset after submission
