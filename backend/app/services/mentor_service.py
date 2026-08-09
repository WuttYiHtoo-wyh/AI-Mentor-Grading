from typing import Dict, Any

from app.schemas.chat import ChatResponse, ChatSource
from app.schemas.review import DraftReviewResponse


class MentorService:
    def get_current_course(self) -> Dict[str, Any]:
        return {
            "course_id": "fdad-fed",
            "title": "HDSE-CPL-Capstone Project - Application Development",
            "term": "Summer 2026",
            "endDate": "Tue, Jun 30, 2026",
            "instructor": "AI Mentor Team",
            "handouts": [
                {"id": 1, "title": "FDAD-FED Course Handbook", "type": "PDF"}
            ],
            "progress": {
                "completed_modules": 3,
                "total_modules": 8,
                "completion_rate": 37
            }
        }

    def create_chat_response(self, message: str, course_id: str, conversation_id: str | None) -> ChatResponse:
        sources = [
            ChatSource(title="Assignment Brief", section="Task 1")
        ]
        return ChatResponse(
            answer="This is a temporary AI Mentor response.",
            sources=sources,
            conversation_id=conversation_id or "demo-conversation-1"
        )

    def review_draft(self, course_id: str, task_id: str, draft_text: str) -> DraftReviewResponse:
        return DraftReviewResponse(
            strengths=["Clear introduction"],
            weaknesses=["Limited connection to the scenario"],
            missing_requirements=["Evidence from IU2"],
            estimated_score=65,
            suggestions=["Connect the explanation to the assignment scenario"]
        )


mentor_service = MentorService()
