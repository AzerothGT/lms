import { useState } from 'react'
import Card from '../../shared/Card'
import Button from '../../shared/Button'
import { StarIcon } from '@phosphor-icons/react'

const palette = ['#0091c3', '#87d300', '#ffcc00', '#e11b22']
const PAYMENT_URL = 'https://app.sandbox.midtrans.com/payment-links/16c4ee41-66cf-4063-ab36-edf5c2607b5e-ZF8cspKb'

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

export default function CourseCard({ course, index = 0, enrolled, onEnroll, loading: externalLoading = false }) {
  const [enrolling, setEnrolling] = useState(false)
  const isLoading = externalLoading || enrolling

  const handleEnroll = async (e) => {
    if (!onEnroll || isLoading) return
    setEnrolling(true)
    try {
      await onEnroll(e)
      window.open(PAYMENT_URL, '_blank')
    } catch (err) {
    } finally {
      setEnrolling(false)
    }
  }

  const color = palette[index % palette.length]
  const instructor = course.instructor?.name ?? 'Unknown'
  const level = String(course.level ?? '').toUpperCase()

  return (
    <Card className="flex flex-col overflow-hidden transition hover:shadow-lg">
      <div className="h-28 w-full block" style={{ backgroundColor: color }} aria-label={course.title} />
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <span className="rounded bg-sf-secondary-bg px-2 py-1 text-[10px] font-bold tracking-[1px]">
            {level}
          </span>
          <span className="text-[10px] font-bold tracking-[1px] text-sf-secondary-text">
            {course.duration ?? '—'} {course.duration ? 'WEEKS' : ''}
          </span>
        </div>

        <h3 className="m-0 text-base font-black leading-tight text-sf-text">
          {course.title}
        </h3>
        <p className="m-0 text-sm text-sf-secondary-text line-clamp-2">{course.description}</p>

        <div className="mt-2 flex items-center justify-between border-t border-sf-divider pt-3">
          <div className="flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-sf-on-primary"
              style={{ backgroundColor: color }}
            >
              {initials(instructor)}
            </span>
            <span className="text-[12px] font-bold">{instructor}</span>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-bold tracking-[1px] text-sf-secondary-text">
            <StarIcon size={12} weight="fill" className="text-[#ffcc00]" />
            {course.rating ?? '—'}
          </span>
        </div>

        {onEnroll && (
          <div className="mt-2 flex items-center justify-end border-t border-sf-divider pt-3">
            {enrolled ? (
              <span className="text-[10px] font-bold tracking-[1px] text-sf-primary">
                ENROLLED
              </span>
            ) : (
              <Button
                variant="primary"
                size="small"
                type="button"
                onClick={handleEnroll}
                loading={isLoading}
              >
                {isLoading ? 'ENROLLING...' : 'ENROLL'}
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

