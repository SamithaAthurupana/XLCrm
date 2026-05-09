import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { Mail, Lock } from 'lucide-react'

const INITIAL = { email: '', password: '' }

export default function LoginPage() {
  const { login, loading } = useAuth()
  const [form, setForm]     = useState(INITIAL)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.email)           e.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password)        e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'At least 6 characters'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((err) => ({ ...err, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    try {
      await login(form)
    } catch {
      // toast is shown by AuthContext
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-600 mb-4 shadow-lg">
          <span className="text-white font-bold text-2xl">C</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <p className="text-slate-400 text-sm mt-1">Sign in to your CRM account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label=""
          name="email"
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          icon={<Mail size={15} />}
          className="bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-primary-400"
        />
        <Input
          label=""
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          icon={<Lock size={15} />}
          className="bg-white/10 border-white/20 text-white placeholder-slate-400 focus:border-primary-400"
        />

        <Button type="submit" loading={loading} className="w-full mt-2 py-2.5 text-base">
          Sign in
        </Button>
      </form>

      {/* Seed credentials hint */}
      <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">Demo accounts</p>
        <div className="space-y-1">
          {[
            { email: 'admin@crm.com', role: 'Admin' },
            { email: 'alice@crm.com', role: 'Sales' },
          ].map(({ email, role }) => (
            <button
              key={email}
              type="button"
              onClick={() => setForm({ email, password: 'password123' })}
              className="w-full flex justify-between items-center text-xs text-slate-300 hover:text-white transition-colors py-0.5"
            >
              <span>{email}</span>
              <span className="text-slate-500">{role} · password123</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
