import { useEffect, useRef, useState } from 'react'
import { CaretDownIcon, CheckIcon } from '@phosphor-icons/react'

export default function Dropdown({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  disabled = false,
  fullWidth = true,
  className = '',
  size = 'medium',
  icon: LeadingIcon,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Normalize options array into objects { value, label, description }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return {
        value: opt.value,
        label: opt.label ?? String(opt.value),
        description: opt.description,
        disabled: opt.disabled ?? false,
      }
    }
    return {
      value: opt,
      label: String(opt),
      disabled: false,
    }
  })

  const selectedOption = normalizedOptions.find((opt) => opt.value === value)

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  function handleSelect(opt) {
    if (opt.disabled || disabled) return
    onChange(opt.value)
    setIsOpen(false)
  }

  const heightClasses = {
    small: 'h-8 text-xs px-2.5',
    medium: 'h-10 text-sm px-3',
    large: 'h-12 text-base px-4',
  }

  return (
    <div
      ref={dropdownRef}
      className={[
        'relative flex flex-col gap-1',
        fullWidth ? 'w-full' : 'inline-block',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label && (
        <span className="text-[10px] font-bold tracking-[1px] text-sf-secondary-text uppercase">
          {label}
        </span>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={[
          'flex w-full items-center justify-between gap-2 rounded border border-sf-divider bg-sf-bg font-sans text-sf-text outline-none transition cursor-pointer select-none',
          'hover:border-sf-primary focus:border-sf-primary focus:ring-1 focus:ring-sf-primary',
          'disabled:cursor-not-allowed disabled:opacity-50',
          heightClasses[size] || heightClasses.medium,
        ].join(' ')}
      >
        <div className="flex items-center gap-2 truncate">
          {LeadingIcon && <LeadingIcon size={16} className="text-sf-secondary-text shrink-0" />}
          <span className={selectedOption ? 'font-bold text-sf-text truncate' : 'text-[#888] truncate'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <CaretDownIcon
          size={14}
          weight="bold"
          className={[
            'text-sf-secondary-text shrink-0 transition-transform duration-200',
            isOpen ? 'rotate-180 text-sf-primary' : '',
          ].join(' ')}
        />
      </button>

      {/* Menu Popover */}
      {isOpen && (
        <div className="absolute left-0 top-[full] z-50 mt-1 flex max-h-60 w-full flex-col overflow-y-auto rounded-lg border border-sf-divider bg-sf-bg p-1 shadow-2xl backdrop-blur-md">
          {normalizedOptions.length === 0 ? (
            <div className="px-3 py-2 text-xs text-sf-secondary-text">No options</div>
          ) : (
            normalizedOptions.map((opt) => {
              const isSelected = opt.value === value
              return (
                <button
                  key={String(opt.value)}
                  type="button"
                  disabled={opt.disabled}
                  onClick={() => handleSelect(opt)}
                  className={[
                    'flex w-full items-center justify-between gap-2 rounded px-3 py-2.5 text-left text-xs font-bold transition cursor-pointer',
                    isSelected
                      ? 'bg-sf-primary/15 text-sf-primary'
                      : 'text-sf-text hover:bg-sf-secondary-bg',
                    opt.disabled ? 'cursor-not-allowed opacity-40' : '',
                  ].join(' ')}
                >
                  <div className="flex flex-col">
                    <span className="truncate">{opt.label}</span>
                    {opt.description && (
                      <span className="text-[10px] font-normal text-sf-secondary-text">
                        {opt.description}
                      </span>
                    )}
                  </div>
                  {isSelected && <CheckIcon size={14} weight="bold" className="shrink-0 text-sf-primary" />}
                </button>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
