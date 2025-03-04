// components/ChatWidget/ChatButton.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ChatButton = ({ onClick, isOpen, unreadCount }) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Efecto de "burbujeo" periódico para llamar la atención
  useEffect(() => {
    if (!isOpen) {
      // Iniciar animación después de 10 segundos
      const timeoutId = setTimeout(() => {
        setShouldAnimate(true);
      }, 10000);

      // Detener animación después de 3 segundos
      const animationTimeoutId = setTimeout(() => {
        setShouldAnimate(false);
      }, 13000);

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(animationTimeoutId);
      };
    }
  }, [isOpen]);

  // Reiniciar la animación periódicamente
  useEffect(() => {
    if (!isOpen) {
      const intervalId = setInterval(() => {
        setShouldAnimate(true);

        setTimeout(() => {
          setShouldAnimate(false);
        }, 3000);
      }, 60000); // Cada minuto

      return () => clearInterval(intervalId);
    }
  }, [isOpen]);

  return (
    <motion.button
      className="w-16 h-16 rounded-full bg-primary-600 text-white shadow-chat flex items-center justify-center relative overflow-hidden"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={shouldAnimate ? { y: [0, -8, 0] } : {}}
      transition={shouldAnimate ? {
        duration: 1.5,
        ease: "easeInOut",
        times: [0, 0.5, 1],
        repeat: 1
      } : {}}
      aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
    >
      {/* Ondas de agua en el fondo del botón */}
      {!isOpen && (
        <>
          <motion.div
            className="absolute inset-0 bg-primary-500 opacity-30 rounded-full"
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div
            className="absolute inset-0 bg-secondary-500 opacity-20 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </>
      )}

      {isOpen ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      ) : (
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>

          {/* Gota de agua (solo visible cuando no hay mensajes no leídos) */}
          {!unreadCount && (
            <motion.div
              className="absolute -top-1 -right-1 text-blue-300"
              animate={{ y: [0, 3, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
              </svg>
            </motion.div>
          )}
        </div>
      )}

      {!isOpen && unreadCount > 0 && (
        <motion.span
          className="absolute -top-1 -right-1 bg-eco-500 text-white text-xs font-bold min-w-5 h-5 rounded-full flex items-center justify-center px-1.5 shadow-md"
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
