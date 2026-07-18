import { useEffect } from 'react'

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 flex w-full max-w-lg flex-col gap-5 rounded-lg border border-sf-divider bg-sf-bg p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="m-0 text-lg font-black">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-0 bg-sf-secondary-bg text-sf-text"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
