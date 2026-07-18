import { useEffect, useState } from 'react'
import { coursesApi } from '../../api/courses'
import { enrollmentsApi } from '../../api/enrollments'
import { useAuth } from '../../context/AuthContext'
import Button from '../shared/Button'
import Card from '../shared/Card'

const colors = ['#0091c3', '#87d300', '#ffcc00', '#e11b22']
const levels = ['ALL LEVELS', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED']

export default function Courses() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [enrolledIds, setEnrolledIds] = useState(new Set())
  const [level, setLevel] = useState('ALL LEVELS')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([
      coursesApi.list(),
      user ? enrollmentsApi.list().catch(() => []) : Promise.resolve([]),
    ])
      .then(([courseData, enrollData]) => {
        if (!active) return
        setCourses(Array.isArray(courseData) ? courseData : [])
        if (user && Array.isArray(enrollData)) {
          setEnrolledIds(new Set(
            enrollData
              .filter((e) => e.user?.id === user.id)
              .map((e) => e.course?.id),
          ))
        }
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [user])

  async function handleEnroll(courseId) {
    try {
      await enrollmentsApi.create(courseId, user.id)
      setEnrolledIds((prev) => new Set([...prev, courseId]))
    } catch (err) {
      setError(err.message)
    }
  }

  const filtered = level === 'ALL LEVELS'
    ? courses
    : courses.filter((c) => c.level?.toLowerCase() === level.toLowerCase())

  return (
    <section className="mx-auto w-full max-w-6xl px-8 py-20 max-md:px-4 max-md:py-12">
      <header className="mb-10 flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="m-0 text-[40px] font-black leading-none max-md:text-[28px]">
            POPULAR COURSES
          </h2>
          <span className="text-[10px] font-bold tracking-[1px] text-sf-secondary-text">
            HAND-PICKED BY OUR EDUCATORS
          </span>
        </div>
        {user?.role === 'instructor' && (
          <Button variant="primary" size="medium">
            ADD COURSE
          </Button>
        )}
      </header>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        {levels.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLevel(l)}
            className={[
              'rounded-full border px-4 py-2 text-[10px] font-bold tracking-[1px] transition',
              level === l
                ? 'border-sf-primary bg-sf-primary text-sf-on-primary'
                : 'border-sf-divider text-sf-secondary-text hover:text-sf-text',
            ].join(' ')}
          >
            {l}
          </button>
        ))}
      </div>

      {loading && (
        <p className="m-0 text-sm text-sf-secondary-text">Loading courses…</p>
      )}

      {error && (
        <p className="m-0 text-sm font-bold text-[#e11b22]">{error}</p>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="m-0 text-sm text-sf-secondary-text">
          No courses available yet.
        </p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1 max-lg:grid-cols-2">
          {filtered.map((course, i) => (
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
              {user?.role === 'student' && (
                enrolledIds.has(course.id) ? (
                  <span className="text-[10px] font-bold tracking-[1px] text-sf-primary">
                    ENROLLED
                  </span>
                ) : (
                  <Button
                    variant="primary"
                    size="small"
                    type="button"
                    onClick={() => handleEnroll(course.id)}
                  >
                    ENROLL
                  </Button>
                )
              )}
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
