export default function Card({
  as: Tag = 'div',
  className = '',
  image,
  imageAlt = '',
  imageClassName = 'h-40 w-full object-cover',
  children,
  ...rest
}) {
  return (
    <Tag
      className={`overflow-hidden rounded border border-sf-divider bg-sf-bg transition hover:shadow-lg ${className}`}
      {...rest}
    >
      {image && (
        <img src={image} alt={imageAlt} className={imageClassName} loading="lazy" />
      )}
      {children}
    </Tag>
  )
}
