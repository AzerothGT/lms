import { useEffect, useMemo, useState } from 'react'
import { coursesApi } from '../../api/courses'
import { enrollmentsApi } from '../../api/enrollments'
import { useAuth } from '../../context/AuthContext'
import Button from '../shared/Button'
import Modal from '../shared/Modal'
import TextField from '../shared/TextField'
import CourseFilters from '../shared/CourseFilters'
import CourseCard from '../sections/dashboard/CourseCard'

export default function CourseCatalog() {
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

  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', level: 'BEGINNER', duration: '' })
  const [creating, setCreating] = useState(false)

  async function handleCreate(e) {
    e.preventDefault()
    setCreating(true)
    try {
      const created = await coursesApi.create(form)
      setCourses((prev) => [...prev, created])
      setForm({ title: '', description: '', level: 'BEGINNER', duration: '' })
      setShowAdd(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setCreating(false)
    }
  }

  const PAYMENT_URL = 'https://app.sandbox.midtrans.com/payment-links/16c4ee41-66cf-4063-ab36-edf5c2607b5e-ZF8cspKb'

  async function handleEnroll(courseId) {
    try {
      window.open(PAYMENT_URL, '_blank')
      await enrollmentsApi.create(courseId, user.id)
      setEnrolledIds((prev) => new Set([...prev, courseId]))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="m-0 text-[48px] font-black leading-none">COURSE CATALOG</h1>
          <span className="text-[10px] font-bold tracking-[1px] text-sf-secondary-text">
            EXPLORE {courses.length || 124} ACADEMIC PROGRAMS
          </span>
        </div>
        {(user?.role === 'instructor' || user?.role === 'admin') && (
          <Button variant="primary" size="medium" type="button" onClick={() => setShowAdd(true)}>
            ADD COURSE
          </Button>
        )}
      </header>

      <CourseFilters level={level} setLevel={setLevel} search={search} setSearch={setSearch} sort={sort} setSort={setSort} />

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="ADD COURSE">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <TextField
            label="TITLE"
            placeholder="Course title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
          <TextField
            label="DESCRIPTION"
            as="textarea"
            hint="Course description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            required
          />
          <div className="flex gap-4">
            <TextField
              label="LEVEL"
              as="select"
              className="flex-1"
              value={form.level}
              onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
            >
              {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </TextField>
            <TextField
              label="DURATION (WEEKS)"
              type="number"
              placeholder="e.g. 8"
              value={form.duration}
              onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" size="medium" type="button" onClick={() => setShowAdd(false)}>
              CANCEL
            </Button>
            <Button variant="primary" size="medium" type="submit" disabled={creating}>
              {creating ? 'CREATING…' : 'CREATE COURSE'}
            </Button>
          </div>
        </form>
      </Modal>

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
  )
}
