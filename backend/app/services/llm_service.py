import os
from typing import Any, Dict, List, Optional

import openai
from openai.error import OpenAIError
from app.core.config import settings
from app.schemas.chat import ChatSource

SYSTEM_PROMPT = (
    "You are an AI Mentor for learners.\n\n"
    "Before answering, follow this decision order:\n"
    "1. Missing or ambiguous learner information: If the request needs learner content that was not supplied, or uses an unclear reference such as 'this', ask one concise clarification question and stop. Do not infer missing learner content from retrieved chunks.\n"
    "2. Submission-ready assessed work: If the learner asks for complete or directly submittable assessed work, do not generate it. This includes complete aims/objectives, conclusions, methodologies, literature reviews, report sections, or other assignment content. Do not bypass this by calling it an example, sample, suggested answer, or draft if it is effectively ready to submit. Instead, explain requirements, give a structure/checklist, ask guiding questions, review learner-written text, identify weaknesses, or suggest improvements, then stop.\n"
    "3. Evidence sufficiency: Use retrieved CPL chunks as the source of truth. If no relevant CPL context is available, say that the available CPL materials do not provide enough information. Do not answer from general knowledge and do not redirect to external/general resources. If a requested number, percentage, rule, deadline, requirement, or exact claim is not explicitly supported by the retrieved material, say it is not specified.\n"
    "4. Normal mentoring: If the steps above do not prevent answering, answer using the retrieved CPL material. Explain clearly, be concise and supportive, guide rather than unnecessarily completing work, and encourage appropriate use of course materials.\n"
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


def build_review_draft_prompt(
    message: str,
    draft_text: str,
    retrieval_context: List[Dict[str, Any]],
    assessment_question: Optional[str] = None,
) -> str:
    prompt_parts = [
        "Mentor mode: review_draft",
        "The learner wants guidance on their current answer.",
        f"Review instruction or follow-up message: {message}",
    ]

    if assessment_question and assessment_question.strip():
        prompt_parts.extend([
            "\nAssessment question or task:",
            assessment_question.strip(),
        ])

    prompt_parts.extend([
        "\nLearner answer:",
        draft_text.strip(),
        "\nRetrieved CPL evidence (use this as the source of truth):",
    ])

    if not retrieval_context:
        prompt_parts.append(
            "No relevant Rubric, Assignment Brief, or Learning Material chunks were retrieved."
            " Tell the learner that the available CPL evidence is insufficient for a course-grounded draft review."
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
        "\nReview the learner answer against only the retrieved CPL evidence."
        " Compare the learner answer with the assessment question when one is provided."
        " Keep the response concise, learner-friendly, and easy to scan."
        " Use this structure exactly:"
        "\n1. What you did well - maximum 3 bullets."
        "\n2. What needs improvement - maximum 4 important areas. For each area, briefly state what is weak or missing, why it matters, and what to do."
        "\n3. What to work on first - one clear priority."
        "\n4. Relevant course materials - short list of the most relevant retrieved CPL materials or concepts."
        " Avoid long paragraphs and unnecessary repetition."
        " Do not assign or estimate a grade. Do not replace the autograder."
        " Do not generate a complete replacement submission."
        " Do not invent requirements not supported by the retrieved evidence."
        " Clearly say when the retrieved evidence is insufficient."
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
                model='gpt-5.4-mini',
                messages=[
                    {'role': 'system', 'content': SYSTEM_PROMPT},
                    {'role': 'user', 'content': user_prompt},
                ],
                temperature=0.2,
                max_completion_tokens=500,
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

    def generate_review_draft_response(
        self,
        message: str,
        draft_text: str,
        assessment_question: Optional[str] = None,
        conversation_id: Optional[str] = None,
        retrieval_context: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        if not message or not message.strip():
            raise ValueError('The message must not be empty.')
        if not draft_text or not draft_text.strip():
            raise ValueError('draft_text must not be empty for review_draft mode.')

        retrieval_context = retrieval_context or []
        user_prompt = build_review_draft_prompt(
            message,
            draft_text,
            retrieval_context,
            assessment_question=assessment_question,
        )

        try:
            response = openai.ChatCompletion.create(
                model='gpt-5.4-mini',
                messages=[
                    {'role': 'system', 'content': SYSTEM_PROMPT},
                    {'role': 'user', 'content': user_prompt},
                ],
                temperature=0.2,
                max_completion_tokens=1500,
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
