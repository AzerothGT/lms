export default function ComingSoon({ title }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <h1 className="m-0 text-[40px] font-black leading-none">{title}</h1>
      <p className="m-0 text-sm font-bold tracking-[1px] text-sf-secondary-text">
        THIS SECTION IS COMING SOON
      </p>
    </div>
  )
}
