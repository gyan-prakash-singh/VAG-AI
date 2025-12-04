document.addEventListener("DOMContentLoaded", () => {
    
    const chatbotButton = document.getElementById("chatbot-button");
    const chatbotContainer = document.getElementById("chatbot-container");
    const minimizeBtn = document.getElementById("chatbot-minimize");
    const closeBtn = document.getElementById("chatbot-close");

    const msgContainer = document.getElementById("chatbot-messages");
    const inputBox = document.getElementById("chatbot-input");
    const sendBtn = document.getElementById("chatbot-send");
    const leadForm = document.getElementById("leadForm");

    let step = 0;
    let leadData = { firstName: "", email: "", mobile: "", requirement: "" };

    // 🔵 Toggle chatbot using the floating bubble
    chatbotButton.addEventListener("click", () => {
        chatbotContainer.classList.toggle("hidden");

        if (!chatbotContainer.classList.contains("hidden") && step === 0) {
            botReply("Hello! I’m your AI Assistant. May I know your First Name?");
        }
    });

    // Close button
    closeBtn.addEventListener("click", () => {
        chatbotContainer.classList.add("hidden");
    });

    // Minimize button
    minimizeBtn.addEventListener("click", () => {
        chatbotContainer.classList.add("hidden");
    });

    // Send message
    sendBtn.addEventListener("click", sendMessage);

    inputBox.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });

    function sendMessage() {
        const text = inputBox.value.trim();
        if (!text) return;

        addUserMsg(text);
        inputBox.value = "";
        processConversation(text);
    }

    function addUserMsg(text) {
        const div = document.createElement("div");
        div.className = "msg user-msg";
        div.textContent = text;
        msgContainer.appendChild(div);
        scrollDown();
    }

    function botReply(text) {
        const div = document.createElement("div");
        div.className = "msg bot-msg";
        div.textContent = text;
        msgContainer.appendChild(div);
        scrollDown();
    }

    function scrollDown() {
        msgContainer.scrollTop = msgContainer.scrollHeight;
    }

    // ---- Conversation Logic ----
    function processConversation(input) {

        if (step === 0) {
            leadData.firstName = input;
            botReply(`Nice to meet you, ${input}! Can you share your Email ID?`);
            step++;
        }

        else if (step === 1) {
            leadData.email = input;
            botReply(`Great! Please share your Mobile Number.`);
            step++;
        }

        else if (step === 2) {
            leadData.mobile = input;
            botReply(`Thanks! Tell me about your Requirement or Message.`);
            step++;
        }

        else if (step === 3) {
            leadData.requirement = input;

            // Fill hidden form
            document.getElementById("firstNameField").value = leadData.firstName;
            document.getElementById("emailField").value = leadData.email;
            document.getElementById("mobileField").value = leadData.mobile;
            document.getElementById("messageField").value = leadData.requirement;

            botReply("Submitting your details...");

            setTimeout(() => leadForm.submit(), 1000);

            step++;
        }

        else {
            botReply("We have received your details. Type anything to start again.");
        }
    }
});
