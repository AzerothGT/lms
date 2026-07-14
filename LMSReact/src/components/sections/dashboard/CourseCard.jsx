import Card from '../../shared/Card'

const palette = ['#0091c3', '#87d300', '#ffcc00', '#e11b22']

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

export default function CourseCard({ course, index = 0 }) {
  const color = palette[index % palette.length]
  const instructor = course.instructor?.name ?? 'Unknown'
  const level = String(course.level ?? '').toUpperCase()

  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="h-28 w-full" style={{ backgroundColor: color }} aria-hidden="true" />
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <span className="rounded bg-sf-secondary-bg px-2 py-1 text-[10px] font-bold tracking-[1px]">
            {level}
          </span>
          <span className="text-[10px] font-bold tracking-[1px] text-sf-secondary-text">
            {course.duration ?? '—'} {course.duration ? 'WEEKS' : ''}
          </span>
        </div>

        <h3 className="m-0 text-base font-black leading-tight">{course.title}</h3>
        <p className="m-0 text-sm text-sf-secondary-text">{course.description}</p>

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
          <span className="text-[10px] font-bold tracking-[1px] text-sf-secondary-text">
            {course.enrolled_count ?? 0} STUDENTS
          </span>
        </div>
      </div>
    </Card>
  )
}
