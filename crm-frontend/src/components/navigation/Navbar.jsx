import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, LogOut, ChevronDown, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Badge from '../ui/Badge'

const PAGE_TITLES = {
  '/dashboard':  'Dashboard',
  '/customers':  'Customers',
  '/deals':      'Deals',
  '/activities': 'Activities',
}

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const { pathname }     = useLocation()
  const [dropOpen, setDropOpen] = useState(false)

  const title = PAGE_TITLES[pathname] ?? 'CRM'

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 gap-4 sticky top-0 z-20">
      {/* Hamburger (mobile) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Page title */}
      <h1 className="flex-1 text-lg font-semibold text-gray-800">{title}</h1>

      {/* User dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropOpen((v) => !v)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-gray-800 leading-tight">{user?.name}</p>
            <p className="text-xs text-gray-400 leading-tight">{user?.email}</p>
          </div>
          <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
        </button>

        {dropOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setDropOpen(false)} />
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg z-20 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
                <div className="mt-2">
                  <Badge label={user?.role} />
                </div>
              </div>
              <div className="p-1">
                <button
                  onClick={() => { setDropOpen(false); logout() }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={15} />
                  Sign out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
