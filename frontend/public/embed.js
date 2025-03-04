// public/embed.js

(function () {
  // Configuración por defecto
  const defaultConfig = {
    botName: 'AI Assistant',
    botAvatar: 'https://tu-dominio.com/images/bot-avatar.png',
    userAvatar: 'https://tu-dominio.com/images/user-avatar.png',
    primaryColor: '#7C3AED',
    accentColor: '#4F46E5',
    position: 'right',
    initialMessage: '👋 ¡Hola! ¿En qué puedo ayudarte hoy?',
    apiEndpoint: 'https://tu-dominio.com/api/chat',
    darkMode: false
  };

  // Mezclar configuración personalizada con defaults
  const config = Object.assign({}, defaultConfig, window.AIBotConfig || {});

  // Añadir estilos de Tailwind (versión reducida para el widget)
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Estilos básicos de Tailwind para el chatbot */
      .ai-chatbot-btn {
        width: 60px;
        height: 60px;
        border-radius: 9999px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.3s ease;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        color: white;
      }
      
      .ai-chatbot-btn:hover {
        transform: scale(1.05);
      }
      
      .ai-chatbot-window {
        border-radius: 1rem;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        background-color: white;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        height: 500px;
        max-height: calc(100vh - 120px);
        width: 380px;
        max-width: calc(100vw - 40px);
        transition: opacity 0.3s ease, transform 0.3s ease;
      }
      
      .ai-chatbot-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        color: white;
      }
      
      .ai-chatbot-botinfo {
        display: flex;
        align-items: center;
      }
      
      .ai-chatbot-avatar {
        width: 40px;
        height: 40px;
        border-radius: 9999px;
        border: 2px solid rgba(255, 255, 255, 0.5);
        margin-right: 0.75rem;
      }
      
      .ai-chatbot-botname {
        font-weight: 600;
        font-size: 1rem;
        margin: 0;
      }
      
      .ai-chatbot-status {
        display: flex;
        align-items: center;
        font-size: 0.75rem;
        opacity: 0.9;
      }
      
      .ai-chatbot-status-dot {
        width: 8px;
        height: 8px;
        border-radius: 9999px;
        background-color: #10B981;
        margin-right: 0.375rem;
      }
      
      .ai-chatbot-close {
        width: 30px;
        height: 30px;
        border-radius: 9999px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
        cursor: pointer;
      }
      
      .ai-chatbot-close:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
      
      .ai-chatbot-messages {
        flex: 1;
        padding: 1rem;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        background-color: #F9FAFB;
      }
      
      .ai-chatbot-message {
        display: flex;
        max-width: 80%;
      }
      
      .ai-chatbot-message.bot {
        align-self: flex-start;
      }
      
      .ai-chatbot-message.user {
        align-self: flex-end;
        flex-direction: row-reverse;
      }
      
      .ai-chatbot-bubble {
        border-radius: 1rem;
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      
      .ai-chatbot-message.bot .ai-chatbot-bubble {
        background-color: #F3F4F6;
        color: #1F2937;
        border-bottom-left-radius: 0.25rem;
      }
      
      .ai-chatbot-message.user .ai-chatbot-bubble {
        border-bottom-right-radius: 0.25rem;
      }
      
      .ai-chatbot-timestamp {
        display: block;
        font-size: 0.625rem;
        margin-top: 0.375rem;
        opacity: 0.7;
        text-align: right;
      }
      
      .ai-chatbot-avatar-sm {
        width: 32px;
        height: 32px;
        border-radius: 9999px;
        border: 2px solid white;
        margin: 0 0.5rem;
      }
      
      .ai-chatbot-typing {
        display: flex;
        gap: 0.25rem;
        padding: 0.5rem;
        align-items: center;
        justify-content: center;
      }
      
      .ai-chatbot-typing-dot {
        width: 6px;
        height: 6px;
        background-color: #9CA3AF;
        border-radius: 9999px;
        opacity: 0.6;
        animation: ai-chatbot-bounce 1.3s infinite ease-in-out;
      }
      
      .ai-chatbot-typing-dot:nth-child(1) { animation-delay: 0s; }
      .ai-chatbot-typing-dot:nth-child(2) { animation-delay: 0.2s; }
      .ai-chatbot-typing-dot:nth-child(3) { animation-delay: 0.4s; }
      
      .ai-chatbot-input-area {
        display: flex;
        padding: 1rem;
        border-top: 1px solid #E5E7EB;
        gap: 0.75rem;
      }
      
      .ai-chatbot-input {
        flex: 1;
        padding: 0.625rem 1rem;
        border-radius: 9999px;
        border: 1px solid #E5E7EB;
        font-size: 0.875rem;
        outline: none;
      }
      
      .ai-chatbot-input:focus {
        border-color: #7C3AED;
        box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
      }
      
      .ai-chatbot-send {
        width: 40px;
        height: 40px;
        border-radius: 9999px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }
      
      .ai-chatbot-send:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .ai-chatbot-unread {
        position: absolute;
        top: -5px;
        right: -5px;
        background-color: #EF4444;
        color: white;
        border-radius: 9999px;
        min-width: 20px;
        height: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 6px;
      }
      
      @keyframes ai-chatbot-bounce {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-4px); }
      }
      
      .ai-chatbot-dark .ai-chatbot-window {
        background-color: #1F2937;
      }
      
      .ai-chatbot-dark .ai-chatbot-messages {
        background-color: #111827;
      }
      
      .ai-chatbot-dark .ai-chatbot-input-area {
        border-color: #374151;
      }
      
      .ai-chatbot-dark .ai-chatbot-input {
        background-color: #374151;
        border-color: #4B5563;
        color: #F9FAFB;
      }
      
      .ai-chatbot-dark .ai-chatbot-message.bot .ai-chatbot-bubble {
        background-color: #374151;
        color: #F9FAFB;
      }
    `;
    document.head.appendChild(style);
  }

  // Crear el div contenedor para el widget
  const widgetContainer = document.createElement('div');
  widgetContainer.id = 'ai-chatbot-widget';
  widgetContainer.style.position = 'fixed';
  widgetContainer.style.bottom = '20px';
  widgetContainer.style[config.position] = '20px';
  widgetContainer.style.zIndex = '9999';
  widgetContainer.style.fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

  if (config.darkMode) {
    widgetContainer.classList.add('ai-chatbot-dark');
  }

  document.body.appendChild(widgetContainer);

  // Crear el botón de chat
  const chatButton = document.createElement('button');
  chatButton.id = 'ai-chatbot-button';
  chatButton.className = 'ai-chatbot-btn';
  chatButton.style.backgroundColor = config.primaryColor;
  chatButton.style.position = 'relative';
  chatButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `;
  widgetContainer.appendChild(chatButton);

  // Estado del chat
  let isOpen = false;
  let chatWindow = null;
  let unreadCount = 0;

  // Inyectar estilos
  injectStyles();

  // Cargar fuente Inter
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
  document.head.appendChild(fontLink);

  // Función para crear la ventana de chat
  function createChatWindow() {
    if (chatWindow) return;

    // Crear la ventana de chat
    chatWindow = document.createElement('div');
    chatWindow.id = 'ai-chatbot-window';
    chatWindow.className = 'ai-chatbot-window';
    chatWindow.style.position = 'absolute';
    chatWindow.style.bottom = '80px';
    chatWindow.style.opacity = '0';
    chatWindow.style.transform = 'translateY(20px) scale(0.95)';
    chatWindow.style[config.position] = '0';

    // Crear el header
    const header = document.createElement('div');
    header.className = 'ai-chatbot-header';
    header.style.background = `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.accentColor} 100%)`;
    header.innerHTML = `
      <div class="ai-chatbot-botinfo">
        <img src="${config.botAvatar}" alt="Bot Avatar" class="ai-chatbot-avatar">
        <div>
          <h3 class="ai-chatbot-botname">${config.botName}</h3>
          <div class="ai-chatbot-status">
            <span class="ai-chatbot-status-dot"></span>
            Online
          </div>
        </div>
      </div>
      <button id="ai-chatbot-close" class="ai-chatbot-close">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;
    chatWindow.appendChild(header);

    // Área de mensajes
    const messagesContainer = document.createElement('div');
    messagesContainer.id = 'ai-chatbot-messages';
    messagesContainer.className = 'ai-chatbot-messages';

    // Mensaje inicial del bot
    messagesContainer.innerHTML = `
      <div class="ai-chatbot-message bot">
        <div class="ai-chatbot-bubble">
          ${config.initialMessage}
          <span class="ai-chatbot-timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <img src="${config.botAvatar}" alt="Bot Avatar" class="ai-chatbot-avatar-sm">
      </div>
    `;
    chatWindow.appendChild(messagesContainer);

    // Área de input
    const inputArea = document.createElement('div');
    inputArea.className = 'ai-chatbot-input-area';
    inputArea.innerHTML = `
      <input 
        type="text" 
        id="ai-chatbot-input" 
        placeholder="Escribe un mensaje..." 
        class="ai-chatbot-input"
      >
      <button 
        id="ai-chatbot-send" 
        class="ai-chatbot-send"
        style="background-color: ${config.primaryColor}; color: white;"
        disabled
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    `;
    chatWindow.appendChild(inputArea);

    widgetContainer.appendChild(chatWindow);

    // Habilitar y deshabilitar el botón de enviar
    const input = document.getElementById('ai-chatbot-input');
    const sendButton = document.getElementById('ai-chatbot-send');

    input.addEventListener('input', function () {
      if (this.value.trim()) {
        sendButton.style.opacity = '1';
        sendButton.disabled = false;
      } else {
        sendButton.style.opacity = '0.5';
        sendButton.disabled = true;
      }
    });

    // Event Listeners
    document.getElementById('ai-chatbot-close').addEventListener('click', toggleChat);

    // Enviar mensaje
    sendButton.addEventListener('click', sendMessage);
    input.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });

    // Mostrar la ventana con animación
    setTimeout(() => {
      chatWindow.style.opacity = '1';
      chatWindow.style.transform = 'translateY(0) scale(1)';
    }, 50);
  }

  // Formatear tiempo
  function formatTime(date) {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Añadir mensaje a la conversación
  function addMessage(content, sender) {
    const messagesContainer = document.getElementById('ai-chatbot-messages');
    const messageEl = document.createElement('div');
    messageEl.className = `ai-chatbot-message ${sender}`;

    if (sender === 'user') {
      messageEl.innerHTML = `
        <img src="${config.userAvatar}" alt="User Avatar" class="ai-chatbot-avatar-sm">
        <div class="ai-chatbot-bubble" style="background-color: ${config.primaryColor}; color: white;">
          ${content}
          <span class="ai-chatbot-timestamp">${formatTime(new Date())}</span>
        </div>
      `;
    } else {
      messageEl.innerHTML = `
        <div class="ai-chatbot-bubble">
          ${content}
          <span class="ai-chatbot-timestamp">${formatTime(new Date())}</span>
        </div>
        <img src="${config.botAvatar}" alt="Bot Avatar" class="ai-chatbot-avatar-sm">
      `;
    }

    messagesContainer.appendChild(messageEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Añadir indicador de typing
  function addTypingIndicator() {
    const messagesContainer = document.getElementById('ai-chatbot-messages');
    const typingEl = document.createElement('div');
    typingEl.id = 'ai-chatbot-typing';
    typingEl.className = 'ai-chatbot-message bot';
    typingEl.innerHTML = `
      <div class="ai-chatbot-bubble">
        <div class="ai-chatbot-typing">
          <span class="ai-chatbot-typing-dot"></span>
          <span class="ai-chatbot-typing-dot"></span>
          <span class="ai-chatbot-typing-dot"></span>
        </div>
      </div>
      <img src="${config.botAvatar}" alt="Bot Avatar" class="ai-chatbot-avatar-sm">
    `;
    messagesContainer.appendChild(typingEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Remover indicador de typing
  function removeTypingIndicator() {
    const typingEl = document.getElementById('ai-chatbot-typing');
    if (typingEl) {
      typingEl.remove();
    }
  }

  // Función para enviar un mensaje
  async function sendMessage() {
    const input = document.getElementById('ai-chatbot-input');
    const message = input.value.trim();
    if (!message) return;

    input.value = '';
    document.getElementById('ai-chatbot-send').disabled = true;
    document.getElementById('ai-chatbot-send').style.opacity = '0.5';

    // Añadir mensaje del usuario
    addMessage(message, 'user');

    // Mostrar indicador de escritura
    addTypingIndicator();

    try {
      // Enviar mensaje al servidor
      const response = await fetch(config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();

      // Eliminar indicador de escritura
      removeTypingIndicator();

      // Añadir respuesta del bot con un pequeño delay para simular escritura
      setTimeout(() => {
        addMessage(data.response || 'Lo siento, ocurrió un error. Por favor, intenta de nuevo.', 'bot');

        // Incrementar contador de no leídos si el chat está cerrado
        if (!isOpen) {
          unreadCount++;
          updateUnreadBadge();
        }
      }, 500);

    } catch (error) {
      console.error('Error:', error);
      // Eliminar indicador de escritura
      removeTypingIndicator();
      // Mostrar mensaje de error
      addMessage('Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.', 'bot');
    }
  }

  // Actualizar el badge de mensajes no leídos
  function updateUnreadBadge() {
    let badge = document.getElementById('ai-chatbot-unread');

    if (unreadCount > 0) {
      if (!badge) {
        badge = document.createElement('span');
        badge.id = 'ai-chatbot-unread';
        badge.className = 'ai-chatbot-unread';
        chatButton.appendChild(badge);
      }
      badge.textContent = unreadCount;
    } else if (badge) {
      badge.remove();
    }
  }

  // Toggle chat window
  function toggleChat() {
    if (isOpen) {
      // Cerrar chat
      chatWindow.style.opacity = '0';
      chatWindow.style.transform = 'translateY(20px) scale(0.95)';

      setTimeout(() => {
        chatButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        `;
        updateUnreadBadge();
      }, 200);
    } else {
      // Abrir chat
      if (!chatWindow) {
        createChatWindow();
      } else {
        chatWindow.style.opacity = '1';
        chatWindow.style.transform = 'translateY(0) scale(1)';
      }

      chatButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;

      // Resetear contador de no leídos
      unreadCount = 0;
      updateUnreadBadge();

      // Focus en el input
      setTimeout(() => {
        document.getElementById('ai-chatbot-input').focus();
      }, 300);
    }

    isOpen = !isOpen;
  }

  // Event listener para el botón de chat
  chatButton.addEventListener('click', toggleChat);
})();
