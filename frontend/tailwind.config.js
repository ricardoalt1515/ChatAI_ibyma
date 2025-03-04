/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // o 'media' si prefieres basarte en la configuración del sistema
  theme: {
    extend: {
      colors: {
        // Colores principales - azules que evocan agua limpia
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Azul principal para elementos clave
          600: '#0284c7', // Color principal para botones/acentos
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        // Colores secundarios - tonos turquesa para innovación tecnológica
        secondary: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4', // Turquesa para acentos secundarios
          600: '#0891b2', // Color secundario para elementos interactivos
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        // Colores de sostenibilidad - verdes para elementos complementarios
        eco: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Verde para elementos relacionados con sostenibilidad
          600: '#16a34a', // Verde más oscuro para contrastes
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
      },
      animation: {
        'wave': 'wave 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      },
      boxShadow: {
        'chat': '0 10px 25px -5px rgba(2, 132, 199, 0.2), 0 10px 10px -5px rgba(2, 132, 199, 0.1)',
        'chat-dark': '0 10px 25px -5px rgba(8, 47, 73, 0.3), 0 10px 10px -5px rgba(8, 47, 73, 0.2)',
      },
      backgroundImage: {
        'water-pattern': "url('/images/water-pattern.svg')",
        'gradient-water': 'linear-gradient(135deg, #0284c7, #0891b2)',
      },
    },
  },
  plugins: [],
}
