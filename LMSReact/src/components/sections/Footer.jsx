import Icon from '../shared/LogoIcon'

export default function Footer() {
  return (
    <footer className="flex items-center justify-between gap-4 border-t border-white/10 bg-[#111111] px-8 py-4 text-[10px] font-bold tracking-[1px] text-white/70 max-md:flex-col max-md:items-start max-md:gap-3">
      <div className="flex gap-6">
        <span>DIBIEDU</span>
        <a href="#" className="hover:text-sf-primary">
          IMPRINT
        </a>
        <a href="#" className="hover:text-sf-primary">
          PRIVACY
        </a>
      </div>
      <button
        type="button"
        className="flex items-center gap-2 bg-transparent font-bold tracking-[1px] text-white"
      >
        <Icon name="language" size={16} />
        ENGLISH (DE)
      </button>
    </footer>
  )
}
