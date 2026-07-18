import BrandPanel from '../sections/BrandPanel'
import LoginForm from '../sections/LoginForm'
import Icon from '../shared/LogoIcon'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col bg-sf-bg font-sans text-sf-text">
      <div className="flex flex-1 max-md:flex-col">
        <BrandPanel />
        <section className="flex flex-1 items-center justify-center p-8">
          <div className="w-100 max-w-full">
            <LoginForm />
          </div>
        </section>
      </div>

      <footer className="flex items-center justify-between gap-4 border-t border-sf-divider px-8 py-4 text-[10px] font-bold tracking-[1px] max-md:flex-col max-md:items-start max-md:gap-3">
        <div className="flex gap-6 text-sf-secondary-text">
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
          className="flex items-center gap-2 bg-transparent font-bold tracking-[1px] text-sf-text"
        >
          <Icon name="language" size={16} />
          ENGLISH (DE)
        </button>
      </footer>
    </main>
  )
}
