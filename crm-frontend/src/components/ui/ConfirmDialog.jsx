import Modal from './Modal'
import Button from './Button'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, loading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title=" " size="sm">
      <div className="flex flex-col items-center text-center gap-4 pb-2">
        <div className="p-3 bg-red-50 rounded-full">
          <AlertTriangle size={28} className="text-red-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title ?? 'Are you sure?'}</h3>
          <p className="mt-1 text-sm text-gray-500">{message ?? 'This action cannot be undone.'}</p>
        </div>
        <div className="flex gap-3 w-full">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="danger" className="flex-1" loading={loading} onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  )
}
