import React from 'react'
import { Play } from 'lucide-react'

export default function ResumeCard(){
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="card-title text-[var(--text)]">Welcome Aboard : Your Adaptive Learning Journey Starts Here!</h3>
          <p className="desc-text mt-2">Welcome to the course! Start here to get an overview and understand how to succeed in this journey.</p>
          <div className="mt-4 flex gap-3">
            <div className="flex items-center gap-2 px-3 py-2 border rounded text-sm text-[var(--muted)]">
              <span className="p-1 rounded bg-transparent text-[var(--primary)]"><Play size={14} /></span> <span className="text-sm text-[var(--text)]">Welcome Video</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 border rounded text-sm text-[var(--muted)]">
              <span className="text-sm text-[var(--text)]">Course Guide</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 border rounded text-sm text-[var(--muted)]">
              <span className="text-sm text-[var(--text)]">Getting Started Quiz</span>
            </div>
          </div>
        </div>

        <div>
          <button className="btn-primary soft-transition">Resume course</button>
        </div>
      </div>
    </div>
  )
}
