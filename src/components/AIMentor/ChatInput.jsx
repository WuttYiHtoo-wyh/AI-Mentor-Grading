import React, { useState } from 'react'

export default function ChatInput({ onSubmit, disabled, error, mentorMode }) {
  const [text, setText] = useState('')
  const [draftText, setDraftText] = useState('')
  const [validationError, setValidationError] = useState(null)
  const reviewMode = mentorMode === 'review_draft'

  async function handleSubmit(event) {
    event.preventDefault()
    if (disabled) return

    if (reviewMode && !draftText.trim()) {
      setValidationError('Paste your draft before requesting a review.')
      return
    }

    if (!text.trim()) {
      setValidationError('Enter a question for AI-Mentor.')
      return
    }

    setValidationError(null)

    const success = await onSubmit({
      messageText: text,
      draftText: reviewMode ? draftText : undefined,
    })
    if (success) {
      setText('')
      if (reviewMode) {
        setDraftText('')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {reviewMode && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--text)]" htmlFor="draft-review-text">
            Paste your latest assignment attempt
          </label>
          <textarea
            id="draft-review-text"
            value={draftText}
            onChange={(event) => {
              setDraftText(event.target.value)
              setValidationError(null)
            }}
            placeholder="Paste the draft you want AI-Mentor to review..."
            className="w-full min-h-32 border border-[var(--border)] rounded px-4 py-3 text-sm leading-6 resize-y"
            disabled={disabled}
          />
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          value={text}
          onChange={(event) => {
            setText(event.target.value)
            setValidationError(null)
          }}
          placeholder={reviewMode ? 'What would you like help with?' : 'Type your question here...'}
          className="flex-1 border border-[var(--border)] rounded px-4 py-2 text-base"
          disabled={disabled}
        />
        <button type="submit" className="btn-primary soft-transition" disabled={disabled}>
          Send
        </button>
      </div>
      {(validationError || error) && <div className="text-xs text-red-600">{validationError || error}</div>}
    </form>
  )
}
