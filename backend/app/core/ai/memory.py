import uuid
from typing import Dict, List, Optional
from pydantic import BaseModel
import json
import time


class Message(BaseModel):
    role: str
    content: str


class Conversation(BaseModel):
    id: str
    messages: List[Message]
    created_at: float
    updated_at: float


class ConversationMemory:
    def __init__(self, max_conversations: int = 1000, conversation_ttl: int = 86400):
        """
        Inicializa el gestor de memoria para conversaciones

        Args:
            max_conversations: Número máximo de conversaciones a almacenar
            conversation_ttl: Tiempo de vida de una conversación en segundos (default: 24 horas)
        """
        self.conversations: Dict[str, Conversation] = {}
        self.max_conversations = max_conversations
        self.conversation_ttl = conversation_ttl

    def create_conversation(self) -> str:
        """Crea una nueva conversación y devuelve su ID"""
        # Limpiar conversaciones antiguas si es necesario
        self._cleanup_old_conversations()

        conversation_id = str(uuid.uuid4())
        now = time.time()

        self.conversations[conversation_id] = Conversation(
            id=conversation_id, messages=[], created_at=now, updated_at=now
        )

        return conversation_id

    def get_conversation(self, conversation_id: str) -> List[Message]:
        """Obtiene los mensajes de una conversación"""
        if conversation_id not in self.conversations:
            return []

        return self.conversations[conversation_id].messages

    def add_message(self, conversation_id: str, message: Message) -> None:
        """Añade un mensaje a una conversación"""
        if conversation_id not in self.conversations:
            conversation_id = self.create_conversation()

        self.conversations[conversation_id].messages.append(message)
        self.conversations[conversation_id].updated_at = time.time()

    def get_messages(self, conversation_id: str) -> List[Message]:
        """Obtiene todos los mensajes de una conversación"""
        if conversation_id not in self.conversations:
            return []

        return self.conversations[conversation_id].messages

    def delete_conversation(self, conversation_id: str) -> None:
        """Elimina una conversación"""
        if conversation_id in self.conversations:
            del self.conversations[conversation_id]

    def _cleanup_old_conversations(self) -> None:
        """Limpia conversaciones antiguas o excedentes"""
        now = time.time()

        # Eliminar conversaciones expiradas
        expired_ids = [
            conv_id
            for conv_id, conv in self.conversations.items()
            if now - conv.updated_at > self.conversation_ttl
        ]

        for conv_id in expired_ids:
            del self.conversations[conv_id]

        # Si todavía hay demasiadas conversaciones, eliminar las más antiguas
        if len(self.conversations) >= self.max_conversations:
            sorted_convs = sorted(
                self.conversations.items(), key=lambda x: x[1].updated_at
            )

            # Eliminar el 20% más antiguo
            num_to_delete = max(1, len(self.conversations) // 5)
            for i in range(num_to_delete):
                if i < len(sorted_convs):
                    del self.conversations[sorted_convs[i][0]]
