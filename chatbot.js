let step = 0;
let userData = { name: "", email: "", message: "" };

document.getElementById("chatbot-button").onclick = () => {
    document.getElementById("chatbot-container").classList.remove("hidden");
};

document.getElementById("chatbot-close").onclick = () => {
    document.getElementById("chatbot-container").classList.add("hidden");
};

document.getElementById("chatbot-send").onclick = () => {
    processInput();
};

document.getElementById("chatbot-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") processInput();
});

function addMessage(text, sender) {
    const msgBox = document.createElement("div");
    msgBox.className = "message " + sender;
    msgBox.innerText = text;

    const chatArea = document.getElementById("chatbot-messages");
    chatArea.appendChild(msgBox);
    chatArea.scrollTop = chatArea.scrollHeight;
}

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
        addMessage("Great, " + text + "! What is your email?", "bot");
        step = 2;
    }
    else if (step === 2) {
        userData.email = text;
        addMessage("What can I help you with? Please describe your query.", "bot");
        step = 3;
    }
    else if (step === 3) {
        userData.message = text;
        addMessage("Sending your details...", "bot");

        // Submit to FormSubmit.co
        fetch("https://formsubmit.co/ajax/YOUR_EMAIL_HERE?_redirect=none", {
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
        .then(res => res.json())
        .then(() => {
            addMessage("Your details have been sent successfully! 🎉 Our team will contact you soon.", "bot");
        })
        .catch(() => {
            addMessage("Something went wrong. Please try again later.", "bot");
        });

        step = 0;
        userData = { name: "", email: "", message: "" };
    }
}
