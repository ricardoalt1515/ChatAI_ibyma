// components/ChatWidget/index.jsx
import { useState, useEffect } from 'react';
import ChatWindow from './ChatWindow';
import ChatButton from './ChatButton';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWidget = ({
  botName = 'AI Assistant',
  botAvatar = '/images/bot-avatar.png',
  userAvatar = '/images/user-avatar.png',
  primaryColor = '#7C3AED', // Color morado por defecto
  accentColor = '#4F46E5',
  apiEndpoint = '/api/chat',
  position = 'right', // 'right' o 'left'
  initialMessage = '¡Hola! ¿En qué puedo ayudarte hoy?',
  darkMode = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: initialMessage, timestamp: new Date() }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Alternar la ventana de chat
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0); // Reiniciar contador cuando se abre
    }
  };

  // Simular nuevo mensaje del bot para fines de demostración
  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      // Si el chat está cerrado y tenemos más que el mensaje inicial
      const lastMessageFromBot = messages[messages.length - 1].role === 'assistant';
      if (!lastMessageFromBot) {
        setUnreadCount(prev => prev + 1);
      }
    }
  }, [messages, isOpen]);

  // Manejar el envío de un mensaje
  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // Añadir mensaje del usuario
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Enviar mensaje al backend
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.map(msg => ({ role: msg.role, content: msg.content }))
        }),
      });

      if (!response.ok) throw new Error('Error en la respuesta del servidor');

      const data = await response.json();

      // Añadir respuesta del asistente con ligero retraso para simular escritura
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        }]);
        setIsTyping(false);
      }, 500);

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.',
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }
  };

  // Variables CSS para los colores personalizados
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--accent-color', accentColor);
  }, [primaryColor, accentColor]);

  // Aplicar modo oscuro
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div
      className={`fixed bottom-5 z-50 ${position === 'right' ? 'right-5' : 'left-5'} flex flex-col items-end`}
      style={{
        '--primary-color': primaryColor,
        '--accent-color': accentColor
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mb-4 w-[380px] max-w-[calc(100vw-40px)]"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <ChatWindow
              messages={messages}
              isTyping={isTyping}
              onSendMessage={handleSendMessage}
              onClose={toggleChat}
              botName={botName}
              botAvatar={botAvatar}
              userAvatar={userAvatar}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ChatButton
        onClick={toggleChat}
        isOpen={isOpen}
        unreadCount={unreadCount}
      />
    </div>
  );
};

export default ChatWidget;
