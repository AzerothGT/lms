const reasons = [
  {
    title: 'Expert Instructors',
    desc: 'Learn from industry professionals with real-world experience.',
    color: '#0091c3',
  },
  {
    title: 'Flexible Learning',
    desc: 'Study at your own pace, anywhere and on any device.',
    color: '#87d300',
  },
  {
    title: 'Recognized Certificates',
    desc: 'Earn certificates that are valued by employers worldwide.',
    color: '#ffcc00',
  },
  {
    title: 'Community Support',
    desc: 'Join a global community of learners and mentors.',
    color: '#e11b22',
  },
]

export default function WhyUs() {
  return (
    <section className="border-t border-sf-divider bg-sf-secondary-bg">
      <div className="mx-auto w-full max-w-6xl px-8 py-20 max-md:px-4 max-md:py-12">
        <header className="mb-10 flex flex-col gap-1">
          <h2 className="m-0 text-[40px] font-black leading-none max-md:text-[28px]">
            WHY CHOOSE DIBIEDU
          </h2>
          <span className="text-[10px] font-bold tracking-[1px] text-sf-secondary-text">
            BUILT FOR MODERN LEARNERS
          </span>
        </header>

        <div className="grid grid-cols-4 gap-8 max-md:grid-cols-1 max-lg:grid-cols-2">
          {reasons.map((reason) => (
            <div key={reason.title} className="flex flex-col gap-3">
              <span
                aria-hidden="true"
                className="h-1 w-8 rounded-full"
                style={{ backgroundColor: reason.color }}
              />
              <h3 className="m-0 text-base font-black">{reason.title}</h3>
              <p className="m-0 text-sm text-sf-secondary-text">{reason.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
