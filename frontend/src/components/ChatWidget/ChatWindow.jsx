import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { formatTime } from './utils';

// Componente de burbuja de mensaje
const MessageBubble = ({ message, botAvatar, userAvatar }) => {
  const isBot = message.role === 'assistant';

  return (
    <motion.div
      className={`flex max-w-[80%] ${isBot ? 'self-start' : 'self-end flex-row-reverse'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`relative px-4 py-3 rounded-2xl ${isBot
        ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100 rounded-bl-md'
        : 'bg-primary-600 text-white rounded-br-md'
        } shadow-sm`}>
        {message.content}
        <span className="block text-xs mt-1.5 opacity-70 text-right">
          {formatTime(message.timestamp)}
        </span>
      </div>
      <div className={`w-8 h-8 flex-shrink-0 ${isBot ? 'ml-2' : 'mr-2'}`}>
        <img
          src={isBot ? botAvatar : userAvatar}
          alt={isBot ? 'Bot Avatar' : 'User Avatar'}
          className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
        />
      </div>
    </motion.div>
  );
};

// Indicador de escritura
const TypingIndicator = ({ botAvatar }) => (
  <motion.div
    className="flex self-start max-w-[80%]"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md shadow-sm flex items-center justify-center min-w-[60px] min-h-[40px]">
      <div className="flex gap-1">
        <span className="typing-dot"></span>
        <span className="typing-dot"></span>
        <span className="typing-dot"></span>
      </div>
    </div>
    <div className="w-8 h-8 ml-2">
      <img
        src={botAvatar}
        alt="Bot Avatar"
        className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
      />
    </div>
  </motion.div>
);

const ChatWindow = ({
  messages,
  isTyping,
  onSendMessage,
  onClose,
  botName,
  botAvatar,
  userAvatar
}) => {
  const [inputValue, setInputValue] = useState('');
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
    }
  };

  return (
    <div className="flex flex-col h-[500px] max-h-[calc(100vh-120px)] bg-white dark:bg-gray-800 rounded-2xl shadow-chat overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="flex items-center">
          <img
            src={botAvatar}
            alt="Bot Avatar"
            className="w-10 h-10 rounded-full border-2 border-white/50 mr-3"
          />
          <div>
            <h3 className="text-base font-semibold">{botName}</h3>
            <div className="flex items-center text-xs opacity-90">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-1.5"></span>
              Online
            </div>
          </div>
        </div>
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

      {/* Contenedor de mensajes */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-gray-50 dark:bg-gray-900">
        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            message={msg}
            botAvatar={botAvatar}
            userAvatar={userAvatar}
          />
        ))}

        {isTyping && <TypingIndicator botAvatar={botAvatar} />}

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
          placeholder="Escribe un mensaje..."
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
      </form>
    </div>
  );
};

export default ChatWindow;
