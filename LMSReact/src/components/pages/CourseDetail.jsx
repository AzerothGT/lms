import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { coursesApi } from '../../api/courses'
import { enrollmentsApi } from '../../api/enrollments'
import { useAuth } from '../../context/AuthContext'
import Button from '../shared/Button'
import Card from '../shared/Card'
import { PlayIcon, CheckCircleIcon, ArrowLeftIcon, BookOpenIcon, ClockIcon } from '@phosphor-icons/react'

const sampleModules = [
  {
    id: 1,
    title: 'Module 1: Introduction & Environment Setup',
    lessons: [
      { id: 101, title: 'Welcome to the Course', duration: '08:15', type: 'video', content: 'In this introductory lesson, we outline the goals, syllabus, and tools required for this program.' },
      { id: 102, title: 'Setting Up Your Workspace', duration: '15:30', type: 'reading', content: 'Follow these step-by-step instructions to configure your development environment, Node runtime, and IDE.' },
    ],
  },
  {
    id: 2,
    title: 'Module 2: Core Concepts & Architecture',
    lessons: [
      { id: 201, title: 'Understanding Core Principles', duration: '22:10', type: 'video', content: 'Deep dive into fundamental concepts, architecture design patterns, and state management flow.' },
      { id: 202, title: 'Hands-on Coding Lab', duration: '35:00', type: 'reading', content: 'Complete the guided exercise by implementing components and connecting them to REST APIs.' },
    ],
  },
]

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [enrolled, setEnrolled] = useState(false)
  const [activeLesson, setActiveLesson] = useState(sampleModules[0].lessons[0])
  const [completedLessons, setCompletedLessons] = useState(new Set([101]))

  useEffect(() => {
    let active = true
    Promise.all([
      coursesApi.getById(id).catch(() => null),
      coursesApi.list(),
      user ? enrollmentsApi.list().catch(() => []) : Promise.resolve([]),
    ])
      .then(([single, list, enrollments]) => {
        if (!active) return
        const found = single || (Array.isArray(list) ? list.find((c) => String(c.id) === String(id)) : null)
        setCourse(found)

        if (user && Array.isArray(enrollments)) {
          const isEnrolled = enrollments.some(
            (e) => String(e.course_id) === String(id) || String(e.course?.id) === String(id),
          )
          setEnrolled(isEnrolled)
        }
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [id, user])

  function toggleComplete(lessonId) {
    setCompletedLessons((prev) => {
      const next = new Set(prev)
      if (next.has(lessonId)) next.delete(lessonId)
      else next.add(lessonId)
      return next
    })
  }

  async function handleEnroll() {
    if (!user) return navigate('/auth')
    try {
      await enrollmentsApi.create(Number(id), user.id)
      setEnrolled(true)
      window.open('https://app.sandbox.midtrans.com/payment-links/2c59615f-def9-4096-9398-d7d79bfe4ccc-7PrveYpy', '_blank')
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-sm font-bold text-sf-secondary-text">Loading course details…</div>
  }

  if (error || !course) {
    return (
      <div className="flex flex-col items-center gap-4 p-12 text-center">
        <h2 className="text-2xl font-black text-[#e11b22]">Course Not Found</h2>
        <p className="text-sm text-sf-secondary-text">{error || 'The requested course does not exist.'}</p>
        <Button variant="primary" size="medium" onClick={() => navigate('/classes')}>
          RETURN TO MY CLASSES
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-bold tracking-[1px] text-sf-secondary-text hover:text-sf-primary"
      >
        <ArrowLeftIcon size={16} /> BACK
      </button>

      {/* Course Banner */}
      <header className="flex flex-col gap-4 rounded-xl border border-sf-divider bg-sf-secondary-bg p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="rounded bg-sf-primary px-3 py-1 text-[10px] font-black uppercase tracking-[1px] text-white">
            {course.level || 'ALL LEVELS'}
          </span>
          <div className="flex items-center gap-4 text-xs font-bold text-sf-secondary-text">
            <span className="flex items-center gap-1">
              <ClockIcon size={16} /> {course.duration ? `${course.duration} WEEKS` : 'SELF-PACED'}
            </span>
            <span className="flex items-center gap-1">
              <BookOpenIcon size={16} /> 4 LESSONS
            </span>
          </div>
        </div>

        <h1 className="m-0 text-3xl font-black">{course.title}</h1>
        <p className="m-0 text-sm leading-relaxed text-sf-secondary-text">{course.description}</p>

        <div className="flex items-center justify-between border-t border-sf-divider pt-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sf-primary font-bold text-white">
              {course.instructor?.name?.[0] || 'I'}
            </div>
            <div>
              <div className="text-xs font-bold">{course.instructor?.name || 'Academic Faculty'}</div>
              <div className="text-[10px] text-sf-secondary-text">Course Instructor</div>
            </div>
          </div>

          {!enrolled ? (
            <Button variant="primary" size="medium" onClick={handleEnroll}>
              ENROLL NOW
            </Button>
          ) : (
            <span className="flex items-center gap-1 text-xs font-bold text-sf-primary">
              <CheckCircleIcon size={18} weight="fill" /> ENROLLED & ACTIVE
            </span>
          )}
        </div>
      </header>

      {/* Lesson Viewer Grid */}
      <div className="grid grid-cols-3 gap-8 max-lg:grid-cols-1">
        {/* Active Lesson Content Area */}
        <div className="col-span-2 flex flex-col gap-6">
          <Card className="flex flex-col overflow-hidden p-6">
            <div className="relative flex aspect-video w-full items-center justify-center rounded bg-black/90 text-white">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sf-primary/80 text-white transition hover:scale-110">
                  <PlayIcon size={32} weight="fill" />
                </div>
                <span className="text-xs font-bold tracking-[1px]">{activeLesson.title}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-b border-sf-divider pb-4">
              <div>
                <h2 className="m-0 text-xl font-black">{activeLesson.title}</h2>
                <span className="text-[10px] font-bold tracking-[1px] text-sf-secondary-text uppercase">
                  Duration: {activeLesson.duration}
                </span>
              </div>
              <Button
                variant={completedLessons.has(activeLesson.id) ? 'ghost' : 'primary'}
                size="small"
                onClick={() => toggleComplete(activeLesson.id)}
              >
                {completedLessons.has(activeLesson.id) ? 'COMPLETED ✓' : 'MARK AS COMPLETE'}
              </Button>
            </div>

            <div className="mt-4 text-sm leading-relaxed text-sf-text">
              <h4 className="mb-2 text-xs font-bold uppercase tracking-[1px]">Lesson Summary & Notes</h4>
              <p>{activeLesson.content}</p>
            </div>
          </Card>
        </div>

        {/* Syllabus / Module Accordion Sidebar */}
        <div className="flex flex-col gap-4">
          <h3 className="m-0 text-lg font-black uppercase tracking-[1px]">COURSE SYLLABUS</h3>

          {sampleModules.map((mod) => (
            <Card key={mod.id} className="flex flex-col gap-3 p-4">
              <h4 className="m-0 text-xs font-black text-sf-primary uppercase">{mod.title}</h4>
              <div className="flex flex-col gap-2 border-t border-sf-divider pt-2">
                {mod.lessons.map((lesson) => {
                  const isSelected = activeLesson.id === lesson.id
                  const isDone = completedLessons.has(lesson.id)
                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => setActiveLesson(lesson)}
                      className={`flex items-center justify-between rounded p-2 text-left text-xs transition ${
                        isSelected ? 'bg-sf-primary/10 font-bold text-sf-primary' : 'hover:bg-sf-secondary-bg'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {isDone ? (
                          <CheckCircleIcon size={16} weight="fill" className="text-[#87d300] flex-none" />
                        ) : (
                          <PlayIcon size={14} className="flex-none text-sf-secondary-text" />
                        )}
                        <span className="truncate">{lesson.title}</span>
                      </div>
                      <span className="text-[10px] text-sf-secondary-text ml-2 flex-none">{lesson.duration}</span>
                    </button>
                  )
                })}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
