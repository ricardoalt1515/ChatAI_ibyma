// components/ChatWidget/ChatWindow.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTime, parseMessageContent } from './utils';

// Componente de burbuja de mensaje
const MessageBubble = ({ message, botAvatar, userAvatar }) => {
  const isBot = message.role === 'assistant';

  // Parsear contenido para manejar links, emojis y formatos específicos
  const parsedContent = parseMessageContent(message.content);

  return (
    <motion.div
      className={`flex max-w-[85%] ${isBot ? 'self-start' : 'self-end flex-row-reverse'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`relative px-4 py-3 rounded-2xl ${isBot
          ? 'bg-gray-50 text-gray-800 dark:bg-gray-700 dark:text-gray-100 rounded-bl-md border-l-4 border-primary-500'
          : 'bg-primary-600 text-white rounded-br-md'
        } shadow-sm`}>
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: parsedContent }}
        />
        <span className="block text-xs mt-1.5 opacity-70 text-right">
          {formatTime(message.timestamp)}
        </span>

        {/* Sutil animación de ondulación para mensajes del bot */}
        {isBot && (
          <motion.div
            className="absolute -left-0.5 top-0 bottom-0 w-1 bg-secondary-400 opacity-50 rounded-l"
            animate={{
              height: ["100%", "70%", "100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        )}
      </div>
      <div className={`w-8 h-8 flex-shrink-0 ${isBot ? 'ml-2' : 'mr-2'}`}>
        <img
          src={isBot ? botAvatar : userAvatar}
          alt={isBot ? 'Asistente Avatar' : 'Usuario Avatar'}
          className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
        />
      </div>
    </motion.div>
  );
};

// Indicador de escritura con animación de goteo
const TypingIndicator = ({ botAvatar }) => (
  <motion.div
    className="flex self-start max-w-[80%]"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-2xl rounded-bl-md shadow-sm flex items-center justify-center min-w-[60px] min-h-[40px] border-l-4 border-primary-400">
      <div className="flex gap-1 items-end h-3">
        <motion.div
          className="w-2 h-2 bg-primary-400 dark:bg-primary-300 rounded-full"
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 1.3,
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
        <motion.div
          className="w-2 h-2 bg-primary-500 dark:bg-primary-400 rounded-full"
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 1.3,
            delay: 0.2,
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
        <motion.div
          className="w-2 h-2 bg-primary-600 dark:bg-primary-500 rounded-full"
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 1.3,
            delay: 0.4,
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
      </div>
    </div>
    <div className="w-8 h-8 ml-2">
      <img
        src={botAvatar}
        alt="Asistente Avatar"
        className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
      />
    </div>
  </motion.div>
);

// Opciones de respuesta rápida
const QuickReplies = ({ options, onSelect }) => (
  <div className="flex flex-wrap gap-2 mt-2 mb-4">
    <AnimatePresence>
      {options.map((option, index) => (
        <motion.button
          key={option}
          className="px-3 py-1.5 bg-white dark:bg-gray-800 text-primary-700 dark:text-primary-300 text-sm rounded-full border border-primary-200 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-gray-700 transition-colors shadow-sm flex items-center gap-1.5"
          onClick={() => onSelect(option)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ delay: index * 0.1 }}
        >
          <span className="text-primary-500 dark:text-primary-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
            </svg>
          </span>
          {option}
        </motion.button>
      ))}
    </AnimatePresence>
  </div>
);

const ChatWindow = ({
  messages,
  isTyping,
  onSendMessage,
  onClose,
  botName,
  botAvatar,
  userAvatar,
  quickReplies = []
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll al final cuando cambian los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus en el input cuando se abre el chat
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
      setShowQuickReplies(false);
    }
  };

  const handleQuickReply = (option) => {
    onSendMessage(option);
    setShowQuickReplies(false);
  };

  return (
    <div className="flex flex-col h-[500px] max-h-[calc(100vh-120px)] bg-white dark:bg-gray-800 rounded-2xl shadow-chat dark:shadow-chat-dark overflow-hidden">
      {/* Header con gradiente de agua */}
      <div className="flex items-center justify-between p-4 bg-gradient-water text-white relative overflow-hidden">
        {/* Efecto de ondas de agua en el header */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute inset-0 bg-water-pattern bg-repeat-x bg-contain"
            animate={{
              x: [0, -100, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
        </div>

        <div className="flex items-center relative z-10">
          <div className="relative">
            <img
              src={botAvatar}
              alt="Asistente Avatar"
              className="w-10 h-10 rounded-full border-2 border-white/50 mr-3"
            />
            <span className="absolute bottom-0 right-2 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <h3 className="text-base font-semibold">{botName}</h3>
            <div className="flex items-center text-xs opacity-90">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></span>
              Disponible
            </div>
          </div>
        </div>
        <div className="flex gap-2 relative z-10">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Información"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </button>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            onClick={onClose}
            aria-label="Cerrar chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Contenedor de mensajes */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-gray-50 dark:bg-gray-900 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            message={msg}
            botAvatar={botAvatar}
            userAvatar={userAvatar}
          />
        ))}

        {isTyping && <TypingIndicator botAvatar={botAvatar} />}

        {showQuickReplies && quickReplies.length > 0 && !isTyping &&
          messages[messages.length - 1]?.role === 'assistant' && (
            <QuickReplies
              options={quickReplies}
              onSelect={handleQuickReply}
            />
          )}

        <div ref={messagesEndRef} />
      </div>

      {/* Área de entrada */}
      <form
        className="flex p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 gap-3"
        onSubmit={handleSubmit}
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Escriba su consulta aquí..."
          className="flex-1 py-2.5 px-4 rounded-full border border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm outline-none transition-all"
        />
        <button
          type="submit"
          className={`w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center ${!inputValue.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-700'} transition-all`}
          disabled={!inputValue.trim()}
          aria-label="Enviar mensaje"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>

        {/* Botón para cargar imágenes o documentos (opcional) */}
        <button
          type="button"
          className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
          aria-label="Adjuntar archivo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
          </svg>
        </button>
      </form>

      {/* Pie de página con información de empresa */}
      <div className="py-2 px-4 text-xs text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <p>© HydroSolutions - Soluciones hídricas sostenibles</p>
      </div>
    </div>
  );
};

export default ChatWindow;
