// components/Chat/ChatHeader.jsx
import styles from './Chat.module.css';

const ChatHeader = ({ botName, botAvatar }) => {
  return (
    <div className={styles.header}>
      <div className={styles.botInfo}>
        <img src={botAvatar} alt="Bot Avatar" className={styles.botAvatar} />
        <h3 className={styles.botName}>{botName}</h3>
      </div>
      <div className={styles.onlineIndicator}></div>
    </div>
  );
};

export default ChatHeader;
