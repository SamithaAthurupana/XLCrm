import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { Plus, Search, Filter } from 'lucide-react'
import { customerService } from '../../services/customerService'
import { Table, Pagination } from '../../components/ui/Table'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Select from '../../components/ui/Select'
import CustomerForm from '../../components/customers/CustomerForm'
import { useDebounce } from '../../hooks/useDebounce'
import { usePagination } from '../../hooks/usePagination'
import { Pencil, Trash2 } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'NEW',       label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'QUALIFIED', label: 'Qualified' },
  { value: 'WON',       label: 'Won' },
  { value: 'LOST',      label: 'Lost' },
]

const COLUMNS = (onEdit, onDelete) => [
  {
    key: 'name',
    header: 'Name',
    render: (row) => (
      <div>
        <p className="font-medium text-gray-900">{row.name}</p>
        <p className="text-xs text-gray-400">{row.email}</p>
      </div>
    ),
  },
  { key: 'company', header: 'Company', render: (r) => r.company || <span className="text-gray-300">—</span> },
  { key: 'phone',   header: 'Phone',   render: (r) => r.phone   || <span className="text-gray-300">—</span> },
  {
    key: 'status',
    header: 'Status',
    render: (row) => <Badge label={row.status} />,
  },
  {
    key: 'assignedTo',
    header: 'Assigned to',
    render: (r) => r.assignedToUserName || <span className="text-gray-300">—</span>,
  },
  {
    key: 'actions',
    header: '',
    className: 'w-24',
    render: (row) => (
      <div className="flex items-center gap-1 justify-end">
        <button
          onClick={() => onEdit(row)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(row)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    ),
  },
]

export default function CustomersPage() {
  const [data, setData]           = useState({ content: [], totalElements: 0, totalPages: 0 })
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [status, setStatus]       = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting]   = useState(false)
  const [saving, setSaving]       = useState(false)

  const debouncedSearch = useDebounce(search)
  const { page, size, goToPage, resetPage } = usePagination()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await customerService.getAll({
        page, size, sort: 'name,asc',
        search: debouncedSearch || undefined,
        status: status || undefined,
      })
      setData(res ?? { content: [], totalElements: 0, totalPages: 0 })
    } catch {
      toast.error('Failed to load customers')
    } finally {
      setLoading(false)
    }
  }, [page, size, debouncedSearch, status])

  useEffect(() => { load() }, [load])

  // Reset page when filters change
  useEffect(() => { resetPage() }, [debouncedSearch, status])

  const openCreate = () => { setEditTarget(null); setModalOpen(true) }
  const openEdit   = (row) => { setEditTarget(row); setModalOpen(true) }
  const openDelete = (row) => setDeleteTarget(row)

  const handleSave = async (payload) => {
    setSaving(true)
    try {
      if (editTarget) {
        await customerService.update(editTarget.id, payload)
        toast.success('Customer updated')
      } else {
        await customerService.create(payload)
        toast.success('Customer created')
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
      await customerService.remove(deleteTarget.id)
      toast.success('Customer deleted')
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
        <Input
          placeholder="Search name, email, company…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search size={15} />}
          className="sm:max-w-xs"
        />
        <Select
          options={STATUS_OPTIONS}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="sm:w-44"
        />
        <div className="sm:ml-auto">
          <Button icon={<Plus size={16} />} onClick={openCreate}>
            Add Customer
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">{data.totalElements}</span> customers
          </p>
        </div>
        <div className="p-4">
          <Table
            columns={COLUMNS(openEdit, openDelete)}
            data={data.content}
            loading={loading}
            emptyMessage="No customers found. Add your first customer!"
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

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? 'Edit Customer' : 'Add Customer'}
        size="md"
      >
        <CustomerForm
          initial={editTarget}
          onSubmit={handleSave}
          onCancel={() => setModalOpen(false)}
          saving={saving}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Customer"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This will also remove associated deals and activities.`}
      />
    </div>
  )
}
