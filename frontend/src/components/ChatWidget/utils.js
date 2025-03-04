// components/ChatWidget/utils.js

// Formatear tiempo para los mensajes
export const formatTime = (date) => {
  if (!date) return '';

  const now = new Date();
  const messageDate = new Date(date);

  // Si es hoy, mostrar hora
  if (now.toDateString() === messageDate.toDateString()) {
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Si es ayer
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (yesterday.toDateString() === messageDate.toDateString()) {
    return 'Ayer ' + messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Otro día
  return messageDate.toLocaleDateString([], {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  }) + ' ' + messageDate.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Hacer una pausa
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Parsear el contenido del mensaje para gestionar formatos especiales
export const parseMessageContent = (content) => {
  if (!content) return '';

  // Evitar procesamiento doble si el contenido ya parece HTML
  if (content.trim().startsWith('<p') || content.trim().startsWith('<div')) {
    return content;
  }

  // Procesa los enlaces
  content = content.replace(
    /(https?:\/\/[^\s]+)/g,
    '<a href="$1" target="_blank" class="text-primary-600 dark:text-primary-400 underline hover:text-primary-800 dark:hover:text-primary-300">$1</a>'
  );

  // Procesa términos del dominio hídrico para resaltarlos
  const hydricTerms = [
    'agua', 'eficiencia hídrica', 'soluciones hídricas', 'tratamiento de agua',
    'purificación', 'sistema de filtrado', 'reutilización', 'sostenible',
    'consumo eficiente', 'ahorro de agua', 'tecnología hídrica'
  ];

  hydricTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    content = content.replace(
      regex,
      match => `<span class="text-secondary-600 dark:text-secondary-400 font-medium">${match}</span>`
    );
  });

  // Procesa emojis relacionados con agua y sostenibilidad
  const waterEmojis = {
    ':water_drop:': '💧',
    ':droplet:': '💧',
    ':ocean:': '🌊',
    ':potable_water:': '🚰',
    ':recycle:': '♻️',
    ':seedling:': '🌱',
    ':evergreen_tree:': '🌲',
    ':deciduous_tree:': '🌳',
    ':earth_americas:': '🌎',
    ':earth_africa:': '🌍',
    ':earth_asia:': '🌏'
  };

  Object.entries(waterEmojis).forEach(([text, emoji]) => {
    content = content.replace(new RegExp(text, 'g'), emoji);
  });

  // Procesa elementos de lista
  content = content.replace(/^\s*[-*]\s(.+)$/gm, '<li>$1</li>');
  content = content.replace(/(<li>.*<\/li>)/gs, '<ul class="list-disc ml-5 my-2">$1</ul>');

  // Procesa párrafos
  content = content.replace(/\n\n/g, '</p><p class="mb-2">');

  // Procesa valores numéricos y unidades relacionadas con agua (m³, L, etc.)
  content = content.replace(
    /(\d+(?:\.\d+)?)\s*(m³|L|litros|gal|galones)/gi,
    '<span class="font-semibold text-primary-700 dark:text-primary-300">$1 $2</span>'
  );

  // Envuelve el contenido en un párrafo si no está vacío
  if (content.trim() !== '') {
    content = `<p class="mb-2">${content}</p>`;
  }

  return content;
};

// Función para formatear cantidades numéricas (litros, m³)
export const formatWaterQuantity = (value, unit) => {
  if (!value) return '0';

  // Formatear número con separadores de miles
  const formattedValue = new Intl.NumberFormat().format(value);

  if (unit) {
    return `${formattedValue} ${unit}`;
  }

  return formattedValue;
};

// Convertir entre unidades hídricas
export const convertWaterUnits = (value, fromUnit, toUnit) => {
  // Primero convertimos a litros como unidad base
  let liters = 0;

  switch (fromUnit.toLowerCase()) {
    case 'l':
    case 'litro':
    case 'litros':
      liters = value;
      break;
    case 'm3':
    case 'm³':
      liters = value * 1000;
      break;
    case 'gal':
    case 'galon':
    case 'galones':
      liters = value * 3.78541;
      break;
    default:
      return value;
  }

  // Ahora convertimos de litros a la unidad destino
  switch (toUnit.toLowerCase()) {
    case 'l':
    case 'litro':
    case 'litros':
      return liters;
    case 'm3':
    case 'm³':
      return liters / 1000;
    case 'gal':
    case 'galon':
    case 'galones':
      return liters / 3.78541;
    default:
      return liters;
  }
};
