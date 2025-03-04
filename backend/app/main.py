from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from .core.ai.openai import OpenAIClient
from .core.ai.memory import ConversationMemory

# Cargar variables de entorno
load_dotenv()

app = FastAPI(title="Chatbot API")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, restringir a tu dominio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Modelos de datos
class Message(BaseModel):
    role: str  # "user" o "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: List[Message]
    system_prompt: Optional[str] = None
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    message: Message
    conversation_id: str


# Clientes de IA y gestión de memoria
openai_client = OpenAIClient(api_key=os.getenv("OPENAI_API_KEY"))
memory_manager = ConversationMemory()


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Recuperar o crear un historial de conversación
        conversation_id = (
            request.conversation_id or memory_manager.create_conversation()
        )
        conversation = memory_manager.get_conversation(conversation_id)

        # Añadir mensajes recientes a la conversación si no están ya
        for msg in request.messages:
            if msg not in conversation:
                memory_manager.add_message(conversation_id, msg)

        # Obtener respuesta del modelo
        response = await openai_client.generate_response(
            messages=memory_manager.get_messages(conversation_id),
            system_prompt=request.system_prompt,
        )

        # Guardar la respuesta en la memoria
        assistant_message = Message(role="assistant", content=response)
        memory_manager.add_message(conversation_id, assistant_message)

        return ChatResponse(message=assistant_message, conversation_id=conversation_id)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al procesar la solicitud: {str(e)}",
        )


@app.delete("/api/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str):
    try:
        memory_manager.delete_conversation(conversation_id)
        return {"status": "success", "message": "Conversación eliminada"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar la conversación: {str(e)}",
        )
