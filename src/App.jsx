import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import CourseHeader from './components/CourseHeader/CourseHeader'
import ResumeCard from './components/ResumeCard/ResumeCard'
import ModuleAccordion from './components/ModuleAccordion/ModuleAccordion'
import CourseTools from './components/CourseTools/CourseTools'
import ImportantDates from './components/ImportantDates/ImportantDates'
import CourseHandouts from './components/CourseHandouts/CourseHandouts'
import AIMentorDrawer from './components/AIMentor/Drawer'
import FloatingButton from './components/FloatingButton/FloatingButton'
import BlueToolbar from './components/BlueToolbar/BlueToolbar'
import TabsRow from './components/TabsRow/TabsRow'
import { fetchCurrentCourse } from './api'

export default function App() {
  const [open, setOpen] = useState(true)
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadCourse() {
      try {
        const currentCourse = await fetchCurrentCourse()
        setCourse(currentCourse)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadCourse()
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar />
      <BlueToolbar />
      <TabsRow />

      <div className="w-full max-w-page mx-auto px-6 py-8" style={{ maxWidth: 1500 }}>
        {loading ? (
          <div className="card p-6 text-center">Loading course information…</div>
        ) : error ? (
          <div className="card p-6 text-center text-red-600">{error}</div>
        ) : (
          <>
            <CourseHeader title={course.title} />
            <div className="mt-6 grid grid-cols-12 gap-6">
              <main className="col-span-8">
                <div className="flex items-center justify-between">
                  <div className="w-3/4"> </div>
                  <div className="flex items-center gap-3">
                    <button className="text-sm px-3 py-1 rounded border">Expand all</button>
                  </div>
                </div>

                <div className="mt-4">
                  <ResumeCard />
                </div>

                <div className="mt-6">
                  <ModuleAccordion />
                </div>
              </main>

              <aside className="col-span-4">
                <CourseTools />
                <ImportantDates date={course.term} />
                <CourseHandouts handouts={course.handouts ?? []} />
              </aside>
            </div>
          </>
        )}
      </div>

      <AIMentorDrawer open={open} onToggle={() => setOpen((v) => !v)} />
      <FloatingButton onClick={() => setOpen(true)} />
    </div>
  )
}
