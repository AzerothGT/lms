import { useEffect, useState } from 'react'
import { coursesApi } from '../../api/courses'
import Card from '../shared/Card'

const colors = ['#0091c3', '#87d300', '#ffcc00', '#e11b22']

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    coursesApi
      .list()
      .then((data) => {
        if (active) setCourses(Array.isArray(data) ? data : [])
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="mx-auto w-full max-w-6xl px-8 py-20 max-md:px-4 max-md:py-12">
      <header className="mb-10 flex flex-col gap-1">
        <h2 className="m-0 text-[40px] font-black leading-none max-md:text-[28px]">
          POPULAR COURSES
        </h2>
        <span className="text-[10px] font-bold tracking-[1px] text-sf-secondary-text">
          HAND-PICKED BY OUR EDUCATORS
        </span>
      </header>

      {loading && (
        <p className="m-0 text-sm text-sf-secondary-text">Loading courses…</p>
      )}

      {error && (
        <p className="m-0 text-sm font-bold text-[#e11b22]">{error}</p>
      )}

      {!loading && !error && courses.length === 0 && (
        <p className="m-0 text-sm text-sf-secondary-text">
          No courses available yet.
        </p>
      )}

      {!loading && !error && courses.length > 0 && (
        <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1 max-lg:grid-cols-2">
          {courses.map((course, i) => (
            <Card key={course.id} className="flex flex-col gap-4 p-6">
              <span
                aria-hidden="true"
                className="h-2 w-12 rounded-full"
                style={{
                  backgroundColor: colors[i % colors.length],
                }}
              />
              <h3 className="m-0 text-lg font-black leading-tight">
                {course.title}
              </h3>
              <div className="flex items-center justify-between text-[10px] font-bold tracking-[1px] text-sf-secondary-text">
                <span className="rounded bg-sf-secondary-bg px-2 py-1">
                  {String(course.level ?? '').toUpperCase()}
                </span>
                <span>{course.enrolled_count ?? 0} ENROLLED</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
