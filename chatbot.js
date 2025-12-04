document.addEventListener("DOMContentLoaded", () => {

    const chatbotButton = document.getElementById("chatbot-button");
    const chatbotContainer = document.getElementById("chatbot-container");
    const minimizeBtn = document.getElementById("chatbot-minimize");
    const closeBtn = document.getElementById("chatbot-close");

    const msgContainer = document.getElementById("chatbot-messages");
    const inputBox = document.getElementById("chatbot-input");
    const sendBtn = document.getElementById("chatbot-send");

    let firstUserMessage = true; // Track first user message

    // ----------- OPEN CHATBOT -----------
    chatbotButton.addEventListener("click", () => {
        chatbotContainer.classList.remove("hidden");

        // Show only "Hi" when opened
        addBotMessage("Hi 👋 How can I assist you?");
    });

    // ----------- CLOSE CHATBOT -----------
    closeBtn.addEventListener("click", () => {
        chatbotContainer.classList.add("hidden");
        msgContainer.innerHTML = ""; // Reset
        firstUserMessage = true;
    });

    // ----------- MINIMIZE -----------
    minimizeBtn.addEventListener("click", () => {
        chatbotContainer.classList.toggle("minimized");
    });

    // ----------- Add Message Functions -----------
    function addUserMessage(text) {
        const msg = document.createElement("div");
        msg.className = "msg user-msg";
        msg.textContent = text;
        msgContainer.appendChild(msg);
        msgContainer.scrollTop = msgContainer.scrollHeight;
    }

    function addBotMessage(text) {
        const msg = document.createElement("div");
        msg.className = "msg bot-msg";
        msg.textContent = text;
        msgContainer.appendChild(msg);
        msgContainer.scrollTop = msgContainer.scrollHeight;
    }

    // ---------- FORM SUBMISSION USING AJAX ----------
    async function sendFormToEmail(data) {
        try {
            const response = await fetch("https://formsubmit.co/ajax/vagaisolution@gmail.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                addBotMessage("Your information has been sent successfully! 🎉 Our team will contact you soon.");
            } else {
                addBotMessage("Failed to send information. Please try again.");
            }
        } catch (error) {
            addBotMessage("Error sending message. Please try again.");
        }
    }

    // ----------- SEND MESSAGE -----------
    async function sendMessage() {
        const text = inputBox.value.trim();
        if (text === "") return;

        addUserMessage(text);
        inputBox.value = "";

        // FIRST USER MESSAGE → Show welcome intro
        if (firstUserMessage) {
            firstUserMessage = false;

            addBotMessage("Hello! I'm your AI Assistant. Click the chat button to start.");

            // Collect user information
            const userData = {
                name: "",
                email: "",
                mobile: "",
                message: ""
            };

            // Step 1 → Ask Name
            setTimeout(() => addBotMessage("May I know your first name?"), 600);

            let stage = 0;

            const observer = new MutationObserver(() => {

                const latestUser = msgContainer.querySelector(".user-msg:last-child");
                if (!latestUser) return;
                const inputVal = latestUser.textContent;

                // ------ STAGES ------
                if (stage === 0) {
                    userData.name = inputVal;
                    stage = 1;
                    setTimeout(() => addBotMessage("Great! Please share your email ID."), 600);
                }

                else if (stage === 1) {
                    userData.email = inputVal;
                    stage = 2;
                    setTimeout(() => addBotMessage("Thanks! Now your mobile number."), 600);
                }

                else if (stage === 2) {
                    userData.mobile = inputVal;
                    stage = 3;
                    setTimeout(() => addBotMessage("Please describe your requirement or message."), 600);
                }

                else if (stage === 3) {
                    userData.message = inputVal;
                    stage = 4;

                    addBotMessage("Submitting your information… please wait ⏳");

                    sendFormToEmail(userData);

                    observer.disconnect();
                }
            });

            observer.observe(msgContainer, { childList: true, subtree: true });
        }
    }

    sendBtn.addEventListener("click", sendMessage);

    inputBox.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });
});
