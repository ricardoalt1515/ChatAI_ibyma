// components/Chat/index.jsx
import { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import ChatHeader from './ChatHeader';
import styles from './Chat.module.css';

const Chat = ({
  botName = 'AI Assistant',
  botAvatar = '/images/bot-avatar.png',
  userAvatar = '/images/user-avatar.png',
  primaryColor = '#4F46E5',
  apiEndpoint = '/api/chat',
  height = '500px',
  width = '350px',
  initialMessage = '¡Hola! ¿En qué puedo ayudarte hoy?'
}) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: initialMessage }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Función para manejar el envío de mensajes
  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // Agregar mensaje del usuario
    const userMessage = { role: 'user', content: message };
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
          messages: [...messages, userMessage]
        }),
      });

      if (!response.ok) throw new Error('Error en la respuesta del servidor');

      const data = await response.json();

      // Agregar respuesta del asistente
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Scroll al último mensaje cuando se añade uno nuevo
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      className={styles.chatContainer}
      style={{ height, width, '--primary-color': primaryColor }}
    >
      <ChatHeader botName={botName} botAvatar={botAvatar} />

      <div className={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            message={msg}
            botAvatar={botAvatar}
            userAvatar={userAvatar}
          />
        ))}
        {isTyping && (
          <div className={styles.typingIndicator}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default Chat;
