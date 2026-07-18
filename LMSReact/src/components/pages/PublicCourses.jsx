import { useEffect, useMemo, useState } from 'react'
import { MagnifyingGlass, Funnel } from '@phosphor-icons/react'
import { coursesApi } from '../../api/courses'
import { enrollmentsApi } from '../../api/enrollments'
import { useAuth } from '../../context/AuthContext'
import Header from '../sections/Header'
import Footer from '../sections/Footer'
import Button from '../shared/Button'
import CourseCard from '../sections/dashboard/CourseCard'

const chips = [
  'ALL DISCIPLINES',
  'ARCHITECTURE',
  'GRAPHIC DESIGN',
  'INDUSTRIAL DESIGN',
  'KINETICS',
]

const sorts = ['NEWEST', 'RATING']

function matchesChip(course, chip) {
  if (chip === 'ALL DISCIPLINES') return true
  const haystack = `${course.title} ${course.category?.name ?? ''}`.toLowerCase()
  return haystack.includes(chip.toLowerCase())
}

export default function PublicCourses() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [enrolledIds, setEnrolledIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [chip, setChip] = useState('ALL DISCIPLINES')
  const [sort, setSort] = useState('NEWEST')

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

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = courses.filter((c) => matchesChip(c, chip))
    if (q) {
      list = list.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q),
      )
    }
    if (sort === 'RATING') {
      list = [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    }
    return list
  }, [courses, search, chip, sort])

  async function handleEnroll(courseId) {
    try {
      await enrollmentsApi.create(courseId, user.id)
      setEnrolledIds((prev) => new Set([...prev, courseId]))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-sf-bg font-sans text-sf-text">
      <Header />
      <section className="mx-auto w-full max-w-6xl px-8 py-20 max-md:px-4 max-md:py-12">
        <div className="flex flex-col gap-10">
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="m-0 text-[48px] font-black leading-none max-md:text-[28px]">
                COURSE CATALOG
              </h1>
              <span className="text-[10px] font-bold tracking-[1px] text-sf-secondary-text">
                EXPLORE {courses.length} ACADEMIC PROGRAMS
              </span>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex w-80 items-center gap-2 rounded border border-sf-divider px-3 max-md:w-full">
                <MagnifyingGlass size={18} className="text-sf-secondary-text" />
                <input
                  className="w-full bg-transparent py-3 font-sans text-sf-text outline-none placeholder:text-[#888]"
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
              <Button variant="outline" size="medium">
                <Funnel size={18} weight="bold" />
                FILTERS
              </Button>
            </div>
          </header>

          <div className="flex flex-wrap items-center gap-3">
            {chips.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setChip(c)}
                className={[
                  'rounded-full border px-4 py-2 text-[10px] font-bold tracking-[1px] transition',
                  chip === c
                    ? 'border-sf-primary bg-sf-primary text-sf-on-primary'
                    : 'border-sf-divider text-sf-secondary-text hover:text-sf-text',
                ].join(' ')}
              >
                {c}
              </button>
            ))}
            <select
              className="ml-auto rounded border border-sf-divider bg-transparent px-3 py-2 text-[10px] font-bold tracking-[1px] text-sf-text outline-none"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {sorts.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {loading && <p className="m-0 text-sm text-sf-secondary-text">Loading courses…</p>}
          {error && <p className="m-0 text-sm font-bold text-[#e11b22]">{error}</p>}
          {!loading && !error && visible.length === 0 && (
            <p className="m-0 text-sm text-sf-secondary-text">No courses match your filters.</p>
          )}

          {!loading && !error && visible.length > 0 && (
            <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1 max-lg:grid-cols-2">
              {visible.map((course, i) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  index={i}
                  enrolled={enrolledIds.has(course.id)}
                  onEnroll={user?.role === 'student' ? () => handleEnroll(course.id) : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  )
}
