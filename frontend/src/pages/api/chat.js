// pages/api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    // Esta es una versión mock para pruebas
    // Aquí es donde conectarías con OpenAI u otro proveedor de IA

    // Simulación de respuesta con un pequeño retraso
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Ejemplo básico de respuesta
    // En una implementación real, pasarías los mensajes a la API de OpenAI o similar
    const lastMessage = messages[messages.length - 1].content.toLowerCase();
    let response;

    if (lastMessage.includes('hola') || lastMessage.includes('buenos días') || lastMessage.includes('buenas tardes')) {
      response = '¡Hola! ¿En qué puedo ayudarte hoy?';
    } else if (lastMessage.includes('gracias')) {
      response = '¡De nada! Estoy aquí para ayudarte.';
    } else if (lastMessage.includes('adiós') || lastMessage.includes('hasta luego')) {
      response = '¡Hasta pronto! No dudes en volver si necesitas más ayuda.';
    } else {
      response = 'Entiendo tu mensaje. En una implementación real, aquí conectaríamos con OpenAI u otro proveedor para generar una respuesta más inteligente.';
    }

    return res.status(200).json({ response });
  } catch (error) {
    console.error('Error in chat API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
