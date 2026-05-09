import { useState } from 'react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'

const STAGE_OPTIONS = [
  { value: 'PROSPECTING',       label: 'Prospecting' },
  { value: 'QUALIFICATION',     label: 'Qualification' },
  { value: 'NEEDS_ANALYSIS',    label: 'Needs Analysis' },
  { value: 'VALUE_PROPOSITION', label: 'Value Proposition' },
  { value: 'PROPOSAL',          label: 'Proposal' },
  { value: 'NEGOTIATION',       label: 'Negotiation' },
  { value: 'CLOSED_WON',        label: 'Closed Won' },
  { value: 'CLOSED_LOST',       label: 'Closed Lost' },
]

const EMPTY = { title: '', value: '', stage: 'PROSPECTING', customerId: '', expectedCloseDate: '', notes: '' }

export default function DealForm({ initial, customers = [], onSubmit, onCancel, saving }) {
  const [form, setForm]     = useState(initial ? {
    title:             initial.title             ?? '',
    value:             initial.value             ?? '',
    stage:             initial.stage             ?? 'PROSPECTING',
    customerId:        initial.customerId        ?? '',
    expectedCloseDate: initial.expectedCloseDate ?? '',
    notes:             initial.notes             ?? '',
  } : EMPTY)
  const [errors, setErrors] = useState({})

  const customerOptions = [
    { value: '', label: 'Select customer…' },
    ...customers.map((c) => ({ value: String(c.id), label: c.name })),
  ]

  const validate = () => {
    const e = {}
    if (!form.title.trim())       e.title      = 'Title is required'
    if (!form.value && form.value !== 0) e.value = 'Value is required'
    else if (isNaN(Number(form.value)) || Number(form.value) < 0) e.value = 'Enter a valid amount'
    if (!form.customerId) e.customerId = 'Customer is required'
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
      ...form,
      value:      Number(form.value),
      customerId: Number(form.customerId),
      expectedCloseDate: form.expectedCloseDate || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <Input label="Title *"  value={form.title} onChange={set('title')} error={errors.title} placeholder="Deal title" />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Value (USD) *"
          type="number"
          min="0"
          step="0.01"
          value={form.value}
          onChange={set('value')}
          error={errors.value}
          placeholder="0.00"
        />
        <Input
          label="Expected Close Date"
          type="date"
          value={form.expectedCloseDate}
          onChange={set('expectedCloseDate')}
        />
      </div>

      <Select label="Stage" value={form.stage} onChange={set('stage')} options={STAGE_OPTIONS} />

      <Select
        label="Customer *"
        value={String(form.customerId)}
        onChange={set('customerId')}
        options={customerOptions}
        error={errors.customerId}
      />

      <div>
        <label className="form-label">Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          rows={3}
          placeholder="Additional notes…"
          className="form-input resize-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={saving}>
          {initial ? 'Update Deal' : 'Create Deal'}
        </Button>
      </div>
    </form>
  )
}
