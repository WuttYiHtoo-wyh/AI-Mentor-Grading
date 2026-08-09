import React from 'react'

export default function BlueToolbar(){
  return (
    <div className="toolbar-blue w-full" style={{height:76}}>
      <div className="max-w-page mx-auto px-6 h-full flex items-center justify-between text-white">
        <div className="flex items-center gap-4">
          <div className="text-sm">View this course as:</div>
          <div className="bg-white text-[var(--primary)] rounded px-3 py-2 text-sm border border-[#D5DCE5]">Basic ▾</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm">View course in:</div>
          <button className="bg-white text-[var(--primary)] rounded px-3 py-2 text-sm border border-[#D5DCE5]">Studio</button>
        </div>
      </div>
    </div>
  )
}
