# AI Mentor Backend

This is a FastAPI backend skeleton for the AI Mentor application. It provides placeholder endpoints for health checks, course data, chat handling, and draft review.

## Run the backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Available endpoints

- `GET /health`
- `GET /api/courses/current`
- `POST /api/chat`
- `POST /api/draft-review`

## Retrieval test script

Run a retrieval test against the existing ChromaDB collection:

```bash
cd backend
python -m app.scripts.test_retrieval
```

To query a custom question:

```bash
python -m app.scripts.test_retrieval "What is this assignment about?"
```
