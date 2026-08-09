from fastapi import APIRouter, HTTPException
from app.schemas.review import DraftReviewRequest, DraftReviewResponse
from app.services.mentor_service import mentor_service

router = APIRouter(prefix="/api/draft-review", tags=["draft-review"])


@router.post("", response_model=DraftReviewResponse)
def post_draft_review(request: DraftReviewRequest):
    try:
        return mentor_service.review_draft(
            course_id=request.course_id,
            task_id=request.task_id,
            draft_text=request.draft_text
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
