import { useState } from 'react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'

const TYPE_OPTIONS = [
  { value: 'CALL',    label: 'Call' },
  { value: 'MEETING', label: 'Meeting' },
  { value: 'EMAIL',   label: 'Email' },
  { value: 'NOTE',    label: 'Note' },
  { value: 'TASK',    label: 'Task' },
]

// Format LocalDateTime to datetime-local input value
const toDatetimeLocal = (dt) => {
  if (!dt) return ''
  return dt.replace(' ', 'T').slice(0, 16)
}

const EMPTY = {
  type: 'CALL', subject: '', notes: '',
  occurredAt: toDatetimeLocal(new Date().toISOString()),
  customerId: '', dealId: '',
}

export default function ActivityForm({ initial, customers = [], deals = [], onSubmit, onCancel, saving }) {
  const [form, setForm]     = useState(initial ? {
    type:       initial.type       ?? 'CALL',
    subject:    initial.subject    ?? '',
    notes:      initial.notes      ?? '',
    occurredAt: toDatetimeLocal(initial.occurredAt ?? ''),
    customerId: initial.customerId ?? '',
    dealId:     initial.dealId     ?? '',
  } : EMPTY)
  const [errors, setErrors] = useState({})

  const customerOptions = [
    { value: '', label: 'Select customer…' },
    ...customers.map((c) => ({ value: String(c.id), label: c.name })),
  ]

  const dealOptions = [
    { value: '', label: 'No deal (optional)' },
    ...deals.map((d) => ({ value: String(d.id), label: `${d.title} — ${d.customerName}` })),
  ]

  const validate = () => {
    const e = {}
    if (!form.subject.trim())  e.subject    = 'Subject is required'
    if (!form.occurredAt)      e.occurredAt = 'Date & time is required'
    if (!form.customerId)      e.customerId = 'Customer is required'
    return e
  }

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors((err) => ({ ...err, [field]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    onSubmit({
      type:       form.type,
      subject:    form.subject,
      notes:      form.notes || undefined,
      occurredAt: form.occurredAt,
      customerId: Number(form.customerId),
      dealId:     form.dealId ? Number(form.dealId) : undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Type" value={form.type} onChange={set('type')} options={TYPE_OPTIONS} />
        <Input
          label="Date & Time *"
          type="datetime-local"
          value={form.occurredAt}
          onChange={set('occurredAt')}
          error={errors.occurredAt}
        />
      </div>

      <Input label="Subject *" value={form.subject} onChange={set('subject')} error={errors.subject} placeholder="Brief description" />

      <Select
        label="Customer *"
        value={String(form.customerId)}
        onChange={set('customerId')}
        options={customerOptions}
        error={errors.customerId}
      />

      <Select
        label="Link to Deal"
        value={String(form.dealId)}
        onChange={set('dealId')}
        options={dealOptions}
      />

      <div>
        <label className="form-label">Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          rows={4}
          placeholder="Details about the interaction…"
          className="form-input resize-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={saving}>
          {initial ? 'Update Activity' : 'Log Activity'}
        </Button>
      </div>
    </form>
  )
}
