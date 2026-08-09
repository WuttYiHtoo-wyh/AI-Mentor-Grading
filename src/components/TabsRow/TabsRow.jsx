import React from 'react'

export default function TabsRow(){
  return (
    <div className="bg-white border-b border-[var(--border)]">
      <div className="max-w-page mx-auto px-6" style={{height:52}}>
        <div className="h-full flex items-center">
          <div className="flex items-center gap-6 text-sm text-[var(--subdued)]">
            <div className="pb-3 text-[var(--text)] tab-underline">Course</div>
            <div>Progress</div>
            <div>Dates</div>
          </div>
        </div>
      </div>
    </div>
  )
}
