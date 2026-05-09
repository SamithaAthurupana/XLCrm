import { Phone, Users, Mail, StickyNote, FileText, CheckSquare, Pencil, Trash2 } from 'lucide-react'
import clsx from 'clsx'
import Spinner from '../ui/Spinner'
import Badge from '../ui/Badge'

const TYPE_META = {
  CALL:    { Icon: Phone,       bg: 'bg-cyan-100',   icon: 'text-cyan-600' },
  MEETING: { Icon: Users,       bg: 'bg-indigo-100', icon: 'text-indigo-600' },
  EMAIL:   { Icon: Mail,        bg: 'bg-sky-100',    icon: 'text-sky-600' },
  NOTE:    { Icon: StickyNote,  bg: 'bg-amber-100',  icon: 'text-amber-600' },
  TASK:    { Icon: CheckSquare, bg: 'bg-purple-100',  icon: 'text-purple-600' },
}

function TimelineItem({ activity, onEdit, onDelete }) {
  const meta = TYPE_META[activity.type] ?? TYPE_META.NOTE
  const { Icon } = meta

  const date = new Date(activity.occurredAt)
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="relative flex gap-4">
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div className={clsx('w-9 h-9 rounded-full flex items-center justify-center shrink-0', meta.bg)}>
          <Icon size={16} className={meta.icon} />
        </div>
        <div className="w-px flex-1 bg-gray-100 mt-2" />
      </div>

      {/* Content */}
      <div className="pb-6 flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-900">{activity.subject}</span>
              <Badge label={activity.type} />
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {dateStr} at {timeStr}
              {activity.customerName && <> · <span className="text-gray-500">{activity.customerName}</span></>}
              {activity.dealTitle    && <> · <span className="text-primary-500">{activity.dealTitle}</span></>}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(activity)}
              className="p-1.5 rounded-lg text-gray-300 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => onDelete(activity)}
              className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {activity.notes && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{activity.notes}</p>
          </div>
        )}

        {activity.createdByName && (
          <p className="text-xs text-gray-400 mt-1.5">Logged by {activity.createdByName}</p>
        )}
      </div>
    </div>
  )
}

export default function ActivityTimeline({ activities, loading, onEdit, onDelete }) {
  if (loading) {
    return <div className="flex justify-center py-12"><Spinner size="lg" /></div>
  }

  if (!activities.length) {
    return (
      <div className="text-center py-12">
        <FileText size={40} className="text-gray-200 mx-auto mb-3" />
        <p className="text-sm text-gray-400">No activities yet. Log your first interaction!</p>
      </div>
    )
  }

  return (
    <div>
      {activities.map((a) => (
        <TimelineItem key={a.id} activity={a} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
