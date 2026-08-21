const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://127.0.0.1:8000'

async function fetchCurrentCourse() {
  const response = await fetch(`${API_BASE}/api/courses/current`)
  if (!response.ok) {
    throw new Error('Unable to fetch course data')
  }
  return response.json()
}

async function sendChatMessage({
  message,
  courseId,
  mentorMode = 'ask_anything',
  conversationId,
  assessmentQuestion,
  draftText,
  topK,
}) {
  const body = {
    message,
    course_id: courseId,
    mentor_mode: mentorMode,
    conversation_id: conversationId,
  }

  if (assessmentQuestion) {
    body.assessment_question = assessmentQuestion
  }

  if (draftText) {
    body.draft_text = draftText
  }

  if (topK) {
    body.top_k = topK
  }

  const response = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error('AI Mentor is not available right now')
  }

  return response.json()
}

export { fetchCurrentCourse, sendChatMessage }
