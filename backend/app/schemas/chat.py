from pydantic import BaseModel, field_validator
from typing import List, Optional


class ChatRequest(BaseModel):
    message: str
    course_id: str
    mentor_mode: Optional[str] = 'ask_anything'
    top_k: Optional[int] = 5
    conversation_id: Optional[str] = None

    @field_validator('message')
    @classmethod
    def validate_message(cls, value: str) -> str:
        if not value or not value.strip():
            raise ValueError('Message must not be empty.')
        return value.strip()

    @field_validator('mentor_mode')
    @classmethod
    def validate_mentor_mode(cls, value: Optional[str]) -> str:
        if not value:
            return 'ask_anything'
        allowed = {'explain_assignment', 'explain_rubric', 'explain_topic', 'review_draft', 'ask_anything'}
        normalized = value.strip()
        if normalized not in allowed:
            raise ValueError(f"mentor_mode must be one of {sorted(allowed)}")
        return normalized

    @field_validator('top_k')
    @classmethod
    def validate_top_k(cls, value: Optional[int]) -> int:
        if value is None:
            return 5
        if value <= 0:
            raise ValueError('top_k must be greater than zero.')
        return value


class ChatSource(BaseModel):
    title: str
    section: str


class ChatResponse(BaseModel):
    answer: str
    sources: List[ChatSource]
    conversation_id: str
