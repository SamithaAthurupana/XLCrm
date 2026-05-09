import { useState } from 'react'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Button from '../ui/Button'

const STATUS_OPTIONS = [
  { value: 'NEW',       label: 'New' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'QUALIFIED', label: 'Qualified' },
  { value: 'WON',       label: 'Won' },
  { value: 'LOST',      label: 'Lost' },
]

const EMPTY = { name: '', email: '', phone: '', company: '', status: 'NEW' }

export default function CustomerForm({ initial, onSubmit, onCancel, saving }) {
  const [form, setForm]     = useState(initial ? {
    name:    initial.name    ?? '',
    email:   initial.email   ?? '',
    phone:   initial.phone   ?? '',
    company: initial.company ?? '',
    status:  initial.status  ?? 'NEW',
  } : EMPTY)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim())  e.name  = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
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
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Name *"    value={form.name}    onChange={set('name')}    error={errors.name}    placeholder="Full name" />
        <Input label="Email *"   value={form.email}   onChange={set('email')}   error={errors.email}   placeholder="email@example.com" type="email" />
        <Input label="Phone"     value={form.phone}   onChange={set('phone')}   placeholder="+1-555-0000" />
        <Input label="Company"   value={form.company} onChange={set('company')} placeholder="Company name" />
      </div>
      <Select label="Status" value={form.status} onChange={set('status')} options={STATUS_OPTIONS} />

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button type="submit" loading={saving}>
          {initial ? 'Update Customer' : 'Create Customer'}
        </Button>
      </div>
    </form>
  )
}
