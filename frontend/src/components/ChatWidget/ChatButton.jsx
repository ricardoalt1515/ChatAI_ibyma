// components/ChatWidget/ChatButton.jsx
import { motion } from 'framer-motion';

const ChatButton = ({ onClick, isOpen, unreadCount }) => {
  return (
    <motion.button
      className="w-16 h-16 rounded-full bg-primary-600 text-white shadow-chat flex items-center justify-center relative"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
    >
      {isOpen ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      )}

      {!isOpen && unreadCount > 0 && (
        <motion.span
          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold min-w-5 h-5 rounded-full flex items-center justify-center px-1.5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          {unreadCount}
        </motion.span>
      )}
    </motion.button>
  );
};

export default ChatButton;
