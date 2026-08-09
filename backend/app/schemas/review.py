from pydantic import BaseModel
from typing import List


class DraftReviewRequest(BaseModel):
    course_id: str
    task_id: str
    draft_text: str


class DraftReviewResponse(BaseModel):
    strengths: List[str]
    weaknesses: List[str]
    missing_requirements: List[str]
    estimated_score: int
    suggestions: List[str]
