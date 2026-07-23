import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { enrollmentsApi } from '../../api/enrollments'
import { coursesApi } from '../../api/courses'
import { useAuth } from '../../context/AuthContext'
import Card from '../shared/Card'
import { PlayIcon, StarIcon } from '@phosphor-icons/react'

const colors = ['#0091c3', '#87d300', '#ffcc00', '#e11b22']

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

export default function Classes() {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([
      enrollmentsApi.list().catch(() => []),
      coursesApi.list().catch(() => []),
    ])
      .then(([enrollData, courseData]) => {
        if (!active) return
        const mine = Array.isArray(enrollData)
          ? enrollData.filter((e) => e.user?.id === user?.id)
          : []
        const courseMap = new Map((Array.isArray(courseData) ? courseData : []).map((c) => [c.id, c]))
        const enriched = mine.map((e) => ({
          ...e,
          course: courseMap.get(e.course?.id) || e.course,
        }))
        setEnrollments(enriched)
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [user])

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-1">
        <h1 className="m-0 text-[48px] font-black leading-none">MY CLASSES</h1>
        <span className="text-[10px] font-bold tracking-[1px] text-sf-secondary-text">
          {enrollments.length} ENROLLED {enrollments.length === 1 ? 'COURSE' : 'COURSES'} — SELECT A CLASS TO START LEARNING
        </span>
      </header>

      {loading && <p className="m-0 text-sm text-sf-secondary-text">Loading classes…</p>}
      {error && <p className="m-0 text-sm font-bold text-[#e11b22]">{error}</p>}
      {!loading && !error && enrollments.length === 0 && (
        <p className="m-0 text-sm text-sf-secondary-text">
          You haven't enrolled in any courses yet. Explore the course catalog to enroll!
        </p>
      )}

      {!loading && !error && enrollments.length > 0 && (
        <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1 max-lg:grid-cols-2">
          {enrollments.map((enrollment, i) => {
            const course = enrollment.course || {}
            const detailUrl = `/classes/${course.id}`
            const color = colors[i % colors.length]
            const instructor = course.instructor?.name ?? 'Academic Faculty'
            const level = String(course.level ?? 'ALL LEVELS').toUpperCase()

            return (
              <Card key={enrollment.id} className="flex flex-col overflow-hidden transition hover:shadow-lg">
                <Link
                  to={detailUrl}
                  className="h-28 w-full block transition opacity-90 hover:opacity-100"
                  style={{ backgroundColor: color }}
                  aria-label={course.title}
                />
                <div className="flex flex-col gap-3 p-5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-sf-secondary-bg px-2 py-1 text-[10px] font-bold tracking-[1px]">
                      {level}
                    </span>
                    <span className="text-[10px] font-bold tracking-[1px] text-sf-secondary-text">
                      {course.duration ? `${course.duration} WEEKS` : 'SELF-PACED'}
                    </span>
                  </div>

                  <Link
                    to={detailUrl}
                    className="m-0 text-base font-black leading-tight text-sf-text hover:text-sf-primary transition"
                  >
                    {course.title ?? 'Untitled Course'}
                  </Link>

                  {course.description && (
                    <p className="m-0 text-sm text-sf-secondary-text line-clamp-2">
                      {course.description}
                    </p>
                  )}

                  <div className="mt-auto pt-3 flex flex-col gap-3 border-t border-sf-divider">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-sf-on-primary"
                          style={{ backgroundColor: color }}
                        >
                          {initials(instructor)}
                        </span>
                        <span className="text-[12px] font-bold">{instructor}</span>
                      </div>
                      {course.rating && (
                        <span className="flex items-center gap-1 text-[10px] font-bold tracking-[1px] text-sf-secondary-text">
                          <StarIcon size={12} weight="fill" className="text-[#ffcc00]" />
                          {course.rating}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-end pt-1">
                      <Link
                        to={detailUrl}
                        className="inline-flex items-center justify-center gap-1.5 rounded bg-sf-primary px-4 py-2 text-[10px] font-bold tracking-[1px] text-sf-on-primary transition hover:opacity-90 w-full"
                      >
                        <PlayIcon size={14} weight="fill" />
                        CONTINUE LEARNING
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
