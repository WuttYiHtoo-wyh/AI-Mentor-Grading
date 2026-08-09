import React, { useState } from 'react'
import QuickActions from './QuickActions'
import ConversationList from './ConversationList'
import ChatInput from './ChatInput'
import { sendChatMessage } from '../../api'

const initialMessages = [
  { id: 'm1', role: 'assistant', text: 'Hi there! Ask me anything about your course or assignment.' }
]

export default function Drawer({ open = true, onToggle }) {
  const [messages, setMessages] = useState(initialMessages)
  const [conversationId, setConversationId] = useState(null)
  const [mentorMode, setMentorMode] = useState('ask_anything')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
        <div className="p-5 flex items-start justify-between border-b border-[var(--border)] ai-header">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--hover)] rounded flex items-center justify-center text-[var(--primary)]">🤖</div>
              <div>
                <div className="title">AI Mentor</div>
                <div className="subtitle">Your learning companion for this course</div>
              </div>
            </div>

            <div className="ai-greeting">Hi WuttYi 👋</div>
            <div className="ai-prompt">How can I help you today?</div>
          </div>

          <div className="ml-3">
            <button onClick={onToggle} className="p-2 rounded soft-transition hover:bg-[var(--hover)]">✕</button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          <div className="quick-actions">
            <QuickActions selectedMode={mentorMode} onSelectMode={setMentorMode} />
          </div>
          <div className=" mt-4 text-sm text-[var(--text)]">
            Current mode: <span className="font-semibold">{mentorMode.replace('_', ' ')}</span>
          </div>
          <div className="mt-6">
            <ConversationList messages={messages} />
          </div>
        </div>

        <div className="p-5 border-t border-[var(--border)] chat-input">
          <ChatInput onSubmit={handleSend} disabled={loading} error={error} />
          <div className="text-xs text-[var(--subdued)] mt-3">AI Mentor uses course materials only. Answers may not be 100% accurate.</div>
        </div>
      </div>
    </div>
  )
}
