import React from 'react'

const tabs = ['Course', 'Progress', 'Dates', 'Evaluation']

export default function TabsRow({ activeTab = 'Course', onTabChange = () => {} }){
  return (
    <div className="bg-white border-b border-[var(--border)]">
      <div className="max-w-page mx-auto px-6" style={{height:52}}>
        <div className="h-full flex items-center">
          <div className="flex items-center gap-6 text-sm text-[var(--subdued)]">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange(tab)}
                className={`h-full pb-3 soft-transition ${
                  activeTab === tab ? 'text-[var(--text)] tab-underline' : 'hover:text-[var(--text)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
