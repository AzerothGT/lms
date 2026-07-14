import {
  GraduationCapIcon,
  EnvelopeIcon,
  LockIcon,
  GlobeIcon,
  GoogleLogoIcon,
  WindowsLogoIcon,
} from '@phosphor-icons/react'

const icons = {
  strapi: GraduationCapIcon,
  email: EnvelopeIcon,
  lock: LockIcon,
  language: GlobeIcon,
  google: GoogleLogoIcon,
  microsoft: WindowsLogoIcon,
}

export default function Icon({ name, size = 18, className = '' }) {
  const Cmp = icons[name]
  if (!Cmp) return null
  return <Cmp size={size} className={className} weight="bold" />
}
