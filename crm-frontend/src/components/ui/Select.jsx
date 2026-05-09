import clsx from 'clsx'

export default function Select({ label, error, options = [], className, ...props }) {
  return (
    <div className="w-full">
      {label && <label className="form-label">{label}</label>}
      <select
        className={clsx(
          'form-input',
          error && 'border-red-400 focus:border-red-500 focus:ring-red-400',
          className
        )}
        {...props}
      >
        {options.map(({ value, label: optLabel }) => (
          <option key={value} value={value}>{optLabel}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
