import clsx from 'clsx'

export function Card({ children, className, ...props }) {
  return (
    <div className={clsx('card p-5', className)} {...props}>
      {children}
    </div>
  )
}

export function StatCard({ icon, label, value, trend, color = 'primary' }) {
  const colors = {
    primary: 'bg-primary-50 text-primary-600',
    green:   'bg-green-50 text-green-600',
    amber:   'bg-amber-50 text-amber-600',
    rose:    'bg-rose-50 text-rose-600',
  }

  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={clsx('p-3 rounded-xl', colors[color])}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500 truncate">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
        {trend !== undefined && (
          <p className="text-xs text-gray-400 mt-0.5">{trend}</p>
        )}
      </div>
    </div>
  )
}
