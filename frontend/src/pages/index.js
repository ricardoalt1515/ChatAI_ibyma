// pages/index.js
import Head from 'next/head';
import { useState } from 'react';
import ChatWidget from '../components/ChatWidget';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState('purple');

  // Colores del tema
  const themes = {
    purple: { primary: '#7C3AED', accent: '#4F46E5' },
    blue: { primary: '#2563EB', accent: '#1D4ED8' },
    teal: { primary: '#0D9488', accent: '#0F766E' },
    pink: { primary: '#DB2777', accent: '#BE185D' },
    orange: { primary: '#EA580C', accent: '#C2410C' }
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleChangeTheme = (themeName) => {
    setTheme(themeName);
  };

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'dark' : ''}`}>
      <Head>
        <title>AI Chatbot Demo - Modern UI</title>
        <meta name="description" content="Un chatbot moderno de IA con una interfaz elegante" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <main className="py-20 flex flex-col justify-center items-center max-w-3xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white">
          AI Chatbot Widget <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600">Moderno</span>
        </h1>

        <p className="mt-6 text-xl text-center text-gray-600 dark:text-gray-300">
          Un widget de chat elegante, personalizable y fácil de integrar
        </p>

        <div className="mt-10 flex flex-wrap gap-8 justify-center w-full">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">Color del tema:</h3>
            <div className="flex gap-3">
              {Object.entries(themes).map(([name, colors]) => (
                <button
                  key={name}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${theme === name
                      ? 'scale-110 border-white dark:border-gray-900 shadow-lg'
                      : 'border-gray-200 dark:border-gray-700'
                    }`}
                  style={{ backgroundColor: colors.primary }}
                  onClick={() => handleChangeTheme(name)}
                  aria-label={`Tema ${name}`}
                />
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">Modo oscuro:</h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={handleToggleDarkMode}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                {darkMode ? 'Activado' : 'Desactivado'}
              </span>
            </label>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4 text-primary-600 dark:text-primary-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Interfaz Moderna</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Diseño limpio y profesional con animaciones fluidas</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4 text-primary-600 dark:text-primary-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personalizable</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Adapta colores, avatares y mensajes a tu marca</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mb-4 text-primary-600 dark:text-primary-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Fácil Integración</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Simple de implementar en cualquier sitio web</p>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400">
        <p>Diseñado con Next.js, React y Tailwind CSS</p>
      </footer>

      {/* Widget de Chat */}
      <ChatWidget
        botName="IA Asistente"
        botAvatar="/images/bot-avatar.png"
        userAvatar="/images/user-avatar.png"
        primaryColor={themes[theme].primary}
        accentColor={themes[theme].accent}
        position="right"
        initialMessage="👋 ¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?"
        darkMode={darkMode}
      />
    </div>
  );
}
