import { useEffect, useState } from 'react'
import { enrollmentsApi } from '../../api/enrollments'
import { useAuth } from '../../context/AuthContext'
import Card from '../shared/Card'

const colors = ['#0091c3', '#87d300', '#ffcc00', '#e11b22']

export default function Classes() {
  const { user } = useAuth()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    enrollmentsApi
      .list()
      .then((data) => {
        if (!active) return
        const mine = Array.isArray(data)
          ? data.filter((e) => e.user?.id === user?.id)
          : []
        setEnrollments(mine)
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
          {enrollments.length} ENROLLED {enrollments.length === 1 ? 'COURSE' : 'COURSES'}
        </span>
      </header>

      {loading && <p className="m-0 text-sm text-sf-secondary-text">Loading classes…</p>}
      {error && <p className="m-0 text-sm font-bold text-[#e11b22]">{error}</p>}
      {!loading && !error && enrollments.length === 0 && (
        <p className="m-0 text-sm text-sf-secondary-text">
          You haven't enrolled in any courses yet.
        </p>
      )}

      {!loading && !error && enrollments.length > 0 && (
        <div className="grid grid-cols-3 gap-6 max-md:grid-cols-1 max-lg:grid-cols-2">
          {enrollments.map((enrollment, i) => (
            <Card key={enrollment.id} className="flex flex-col gap-4 p-6">
              <span
                aria-hidden="true"
                className="h-2 w-12 rounded-full"
                style={{ backgroundColor: colors[i % colors.length] }}
              />
              <h3 className="m-0 text-lg font-black leading-tight">
                {enrollment.course?.title ?? 'Untitled Course'}
              </h3>
              <span className="text-[10px] font-bold tracking-[1px] text-sf-secondary-text">
                ENROLLED {new Date(enrollment.enrolled_at).toLocaleDateString()}
              </span>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
