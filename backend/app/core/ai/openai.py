import openai
from typing import List, Dict, Any, Optional
from pydantic import BaseModel


class Message(BaseModel):
    role: str
    content: str


class OpenAIClient:
    def __init__(self, api_key: str, model: str = "gpt-4o"):
        self.client = openai.OpenAI(api_key=api_key)
        self.model = model

    async def generate_response(
        self,
        messages: List[Message],
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1000,
    ) -> str:
        """
        Genera una respuesta utilizando el modelo de OpenAI
        """
        formatted_messages = []

        # Añadir system prompt si se proporciona
        if system_prompt:
            formatted_messages.append({"role": "system", "content": system_prompt})

        # Añadir el resto de mensajes
        for msg in messages:
            formatted_messages.append({"role": msg.role, "content": msg.content})

        # Realizar la llamada a la API
        response = self.client.chat.completions.create(
            model=self.model,
            messages=formatted_messages,
            temperature=temperature,
            max_tokens=max_tokens,
        )

        # Extraer y devolver el contenido de la respuesta
        return response.choices[0].message.content
