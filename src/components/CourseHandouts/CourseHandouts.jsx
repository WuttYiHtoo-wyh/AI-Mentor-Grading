import React from 'react'

export default function CourseHandouts({handouts=[]}){
  return (
    <div className="card p-4 mb-4">
      <div className="font-semibold mb-2 text-[var(--text)]">Course Handouts</div>
      <ul className="text-sm text-[var(--subdued)]">
        {handouts.map(h=> (
          <li key={h.id} className="flex items-center justify-between py-2 border-b last:border-b-0 border-[var(--border)]">
            <div>{h.title}</div>
            <div className="text-xs text-[var(--subdued)]">{h.type}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
