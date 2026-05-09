import clsx from 'clsx'

export default function Input({
  label,
  error,
  icon,
  className,
  ...props
}) {
  return (
    <div className="w-full">
      {label && <label className="form-label">{label}</label>}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            {icon}
          </span>
        )}
        <input
          className={clsx(
            'form-input',
            icon && 'pl-9',
            error && 'border-red-400 focus:border-red-500 focus:ring-red-400',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
