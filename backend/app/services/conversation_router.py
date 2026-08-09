import re
from typing import Any, Dict, Optional


COURSE_REDIRECT = (
    "I'm mainly here to help with your course and learning activities. Try asking me about your assignment, "
    "research, project planning, rubric, or another course topic."
)

CAPABILITY_RESPONSE = (
    "I'm AI-Mentor, Htoo Wutt Yi, your learning companion for this course. I can help explain course topics, "
    "assignment requirements and rubrics, and provide guidance on your draft using available course materials."
)

COURSE_KEYWORDS = {
    "assignment",
    "rubric",
    "criterion",
    "criteria",
    "draft",
    "paragraph",
    "research",
    "project",
    "planning",
    "gantt",
    "chart",
    "primary",
    "secondary",
    "survey",
    "participants",
    "limitation",
    "limitations",
    "method",
    "methods",
    "reflection",
    "evaluate",
    "evaluation",
    "course",
    "cpl",
    "module",
    "topic",
}


def normalize_message(message: str) -> str:
    return re.sub(r"\s+", " ", message.strip().lower())


def chat_response(answer: str, conversation_id: Optional[str]) -> Dict[str, Any]:
    return {
        "answer": answer,
        "sources": [],
        "conversation_id": conversation_id or "demo-conversation-1",
    }


def extract_name(message: str) -> Optional[str]:
    patterns = [
        r"^(?:hi|hello|hey)[,!\s]+(?:i am|i'm|my name is)\s+([a-z][a-z .'-]{0,40})[.!]?$",
        r"^(?:i am|i'm|my name is)\s+([a-z][a-z .'-]{0,40})[.!]?$",
    ]
    normalized = normalize_message(message)
    for pattern in patterns:
        match = re.match(pattern, normalized)
        if match:
            name = match.group(1).strip(" .!'")
            if name:
                return " ".join(part.capitalize() for part in name.split())
    return None


def contains_course_signal(message: str) -> bool:
    words = set(re.findall(r"[a-z]+", normalize_message(message)))
    return bool(words & COURSE_KEYWORDS)


def get_conversational_response(message: str, conversation_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
    normalized = normalize_message(message)
    stripped = normalized.strip(" .!?")

    name = extract_name(message)
    if name:
        return chat_response(
            f"Hi {name}! Nice to meet you. What would you like help with in your course today?",
            conversation_id,
        )

    greeting_responses = {
        "hi": "Hi! How can I help you with your course today?",
        "hello": "Hello! How can I help you with your course today?",
        "hey": "Hi! How can I help you with your course today?",
        "good morning": "Good morning! What would you like help with today?",
        "good afternoon": "Good afternoon! What would you like help with today?",
        "good evening": "Good evening! What would you like help with today?",
        "how are you": "I'm here and ready to help. What would you like to work on in your course today?",
        "thank you": "You're welcome! Let me know if you need help with anything else in your course.",
        "thanks": "You're welcome! Let me know if you need help with anything else in your course.",
        "bye": "Goodbye! Come back anytime you need help with your course.",
        "see you": "See you! Come back anytime you need help with your course.",
        "nice to meet you": "Nice to meet you too. What would you like help with in your course today?",
    }
    if stripped in greeting_responses:
        return chat_response(greeting_responses[stripped], conversation_id)

    low_context_patterns = {
        "can you help me",
        "help me",
        "can you explain this",
        "explain this",
        "what should i do",
    }
    if stripped in low_context_patterns:
        return chat_response(
            "Of course. Tell me what you're working on, such as your assignment, rubric, research, or a course topic.",
            conversation_id,
        )

    identity_patterns = {
        "who are you",
        "what can you do",
        "how can you help me",
        "how do i use ai-mentor",
        "how do i use ai mentor",
        "what can you help me with",
    }
    if stripped in identity_patterns:
        return chat_response(CAPABILITY_RESPONSE, conversation_id)

    if re.match(r"^(who is|who are|do you know)\b", stripped) and not contains_course_signal(stripped):
        return chat_response(COURSE_REDIRECT, conversation_id)

    return None
