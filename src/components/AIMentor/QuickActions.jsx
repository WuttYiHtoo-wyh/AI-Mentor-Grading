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

const actionConfig = {
  'Explain Assignment': {
    mode: 'explain_assignment',
    description: 'Understand assignment tasks and requirements',
  },
  'Explain Rubric': {
    mode: 'explain_rubric',
    description: 'Understand assessment criteria and expectations',
  },
  'Explain a Topic': {
    mode: 'explain_topic',
    description: 'Get help understanding a course topic',
  },
  'Ask Anything': {
    mode: 'ask_anything',
    description: 'Ask a general course-related question',
  },
  'Review My Draft': {
    mode: 'review_draft',
    description: 'Get guidance on your latest assignment attempt',
  },
}

export default function QuickActions({ selectedMode, onSelectMode }){
  return (
    <div className="grid grid-cols-1 gap-3">
      {actions.map((a)=> {
        const Icon = iconMap[a.title] || FileText
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
