import React from 'react'

function Module({title, children}){
  const [open, setOpen] = React.useState(false)
  return (
    <div className="border border-[var(--border)] rounded mb-3 overflow-hidden card">
      <button onClick={()=>setOpen(o=>!o)} className="w-full text-left px-4 py-3 bg-white flex items-center justify-between soft-transition">
        <div className="flex items-center gap-3 text-[var(--text)]">
          <div className="w-3 h-3 rounded-full border flex-none" />
          <div className="font-medium">{title}</div>
        </div>
        <div className="text-[var(--subdued)]">{open?'-':'+'}</div>
      </button>
      {open && (
        <div className="p-4 bg-[var(--hover)]">
          {children}
        </div>
      )}
    </div>
  )
}

export default function ModuleAccordion(){
  return (
    <div>
      <Module title="Welcome Aboard - Your Adaptive Learning Journey Starts Here!">
        <p className="text-sm">Intro content and resources.</p>
      </Module>

      <Module title="Share Your Thoughts on Orientation!">
        <p className="text-sm">Discussion prompt</p>
      </Module>

      <Module title="Module Information">
        <p className="text-sm">Syllabus and module info</p>
      </Module>
    </div>
  )
}
