// components/ChatWidget/index.jsx
import { useState, useEffect } from 'react';
import ChatWindow from './ChatWindow';
import ChatButton from './ChatButton';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWidget = ({
  botName = 'HydroConsult',
  botAvatar = '/images/hydro-avatar.png',
  userAvatar = '/images/user-avatar.png',
  primaryColor = '#0284c7', // Azul agua por defecto
  accentColor = '#0891b2',   // Turquesa por defecto
  apiEndpoint = '/api/chat',
  position = 'right',
  initialMessage = 'Bienvenido a HydroConsult. Soy su asistente en soluciones hídricas sostenibles. ¿En qué puedo ayudarle hoy?',
  darkMode = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: initialMessage,
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);

  // Alternar la ventana de chat
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0); // Reiniciar contador al abrir

      // Mostrar mensaje de bienvenida si es la primera vez que se abre
      if (messages.length === 1 && !showGreeting) {
        setShowGreeting(true);
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: '¿Está interesado en alguna de nuestras soluciones específicas de gestión del agua?',
              timestamp: new Date()
            }]);
            setIsTyping(false);
          }, 2000);
        }, 1000);
      }
    }
  };

  // Notificaciones cuando el chat está cerrado
  useEffect(() => {
    if (!isOpen && messages.length > 1) {
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
          messages: messages.map(msg => ({ role: msg.role, content: msg.content })),
          context: {
            domain: "soluciones_hidricas",
            professional: true
          }
        }),
      });

      if (!response.ok) throw new Error('Error en la respuesta del servidor');

      const data = await response.json();

      // Simular tiempo de respuesta realista (entre 1-3 segundos)
      const responseTime = Math.floor(Math.random() * 2000) + 1000;

      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        }]);
        setIsTyping(false);
      }, responseTime);

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Lo siento, ha ocurrido un error al procesar su consulta. Por favor, inténtelo de nuevo o contáctenos directamente a soporte@hidrosoluciones.com',
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
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
          >
            <ChatWindow
              messages={messages}
              isTyping={isTyping}
              onSendMessage={handleSendMessage}
              onClose={toggleChat}
              botName={botName}
              botAvatar={botAvatar}
              userAvatar={userAvatar}
              quickReplies={[
                "Sistemas de purificación",
                "Soluciones de ahorro",
                "Tratamiento industrial",
                "Contactar especialista"
              ]}
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
