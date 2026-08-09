import React, { useEffect, useRef, useState } from 'react'
import ConversationList from './ConversationList'
import ChatInput from './ChatInput'
import { sendChatMessage } from '../../api'

const initialMessages = [
  { id: 'm1', role: 'assistant', text: 'Hi there. Ask me anything about your course or assignment.' },
]

export default function Drawer({ open = true, onToggle }) {
  const [messages, setMessages] = useState(initialMessages)
  const [conversationId, setConversationId] = useState(null)
  const [mentorMode] = useState('ask_anything')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const conversationRef = useRef(null)

  useEffect(() => {
    const container = conversationRef.current
    if (!container) return

    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight
    if (distanceFromBottom < 220) {
      container.scrollTop = container.scrollHeight
    }
  }, [messages, loading])

  if (!open) return null

  async function handleSend(messageText) {
    if (!messageText.trim()) return false

    const userMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: messageText,
    }

    setMessages((current) => [...current, userMessage])
    setLoading(true)
    setError(null)

    try {
      const response = await sendChatMessage({
        message: messageText,
        courseId: 'CPL',
        mentorMode,
        conversationId,
      })

      const assistantMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: response.answer,
        sources: response.sources ?? [],
      }

      setConversationId(response.conversation_id)
      setMessages((current) => [...current, assistantMessage])
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ai-drawer fixed right-0 z-50">
      <div className="h-full bg-white border-l border-[var(--border)] flex flex-col" style={{ boxShadow: '-8px 0 24px rgba(16,24,40,0.06)' }}>
        <div className="px-6 py-5 flex items-start justify-between border-b border-[var(--border)] ai-header">
          <div>
            <div className="title">AI-Mentor, Htoo Wutt Yi</div>
            <div className="subtitle mt-1">Your learning companion for this course</div>
          </div>

          <div className="ml-3">
            <button onClick={onToggle} className="p-2 rounded soft-transition hover:bg-[var(--hover)] text-sm text-[var(--subdued)]" aria-label="Close AI-Mentor">
              Close
            </button>
          </div>
        </div>

        <div ref={conversationRef} className="ai-conversation flex-1 overflow-y-auto px-6 py-5">
          <ConversationList messages={messages} loading={loading} />
        </div>

        <div className="px-6 py-5 border-t border-[var(--border)] chat-input">
          <ChatInput onSubmit={handleSend} disabled={loading} error={error} />
          <div className="text-xs text-[var(--subdued)] mt-3 leading-5">
            AI-Mentor uses course materials only. Answers may not be 100% accurate.
            <br />
            Please confirm important information with your mentor when needed.
          </div>
        </div>
      </div>
    </div>
  )
}
