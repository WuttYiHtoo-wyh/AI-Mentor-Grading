import React, { useEffect, useState } from 'react'

const inputPlaceholders = {
  ask_anything: 'Ask a question about your course...',
  review_draft: 'Ask a follow-up question...',
}

const askAnythingExamples = [
  'What does the rubric expect?',
  'Explain primary research.',
  'What are the assignment deliverables?',
  'What is the deadline?',
]

export default function ChatInput({ onSubmit, disabled, error, mentorMode }) {
  const [text, setText] = useState('')
  const [assessmentQuestion, setAssessmentQuestion] = useState('')
  const [draftText, setDraftText] = useState('')
  const [answerSubmitted, setAnswerSubmitted] = useState(false)
  const [validationError, setValidationError] = useState(null)
  const reviewMode = mentorMode === 'review_draft'

  useEffect(() => {
    if (!reviewMode) {
      setValidationError(null)
    }
  }, [reviewMode])

  async function handleSubmit(event) {
    event.preventDefault()
    if (disabled) return

    if (reviewMode && !answerSubmitted) {
      if (!assessmentQuestion.trim()) {
        setValidationError('Paste the assessment question before requesting a review.')
        return
      }

      if (!draftText.trim()) {
        setValidationError('Paste your answer before requesting a review.')
        return
      }

      setValidationError(null)

      const success = await onSubmit({
        assessmentQuestion,
        draftText,
        initialReview: true,
      })
      if (success) {
        setText('')
        setAnswerSubmitted(true)
      }
      return
    }

    if (!text.trim()) {
      setValidationError('Enter a question for AI-Mentor.')
      return
    }

    setValidationError(null)

    const success = await onSubmit({
      messageText: text,
      assessmentQuestion: reviewMode ? assessmentQuestion : undefined,
      draftText: reviewMode ? draftText : undefined,
      initialReview: false,
    })
    if (success) {
      setText('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {reviewMode && !answerSubmitted && (
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--text)]" htmlFor="assessment-question-text">
              Assessment Question
            </label>
            <textarea
              id="assessment-question-text"
              value={assessmentQuestion}
              onChange={(event) => {
                setAssessmentQuestion(event.target.value)
                setValidationError(null)
              }}
              placeholder="Paste the question or task you are answering..."
              className="w-full min-h-24 border border-[var(--border)] rounded px-4 py-3 text-sm leading-6 resize-y"
              disabled={disabled}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[var(--text)]" htmlFor="draft-review-text">
              Your Answer
            </label>
            <textarea
              id="draft-review-text"
              value={draftText}
              onChange={(event) => {
                setDraftText(event.target.value)
                setValidationError(null)
              }}
              placeholder="Paste your current answer..."
              className="w-full min-h-32 border border-[var(--border)] rounded px-4 py-3 text-sm leading-6 resize-y"
              disabled={disabled}
            />
          </div>
        </div>
      )}
      {reviewMode && answerSubmitted && (
        <div className="flex items-center justify-between gap-3 rounded border border-[var(--border)] bg-white px-3 py-2 text-sm">
          <span className="font-medium text-[var(--text)]">Answer submitted for review</span>
          <button
            type="button"
            className="text-sm font-medium text-[var(--primary)] hover:underline"
            onClick={() => {
              setAnswerSubmitted(false)
              setValidationError(null)
            }}
            disabled={disabled}
          >
            Edit answer
          </button>
        </div>
      )}
      {!reviewMode && (
        <div className="flex flex-wrap gap-2 pb-1">
          {askAnythingExamples.map((example) => (
            <button
              key={example}
              type="button"
              className="rounded border border-[var(--border)] bg-white px-3 py-1 text-xs text-[var(--subdued)] hover:bg-[var(--hover)]"
              onClick={() => {
                setText(example)
                setValidationError(null)
              }}
              disabled={disabled}
            >
              {example}
            </button>
          ))}
        </div>
      )}
      {(!reviewMode || answerSubmitted) && (
        <div className="flex items-center gap-2">
          <input
            value={text}
            onChange={(event) => {
              setText(event.target.value)
              setValidationError(null)
            }}
            placeholder={inputPlaceholders[mentorMode] || inputPlaceholders.ask_anything}
            className="flex-1 border border-[var(--border)] rounded px-4 py-2 text-base"
            disabled={disabled}
          />
          <button type="submit" className="btn-primary soft-transition" disabled={disabled}>
            Send
          </button>
        </div>
      )}
      {reviewMode && !answerSubmitted && (
        <button type="submit" className="btn-primary soft-transition w-full" disabled={disabled}>
          Review My Answer
        </button>
      )}
      {(validationError || error) && <div className="text-xs text-red-600">{validationError || error}</div>}
    </form>
  )
}
