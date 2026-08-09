import React from 'react'
import { Bookmark, Compass } from 'lucide-react'

export default function CourseTools(){
  return (
    <div className="card p-4 mb-4">
      <div className="card-title mb-2 text-[var(--text)]">Course Tools</div>
      <ul className="space-y-3 text-sm text-[var(--muted)]">
        <li className="flex items-center gap-3">
          <span className="p-1 rounded text-[var(--primary)]"><Bookmark size={16} /></span>
          <span className="text-[var(--text)]">Bookmarks</span>
        </li>
        <li className="flex items-center gap-3">
          <span className="p-1 rounded text-[var(--primary)]"><Compass size={16} /></span>
          <span className="text-[var(--text)]">Launch tour</span>
        </li>
        <li className="flex items-center gap-3">
          <span className="p-1 rounded text-[var(--primary)]"><Bookmark size={16} /></span>
          <span className="text-[var(--text)]">AI Mentor <span className="ml-2 text-xs text-[var(--primary)] px-2 rounded">NEW</span></span>
        </li>
      </ul>
    </div>
  )
}
