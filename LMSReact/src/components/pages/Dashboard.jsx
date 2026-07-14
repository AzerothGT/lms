import { useEffect, useState } from 'react'
import { coursesApi } from '../../api/courses'
import CourseCard from '../sections/dashboard/CourseCard'

const stats = [
  { label: 'ENROLLED COURSES', value: '6' },
  { label: 'COMPLETED LESSONS', value: '42' },
  { label: 'HOURS LEARNED', value: '128' },
  { label: 'DAY STREAK', value: '9' },
]

const palette = ['#0091c3', '#87d300', '#ffcc00', '#e11b22']

export default function Dashboard() {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    let active = true
    coursesApi
      .list()
      .then((data) => active && setCourses(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-1">
        <h1 className="m-0 text-[48px] font-black leading-none">WELCOME BACK</h1>
        <span className="text-[10px] font-bold tracking-[1px] text-sf-secondary-text">
          HERE IS WHAT IS HAPPENING WITH YOUR LEARNING
        </span>
      </header>

      <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-2 rounded border border-sf-divider bg-sf-secondary-bg p-5"
          >
            <span className="text-[32px] font-black leading-none text-sf-primary">
              {stat.value}
            </span>
            <span className="text-[10px] font-bold tracking-[1px] text-sf-secondary-text">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      <section className="flex flex-col gap-5">
        <h2 className="m-0 text-[24px] font-black">CONTINUE LEARNING</h2>
        {courses.length === 0 ? (
          <p className="m-0 text-sm text-sf-secondary-text">
            No courses in progress yet.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {courses.map((course, i) => (
              <div
                key={course.id}
                className="flex items-center gap-4 rounded border border-sf-divider bg-sf-bg p-4"
              >
                <span
                  className="h-12 w-12 flex-none rounded"
                  style={{ backgroundColor: palette[i % palette.length] }}
                  aria-hidden="true"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="truncate text-sm font-bold">{course.title}</span>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-sf-secondary-bg">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${[70, 45, 20][i % 3]}%`,
                        backgroundColor: palette[i % palette.length],
                      }}
                    />
                  </div>
                </div>
                <span className="text-[10px] font-bold tracking-[1px] text-sf-secondary-text">
                  {[70, 45, 20][i % 3]}%
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-5">
        <h2 className="m-0 text-[24px] font-black">RECOMMENDED FOR YOU</h2>
        <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1 max-lg:grid-cols-2">
          {courses.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </div>
      </section>
    </div>
  )
}
