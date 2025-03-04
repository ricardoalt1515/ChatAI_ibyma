// components/Chat/ChatMessage.jsx
import styles from './Chat.module.css';

const ChatMessage = ({ message, botAvatar, userAvatar }) => {
  const isBot = message.role === 'assistant';

  return (
    <div className={`${styles.messageWrapper} ${isBot ? styles.botMessage : styles.userMessage}`}>
      <div className={styles.avatarContainer}>
        <img
          src={isBot ? botAvatar : userAvatar}
          alt={isBot ? 'Bot Avatar' : 'User Avatar'}
          className={styles.avatar}
        />
      </div>
      <div className={styles.messageContent}>
        {message.content}
      </div>
    </div>
  );
};

export default ChatMessage;
