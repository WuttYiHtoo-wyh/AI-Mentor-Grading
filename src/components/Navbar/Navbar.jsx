import React from 'react'
import {User,SunMoon} from 'lucide-react'

export default function Navbar(){
  return (
    <header className="bg-white border-b" style={{height:72}}>
      <div className="max-w-page mx-auto px-6 h-full flex items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[var(--primary)] rounded flex items-center justify-center text-white font-semibold">L</div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-[var(--text)]">HDSE-CPL-Capstone Project - Application Development</div>
            <div className="text-xs text-[var(--muted)]">CLaaS2SaaS FED</div>
          </div>
        </div>

        <nav className="ml-8 flex items-center gap-6 text-sm text-[var(--subdued)]">
          <a className="hover:text-[var(--text)] soft-transition">My Courses</a>
          <a className="hover:text-[var(--text)] soft-transition">Discover</a>
        </nav>

        <div className="ml-auto flex items-center gap-4 text-[var(--subdued)]">
          <button className="p-2 rounded soft-transition hover:bg-[var(--hover)]"><SunMoon size={18} /></button>
          <button className="p-2 rounded soft-transition hover:bg-[var(--hover)]">Help</button>
          <button className="p-2 rounded soft-transition hover:bg-[var(--hover)]"><User size={20} /></button>
          <div className="text-sm text-[var(--text)]">WuttYi ▾</div>
        </div>
      </div>
    </header>
  )
}
