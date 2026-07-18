import { useEffect, useMemo, useState } from 'react'

import { coursesApi } from '../../api/courses'
import { enrollmentsApi } from '../../api/enrollments'
import { useAuth } from '../../context/AuthContext'
import Header from '../sections/Header'
import Footer from '../sections/Footer'

import GradientBar from '../shared/GradientBar'
import CourseFilters from '../shared/CourseFilters'
import CourseCard from '../sections/dashboard/CourseCard'




export default function PublicCourses() {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [enrolledIds, setEnrolledIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('ALL LEVELS')
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
    let list = [...courses]
    if (level !== 'ALL LEVELS') {
      list = list.filter((c) => c.level?.toLowerCase() === level.toLowerCase())
    }
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
  }, [courses, search, level, sort])

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
      <GradientBar />
      <section className="mx-auto w-full max-w-6xl px-8 py-20 max-md:px-4 max-md:py-12">
        <div className="flex flex-col gap-10">
          <header className="flex flex-col gap-1">
            <h1 className="m-0 text-[48px] font-black leading-none max-md:text-[28px]">
              COURSE CATALOG
            </h1>
            <span className="text-[10px] font-bold tracking-[1px] text-sf-secondary-text">
              EXPLORE {courses.length} ACADEMIC PROGRAMS
            </span>
          </header>

          <CourseFilters level={level} setLevel={setLevel} search={search} setSearch={setSearch} sort={sort} setSort={setSort} />

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
