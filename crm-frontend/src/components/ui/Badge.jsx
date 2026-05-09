import clsx from 'clsx'

const STATUS_STYLES = {
  // Customer statuses
  NEW:       'bg-blue-100 text-blue-700',
  CONTACTED: 'bg-yellow-100 text-yellow-700',
  QUALIFIED: 'bg-purple-100 text-purple-700',
  WON:       'bg-green-100 text-green-700',
  LOST:      'bg-red-100 text-red-700',

  // Deal stages
  PROSPECTING:       'bg-slate-100 text-slate-600',
  QUALIFICATION:     'bg-blue-100 text-blue-700',
  NEEDS_ANALYSIS:    'bg-indigo-100 text-indigo-700',
  VALUE_PROPOSITION: 'bg-violet-100 text-violet-700',
  PROPOSAL:          'bg-amber-100 text-amber-700',
  NEGOTIATION:       'bg-orange-100 text-orange-700',
  CLOSED_WON:        'bg-green-100 text-green-700',
  CLOSED_LOST:       'bg-red-100 text-red-700',

  // Activity types
  CALL:    'bg-cyan-100 text-cyan-700',
  MEETING: 'bg-indigo-100 text-indigo-700',
  EMAIL:   'bg-sky-100 text-sky-700',
  NOTE:    'bg-amber-100 text-amber-700',
  TASK:    'bg-purple-100 text-purple-700',

  // Roles
  ADMIN: 'bg-primary-100 text-primary-700',
  SALES: 'bg-teal-100 text-teal-700',
}

export default function Badge({ label, className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        STATUS_STYLES[label] ?? 'bg-gray-100 text-gray-600',
        className
      )}
    >
      {label?.replace(/_/g, ' ')}
    </span>
  )
}
