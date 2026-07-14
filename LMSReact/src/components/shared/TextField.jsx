import Icon from './LogoIcon'

export default function TextField({
  label,
  hint,
  leadingIcon,
  type = 'text',
  ...rest
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-bold tracking-[1px] text-sf-secondary-text">
        {label}
      </span>
      <span className="flex items-center gap-2 rounded border border-sf-divider px-3">
        {leadingIcon && (
          <Icon name={leadingIcon} size={18} className="text-sf-secondary-text" />
        )}
        <input
          className="w-full bg-transparent py-3 font-sans text-sf-text outline-none placeholder:text-[#888]"
          type={type}
          placeholder={hint}
          {...rest}
        />
      </span>
    </label>
  )
}
