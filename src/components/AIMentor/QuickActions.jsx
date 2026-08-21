import React from 'react'
import { ChevronRight, FileCheck, MessageCircle } from 'lucide-react'

const iconMap = {
  'Ask Anything': MessageCircle,
  'Review My Answer': FileCheck,
}

const actionConfig = {
  'Ask Anything': {
    mode: 'ask_anything',
    description: 'Ask a general course-related question',
  },
  'Review My Answer': {
    mode: 'review_draft',
    description: 'Get guidance on your current answer',
  },
}

const learnerActions = [
  { id: 'ask_anything', title: 'Ask Anything' },
  { id: 'review_draft', title: 'Review My Answer' },
]

export default function QuickActions({ selectedMode, onSelectMode }){
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {learnerActions.map((a)=> {
        const Icon = iconMap[a.title] || MessageCircle
        const config = actionConfig[a.title] || actionConfig['Ask Anything']
        const mode = config.mode
        const active = selectedMode === mode
        return (
          <button
            key={a.id}
            type="button"
            onClick={() => onSelectMode(mode)}
            aria-pressed={active}
            className={
              `flex items-center justify-between p-3 card soft-transition hover:bg-[var(--hover)] ${active ? 'bg-[var(--hover)] border border-[var(--border)]' : ''}`
            }
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded flex items-center justify-center text-[var(--primary)] soft-transition">
                <Icon size={18} />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-[var(--text)]">{a.title}</div>
                <div className="text-xs desc-text">{config.description}</div>
              </div>
            </div>
            <ChevronRight className="text-[var(--muted)]" />
          </button>
        )
      })}
    </div>
  )
}
