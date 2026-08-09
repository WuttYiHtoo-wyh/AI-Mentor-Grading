import React from 'react'

export default function CourseHeader({title}){
  return (
    <div className="card p-6">
      <h1 className="course-title text-[var(--text)]">{title}</h1>
      <div className="mt-3 desc-text">Pick up where you left off — Continue learning from where you stopped last time.</div>
    </div>
  )
}
