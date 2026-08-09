import React from 'react'
import { actions } from '../../data/dummyData'
import { ChevronRight, FileText, BookOpen, ClipboardCheck, FileCheck, MessageCircle } from 'lucide-react'

const iconMap = {
  'Explain Assignment': FileText,
  'Explain Rubric': ClipboardCheck,
  'Explain a Topic': BookOpen,
  'Review My Draft': FileCheck,
  'Ask Anything': MessageCircle
}

export default function QuickActions({ selectedMode, onSelectMode }){
  return (
    <div className="grid grid-cols-1 gap-3">
      {actions.map((a)=> {
        const Icon = iconMap[a.title] || FileText
        const mode = {
          'Explain Assignment': 'explain_assignment',
          'Explain Rubric': 'explain_rubric',
          'Explain a Topic': 'explain_topic',
          'Review My Draft': 'review_draft',
          'Ask Anything': 'ask_anything',
        }[a.title] || 'ask_anything'
        const active = selectedMode === mode
        return (
          <button
            key={a.id}
            type="button"
            onClick={() => onSelectMode(mode)}
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
                <div className="text-xs desc-text">Understand the {a.title.toLowerCase()}</div>
              </div>
            </div>
            <ChevronRight className="text-[var(--muted)]" />
          </button>
        )
      })}
    </div>
  )
}
