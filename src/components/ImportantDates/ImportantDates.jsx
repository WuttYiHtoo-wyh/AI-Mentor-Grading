import React from 'react'

export default function ImportantDates({date}){
  return (
    <div className="card p-4 mb-4">
      <div className="font-semibold mb-2 text-[var(--text)]">Important dates</div>
      <div className="text-sm text-[var(--subdued)]">
        <div className="font-medium text-[var(--text)]">{date}</div>
        <div className="text-sm mt-2">Course ends. This course is archived, which means you can review course content but it is no longer active.</div>
      </div>
    </div>
  )
}
