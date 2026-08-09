import React from 'react'
import { recent } from '../../data/dummyData'

export default function ConversationList({ messages }) {
  const items = messages ?? recent.map((item) => ({ ...item, role: 'assistant' }))

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-[var(--text)]">Recent conversations</div>
        <div className="text-xs text-[var(--primary)] soft-transition">View all</div>
      </div>
      <div className="mt-3 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="p-3 card">
            <div className="text-xs font-semibold text-[var(--primary)] mb-2">{item.role === 'user' ? 'You' : 'AI Mentor'}</div>
            <div className="text-sm text-[var(--text)]">{item.text}</div>
            {item.time && <div className="text-xs text-[var(--subdued)] mt-1">{item.time}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
