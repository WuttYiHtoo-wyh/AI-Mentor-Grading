from fastapi import APIRouter, HTTPException
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.conversation_router import get_conversational_response
from app.services.llm_service import LLMService
from app.services.retrieval_service import retrieve_cpl_context, retrieve_review_draft_context

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
def post_chat(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message must not be empty.")

    try:
        if request.mentor_mode == "review_draft":
            if not request.draft_text:
                raise ValueError("draft_text must not be empty for review_draft mode.")

            retrieval_context = retrieve_review_draft_context(
                message=request.message,
                course_id=request.course_id,
            )

            llm = LLMService()
            return llm.generate_review_draft_response(
                message=request.message,
                draft_text=request.draft_text,
                conversation_id=request.conversation_id,
                retrieval_context=retrieval_context,
            )

        conversational_response = get_conversational_response(
            message=request.message,
            conversation_id=request.conversation_id,
        )
        if conversational_response:
            return conversational_response

        retrieval_context = retrieve_cpl_context(
            query=request.message,
            course_id=request.course_id,
            mentor_mode=request.mentor_mode,
            top_k=request.top_k,
        )

        llm = LLMService()
        return llm.generate_chat_response(
            message=request.message,
            conversation_id=request.conversation_id,
            mentor_mode=request.mentor_mode,
            retrieval_context=retrieval_context,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except RuntimeError as exc:
        raise HTTPException(status_code=502, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Unable to generate a response right now.")
