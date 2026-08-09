import os
from typing import Any, Dict, List, Optional

import openai
from openai.error import OpenAIError
from app.core.config import settings
from app.schemas.chat import ChatSource

SYSTEM_PROMPT = (
    "You are an AI Mentor for learners.\n\n"
    "Your role is to:\n"
    "- explain concepts clearly\n"
    "- ask follow-up questions when the learner’s question is unclear\n"
    "- guide learners instead of completing assignments for them\n"
    "- encourage learners to review course materials\n"
    "- provide concise, supportive responses\n\n"
    "Important instructions:\n"
    "- Use the retrieved CPL course material chunks as the primary source of truth.\n"
    "- Answer based on the content of the retrieved CPL course materials.\n"
    "- If the retrieved context is insufficient, clearly say that the course materials do not contain enough information instead of inventing an answer.\n"
    "- Do not make up facts that are not present in the retrieved chunks.\n"
)


def build_retrieval_prompt(message: str, mentor_mode: str, retrieval_context: List[Dict[str, Any]]) -> str:
    prompt_parts = [
        f"Mentor mode: {mentor_mode}",
        "The learner's question is below.",
        f"Question: {message}",
        "\nRetrieved course material chunks (use them to answer):",
    ]

    if not retrieval_context:
        prompt_parts.append(
            "No relevant course material chunks were retrieved for this query."
            " If you cannot answer from the retrieved CPL materials, say that the course materials do not contain enough information."
        )
    else:
        for idx, item in enumerate(retrieval_context, start=1):
            prompt_parts.append(
                f"Chunk {idx}:"
                f"\n- chunk_id: {item.get('chunk_id', 'unknown')}"
                f"\n- title: {item.get('title', 'unknown')}"
                f"\n- document_type: {item.get('document_type', 'unknown')}"
                f"\n- instructional_unit: {item.get('instructional_unit', 'unknown')}"
                f"\n- source_file: {item.get('source_file', 'unknown')}"
                f"\n- content: {item.get('content', '').strip()}"
            )

    prompt_parts.append(
        "\nUse the retrieved course material chunks above as the primary evidence for your answer."
        " If the information is not in the retrieved chunks, tell the learner that the course materials do not contain enough information."
    )
    return "\n\n".join(prompt_parts)


class LLMService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.openai_api_key or os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError('Missing OPENAI_API_KEY environment variable')

        openai.api_key = self.api_key

    def generate_chat_response(
        self,
        message: str,
        conversation_id: Optional[str] = None,
        mentor_mode: str = 'ask_anything',
        retrieval_context: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        if not message or not message.strip():
            raise ValueError('The message must not be empty.')

        retrieval_context = retrieval_context or []
        user_prompt = build_retrieval_prompt(message, mentor_mode, retrieval_context)

        try:
            response = openai.ChatCompletion.create(
                model='gpt-3.5-turbo',
                messages=[
                    {'role': 'system', 'content': SYSTEM_PROMPT},
                    {'role': 'user', 'content': user_prompt},
                ],
                temperature=0.2,
                max_tokens=500,
            )

            message_obj = response.choices[0].message
            answer = message_obj['content'].strip() if message_obj else ''
            sources: List[ChatSource] = []
            for item in retrieval_context[:5]:
                section = item.get('instructional_unit') or item.get('document_type') or 'CPL Material'
                sources.append(ChatSource(title=item.get('title', 'Unknown'), section=section))

            return {
                'answer': answer,
                'sources': sources,
                'conversation_id': conversation_id or 'demo-conversation-1',
            }
        except OpenAIError as exc:
            raise RuntimeError(f'OpenAI API error: {exc}')
        except Exception as exc:
            raise RuntimeError(f'LLM request failed: {exc}')


def get_llm_service(api_key: Optional[str] = None) -> LLMService:
    return LLMService(api_key=api_key)
