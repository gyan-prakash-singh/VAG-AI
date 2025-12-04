// chatbot.js — improved toggle + minimize behavior

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const chatbotBtn = document.getElementById("chatbot-button");
  const chatbotContainer = document.getElementById("chatbot-container");
  const chatbotClose = document.getElementById("chatbot-close");
  const chatbotMinimize = document.getElementById("chatbot-minimize");
  const chatbotSend = document.getElementById("chatbot-send");
  const chatbotInput = document.getElementById("chatbot-input");
  const messagesEl = document.getElementById("chatbot-messages");

  // If any required element is missing, do nothing (prevents runtime errors)
  if (!chatbotBtn || !chatbotContainer || !chatbotSend || !chatbotInput || !messagesEl) {
    console.warn("Chatbot: required DOM elements missing.");
    return;
  }

  // Initial state
  let step = 0;
  let userData = { name: "", email: "", message: "" };

  // Helpers
  function showContainer() {
    chatbotContainer.classList.remove("hidden");
    chatbotContainer.setAttribute("aria-hidden", "false");
    // focus input so user can type immediately
    setTimeout(() => chatbotInput.focus(), 120);
  }

  function hideContainer() {
    chatbotContainer.classList.add("hidden");
    chatbotContainer.setAttribute("aria-hidden", "true");
    // return focus to the floating button
    chatbotBtn.focus();
  }

  function toggleContainer() {
    if (chatbotContainer.classList.contains("hidden")) showContainer();
    else hideContainer();
  }

  function addMessage(text, sender) {
    const msgBox = document.createElement("div");
    msgBox.className = "message " + sender;
    // Keep simple HTML-safe insertion
    msgBox.textContent = text;
    messagesEl.appendChild(msgBox);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  // Event handlers
  chatbotBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleContainer();
  });

  if (chatbotClose) {
    chatbotClose.addEventListener("click", (e) => {
      e.preventDefault();
      hideContainer();
    });
  }

  // Minimize should hide (same as close) — robust to missing button
  if (chatbotMinimize) {
    chatbotMinimize.addEventListener("click", (e) => {
      e.preventDefault();
      hideContainer();
    });
  }

  // Send/Enter
  chatbotSend.addEventListener("click", processInput);
  chatbotInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") processInput();
  });

  // Start message (do not auto-open)
  addMessage("Hello! I'm your AI Assistant. Click the chat button to start.", "bot");

  // Core flow
  function processInput() {
    const text = chatbotInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    chatbotInput.value = "";

    if (step === 0) {
      addMessage("Hi! 👋 What is your name?", "bot");
      step = 1;
      return;
    }

    if (step === 1) {
      userData.name = text;
      addMessage(`Nice to meet you, ${text}! What's your email?`, "bot");
      step = 2;
      return;
    }

    if (step === 2) {
      userData.email = text;
      addMessage("Thanks. Please type your message or query.", "bot");
      step = 3;
      return;
    }

    if (step === 3) {
      userData.message = text;
      addMessage("Sending your details...", "bot");

      // FormSubmit AJAX endpoint (no backend)
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
        .then((res) => res.json())
        .then((data) => {
          addMessage("Your information has been sent successfully! 🎉 Our team will contact you soon.", "bot");
        })
        .catch((err) => {
          console.error("FormSubmit error:", err);
          addMessage("There was an error sending your details. Please try again later.", "bot");
        });

      // Reset flow
      step = 0;
      userData = { name: "", email: "", message: "" };
    }
  }
});
