const base =
  'inline-flex items-center justify-center gap-2 rounded border border-transparent font-bold tracking-wide transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed'

const variants = {
  primary: 'bg-sf-primary text-sf-on-primary hover:opacity-90',
  ghost: 'bg-transparent px-1 text-sf-primary hover:underline',
  outline:
    'border-sf-divider bg-transparent text-sf-text hover:bg-sf-secondary-bg',
}

const sizes = {
  small: 'px-2 py-1.5 text-xs',
  medium: 'px-4 py-2.5 text-sm',
  large: 'px-4 py-3.5 text-sm',
}

export default function Button({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  className = '',
  children,
  disabled,
  ...rest
}) {
  const cls = [
    base,
    variants[variant],
    sizes[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type="button" className={cls} disabled={disabled || loading} {...rest}>
      {loading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  )
}
