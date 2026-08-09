import React from 'react'

export default function FloatingButton({onClick}){
  return (
    <div className="fixed left-6 bottom-6 z-40">
      <button onClick={onClick} className="floating-button soft-transition">
        <div className="w-8 h-8 bg-white text-[var(--primary)] rounded-full flex items-center justify-center">🤖</div>
        <div className="text-sm">Need help? <span className="font-semibold">Ask AI Mentor</span></div>
      </button>
    </div>
  )
}
