from fastapi import APIRouter, HTTPException
from app.services.mentor_service import mentor_service

router = APIRouter(prefix="/api/courses", tags=["courses"])


@router.get("/current")
def get_current_course():
    try:
        return mentor_service.get_current_course()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
