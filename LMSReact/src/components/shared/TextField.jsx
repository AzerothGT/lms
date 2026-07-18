import Icon from './LogoIcon'

export default function TextField({
  label,
  hint,
  leadingIcon,
  type = 'text',
  as,
  children,
  className,
  ...rest
}) {
  const Tag = as === 'textarea' ? 'textarea' : as === 'select' ? 'select' : 'input'
  const wrapperClass = as === 'textarea'
    ? 'min-h-24 rounded border border-sf-divider bg-transparent px-3 py-3 font-sans text-sm text-sf-text outline-none placeholder:text-[#888]'
    : as === 'select'
      ? 'h-10 appearance-none rounded border border-sf-divider bg-transparent pl-3 pr-8 text-[10px] font-bold tracking-[1px] text-sf-text outline-none'
      : 'w-full bg-transparent py-3 font-sans text-sf-text outline-none placeholder:text-[#888]'

  return (
    <label className={['flex flex-col gap-1', className].filter(Boolean).join(' ')}>
      <span className="text-[10px] font-bold tracking-[1px] text-sf-secondary-text">
        {label}
      </span>
      {as === 'select' ? (
        <Tag className={wrapperClass} {...rest}>
          {children}
        </Tag>
      ) : as === 'textarea' ? (
        <Tag className={wrapperClass} placeholder={hint} {...rest} />
      ) : (
        <span className="flex h-10 items-center gap-2 rounded border border-sf-divider px-3">
          {leadingIcon && (
            <Icon name={leadingIcon} size={18} className="text-sf-secondary-text" />
          )}
          <Tag
            className={wrapperClass}
            type={type}
            placeholder={hint}
            {...rest}
          />
        </span>
      )}
    </label>
  )
}
