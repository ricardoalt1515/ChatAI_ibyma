// pages/index.js
import Head from 'next/head';
import Chat from '../components/Chat';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>AI Chatbot Demo</title>
        <meta name="description" content="Un chatbot moderno de IA" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          AI Chatbot Demo
        </h1>

        <p className={styles.description}>
          Chatbot moderno y personalizable con Next.js y React
        </p>

        <div className={styles.chatWrapper}>
          <Chat
            botName="IA Asistente"
            primaryColor="#4F46E5"
            initialMessage="¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?"
          />
        </div>

        <div className={styles.infoSection}>
          <h2>Características</h2>
          <ul>
            <li>Interfaz moderna y responsive</li>
            <li>Fácil personalización (colores, avatares, mensajes)</li>
            <li>Indicador de escritura</li>
            <li>Memoria de conversación</li>
            <li>Adaptable a cualquier API de IA</li>
          </ul>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Powered by Next.js y APIs de IA</p>
      </footer>
    </div>
  );
}
