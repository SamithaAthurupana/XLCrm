import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'
import { activityService } from '../../services/activityService'
import { customerService } from '../../services/customerService'
import { dealService } from '../../services/dealService'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import ActivityTimeline from '../../components/activities/ActivityTimeline'
import ActivityForm from '../../components/activities/ActivityForm'
import { usePagination } from '../../hooks/usePagination'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const TYPE_OPTIONS = [
  { value: '', label: 'All types' },
  { value: 'CALL',    label: 'Call' },
  { value: 'MEETING', label: 'Meeting' },
  { value: 'EMAIL',   label: 'Email' },
  { value: 'NOTE',    label: 'Note' },
  { value: 'TASK',    label: 'Task' },
]

export default function ActivitiesPage() {
  const [data, setData]       = useState({ content: [], totalElements: 0, totalPages: 0 })
  const [customers, setCustomers] = useState([])
  const [deals, setDeals]     = useState([])
  const [loading, setLoading] = useState(true)
  const [type, setType]       = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget]   = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving]   = useState(false)
  const [deleting, setDeleting] = useState(false)

  const { page, size, goToPage, resetPage } = usePagination(0, 15)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await activityService.getAll({
        page, size, sort: 'occurredAt,desc',
        type: type || undefined,
      })
      setData(res ?? { content: [], totalElements: 0, totalPages: 0 })
    } catch {
      toast.error('Failed to load activities')
    } finally {
      setLoading(false)
    }
  }, [page, size, type])

  useEffect(() => { load() }, [load])
  useEffect(() => { resetPage() }, [type])

  // Load dropdown options
  useEffect(() => {
    Promise.all([
      customerService.getAll({ page: 0, size: 200, sort: 'name,asc' }),
      dealService.getAll({ page: 0, size: 200, sort: 'title,asc' }),
    ]).then(([c, d]) => {
      setCustomers(c?.content ?? [])
      setDeals(d?.content ?? [])
    }).catch(() => {})
  }, [])

  const openCreate = () => { setEditTarget(null); setModalOpen(true) }
  const openEdit   = (row) => { setEditTarget(row); setModalOpen(true) }
  const openDelete = (row) => setDeleteTarget(row)

  const handleSave = async (payload) => {
    setSaving(true)
    try {
      if (editTarget) {
        await activityService.update(editTarget.id, payload)
        toast.success('Activity updated')
      } else {
        await activityService.create(payload)
        toast.success('Activity logged')
      }
      setModalOpen(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await activityService.remove(deleteTarget.id)
      toast.success('Activity deleted')
      setDeleteTarget(null)
      load()
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select
          options={TYPE_OPTIONS}
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="sm:w-48"
        />
        <div className="sm:ml-auto">
          <Button icon={<Plus size={16} />} onClick={openCreate}>Log Activity</Button>
        </div>
      </div>

      {/* Timeline + pagination */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">{data.totalElements}</span> activities
          </p>
          {data.totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 0}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm text-gray-600 px-2">
                {page + 1} / {data.totalPages}
              </span>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= data.totalPages - 1}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        <ActivityTimeline
          activities={data.content}
          loading={loading}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? 'Edit Activity' : 'Log Activity'}
        size="md"
      >
        <ActivityForm
          initial={editTarget}
          customers={customers}
          deals={deals}
          onSubmit={handleSave}
          onCancel={() => setModalOpen(false)}
          saving={saving}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Activity"
        message={`Delete activity "${deleteTarget?.subject}"?`}
      />
    </div>
  )
}
