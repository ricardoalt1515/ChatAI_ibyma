
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
