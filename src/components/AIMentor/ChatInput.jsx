import React, { useState } from 'react'
import { Paperclip, UploadCloud, Send } from 'lucide-react'

export default function ChatInput({ onSubmit, disabled, error }) {
  const [text, setText] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    if (!text.trim() || disabled) return

    const success = await onSubmit(text)
    if (success) {
      setText('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Type your question here..."
          className="flex-1 border border-[var(--border)] rounded px-3 py-2 text-base"
          disabled={disabled}
        />
        <button
          type="button"
          className="p-2 rounded soft-transition hover:bg-[var(--hover)] text-[var(--muted)] border border-transparent"
          disabled={disabled}
        >
          <Paperclip size={16} />
        </button>
        <button
          type="button"
          className="p-2 rounded soft-transition hover:bg-[var(--hover)] text-[var(--muted)] border border-transparent"
          disabled={disabled}
        >
          <UploadCloud size={16} />
        </button>
        <button type="submit" className="btn-primary soft-transition" disabled={disabled}>
          <Send size={16} />
        </button>
      </div>
      {error && <div className="text-xs text-red-600">{error}</div>}
    </form>
  )
}
