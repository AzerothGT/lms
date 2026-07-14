import Icon from '../shared/LogoIcon'

export default function BrandPanel() {
  return (
    <aside className="relative flex w-120 flex-none items-center justify-center border-r border-sf-divider bg-sf-secondary-bg max-md:w-full max-md:py-12">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,#0091c3_0_25%,#87d300_25%_50%,#ffcc00_50%_75%,#e11b22_75%_100%)]"
      />
      <div className="flex flex-col items-center gap-6 px-8">
        <Icon name="strapi" size={80} className="text-sf-text" />
        <div className="flex flex-col items-start gap-1">
          <span className="text-[36px] font-black leading-none tracking-wide">
            DIBIEDU
          </span>
          <span className="text-[10px] font-bold tracking-[1px] text-sf-secondary-text">
            LEARNING MANAGEMENT SYSTEM
          </span>
        </div>
        <span aria-hidden="true" className="h-px w-30 bg-sf-divider" />
        <span className="text-[10px] font-bold tracking-[1px] text-sf-primary">
          MUNICH 1972 EDITION
        </span>
      </div>
    </aside>
  )
}
