import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { Plus, TrendingUp } from 'lucide-react'
import { dealService } from '../../services/dealService'
import { customerService } from '../../services/customerService'
import { Table, Pagination } from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Select from '../../components/ui/Select'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import DealForm from '../../components/deals/DealForm'
import { usePagination } from '../../hooks/usePagination'
import { Pencil, Trash2 } from 'lucide-react'

const STAGE_OPTIONS = [
  { value: '', label: 'All stages' },
  { value: 'PROSPECTING',       label: 'Prospecting' },
  { value: 'QUALIFICATION',     label: 'Qualification' },
  { value: 'NEEDS_ANALYSIS',    label: 'Needs Analysis' },
  { value: 'VALUE_PROPOSITION', label: 'Value Proposition' },
  { value: 'PROPOSAL',          label: 'Proposal' },
  { value: 'NEGOTIATION',       label: 'Negotiation' },
  { value: 'CLOSED_WON',        label: 'Closed Won' },
  { value: 'CLOSED_LOST',       label: 'Closed Lost' },
]

const COLUMNS = (onEdit, onDelete) => [
  {
    key: 'title',
    header: 'Deal',
    render: (row) => (
      <div>
        <p className="font-medium text-gray-900">{row.title}</p>
        <p className="text-xs text-gray-400">{row.customerName}</p>
      </div>
    ),
  },
  {
    key: 'value',
    header: 'Value',
    render: (row) => (
      <span className="font-semibold text-gray-800">
        ${Number(row.value).toLocaleString()}
      </span>
    ),
  },
  { key: 'stage',   header: 'Stage', render: (row) => <Badge label={row.stage} /> },
  {
    key: 'expectedCloseDate',
    header: 'Close Date',
    render: (r) => r.expectedCloseDate
      ? new Date(r.expectedCloseDate).toLocaleDateString()
      : <span className="text-gray-300">—</span>,
  },
  { key: 'ownerName', header: 'Owner', render: (r) => r.ownerName || <span className="text-gray-300">—</span> },
  {
    key: 'actions',
    header: '',
    className: 'w-24',
    render: (row) => (
      <div className="flex items-center gap-1 justify-end">
        <button onClick={() => onEdit(row)} className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors">
          <Pencil size={14} />
        </button>
        <button onClick={() => onDelete(row)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
    ),
  },
]

export default function DealsPage() {
  const [data, setData]       = useState({ content: [], totalElements: 0, totalPages: 0 })
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [stage, setStage]     = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget]   = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [saving, setSaving]   = useState(false)
  const [deleting, setDeleting] = useState(false)

  const { page, size, goToPage, resetPage } = usePagination()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await dealService.getAll({ page, size, sort: 'createdAt,desc', stage: stage || undefined })
      setData(res ?? { content: [], totalElements: 0, totalPages: 0 })
    } catch {
      toast.error('Failed to load deals')
    } finally {
      setLoading(false)
    }
  }, [page, size, stage])

  useEffect(() => { load() }, [load])
  useEffect(() => { resetPage() }, [stage])

  // Load customers for the deal form dropdown
  useEffect(() => {
    customerService.getAll({ page: 0, size: 100, sort: 'name,asc' })
      .then((res) => setCustomers(res?.content ?? []))
      .catch(() => {})
  }, [])

  const openCreate = () => { setEditTarget(null); setModalOpen(true) }
  const openEdit   = (row) => { setEditTarget(row); setModalOpen(true) }
  const openDelete = (row) => setDeleteTarget(row)

  const handleSave = async (payload) => {
    setSaving(true)
    try {
      if (editTarget) {
        await dealService.update(editTarget.id, payload)
        toast.success('Deal updated')
      } else {
        await dealService.create(payload)
        toast.success('Deal created')
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
      await dealService.remove(deleteTarget.id)
      toast.success('Deal deleted')
      setDeleteTarget(null)
      load()
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  // Pipeline summary
  const totalValue = data.content.reduce((sum, d) => sum + Number(d.value), 0)

  return (
    <div className="space-y-5">
      {/* Pipeline value banner */}
      <div className="card p-5 flex items-center gap-4">
        <div className="p-3 bg-amber-50 rounded-xl">
          <TrendingUp size={22} className="text-amber-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Pipeline value (current page)</p>
          <p className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select
          options={STAGE_OPTIONS}
          value={stage}
          onChange={(e) => setStage(e.target.value)}
          className="sm:w-52"
        />
        <div className="sm:ml-auto">
          <Button icon={<Plus size={16} />} onClick={openCreate}>Add Deal</Button>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">{data.totalElements}</span> deals
          </p>
        </div>
        <div className="p-4">
          <Table
            columns={COLUMNS(openEdit, openDelete)}
            data={data.content}
            loading={loading}
            emptyMessage="No deals yet. Create your first opportunity!"
          />
          <Pagination
            page={page}
            totalPages={data.totalPages}
            totalElements={data.totalElements}
            size={size}
            onPageChange={goToPage}
          />
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? 'Edit Deal' : 'New Deal'}
        size="md"
      >
        <DealForm
          initial={editTarget}
          customers={customers}
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
        title="Delete Deal"
        message={`Delete "${deleteTarget?.title}"?`}
      />
    </div>
  )
}
