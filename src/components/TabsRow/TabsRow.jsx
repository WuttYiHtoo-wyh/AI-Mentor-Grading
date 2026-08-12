import React from 'react'

const tabs = ['Course', 'Progress', 'Dates', 'Evaluation']

export default function TabsRow({ activeTab = 'Course', onTabChange = () => {} }){
  return (
    <div className="bg-white border-b border-[var(--border)]">
      <div className="max-w-page mx-auto px-6" style={{height:52}}>
        <div className="h-full flex items-center">
          <div className="flex items-center gap-6 text-sm text-[var(--subdued)]">
            {tabs.map((tab) => {
              const isEvaluation = tab === 'Evaluation'
              const isActive = activeTab === tab
              const baseClass = 'h-full pb-3 soft-transition'
              const standardClass = isActive ? 'text-[var(--text)] tab-underline' : 'hover:text-[var(--text)]'
              const evaluationClass = isActive
                ? 'text-red-800 border-b-4 border-red-700'
                : 'text-red-800 hover:text-red-900'

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => onTabChange(tab)}
                  className={`${baseClass} ${isEvaluation ? evaluationClass : standardClass}`}
                >
                  <span className={isEvaluation ? 'inline-flex items-center gap-2 rounded bg-red-50 px-2 py-1' : ''}>
                    {tab}
                    {isEvaluation && (
                      <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-800">
                        NEW
                      </span>
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
