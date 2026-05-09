import { useEffect, useState } from 'react'
import { Users, Briefcase, Activity, TrendingUp } from 'lucide-react'
import { StatCard } from '../../components/ui/Card'
import { customerService } from '../../services/customerService'
import { dealService } from '../../services/dealService'
import { activityService } from '../../services/activityService'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'
import { useAuth } from '../../context/AuthContext'

function useCount(fetcher) {
  const [count, setCount] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetcher({ page: 0, size: 1 })
      .then((res) => setCount(res?.totalElements ?? 0))
      .catch(() => setCount('—'))
      .finally(() => setLoading(false))
  }, [])

  return { count: loading ? null : count, loading }
}

export default function DashboardPage() {
  const { user } = useAuth()

  const customers  = useCount(customerService.getAll)
  const deals      = useCount(dealService.getAll)
  const activities = useCount(activityService.getAll)

  // Recent data
  const [recentCustomers,  setRecentCustomers]  = useState([])
  const [recentDeals,      setRecentDeals]      = useState([])
  const [loadingRecent,    setLoadingRecent]    = useState(true)

  useEffect(() => {
    Promise.all([
      customerService.getAll({ page: 0, size: 5, sort: 'createdAt,desc' }),
      dealService.getAll({ page: 0, size: 5, sort: 'createdAt,desc' }),
    ])
      .then(([c, d]) => {
        setRecentCustomers(c?.content ?? [])
        setRecentDeals(d?.content ?? [])
      })
      .finally(() => setLoadingRecent(false))
  }, [])

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-xl font-bold">Good day, {user?.name?.split(' ')[0]}! 👋</h2>
        <p className="text-primary-200 text-sm mt-1">Here's what's happening in your CRM today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard
          icon={<Users size={22} />}
          label="Total Customers"
          value={customers.count}
          color="primary"
        />
        <StatCard
          icon={<Briefcase size={22} />}
          label="Total Deals"
          value={deals.count}
          color="amber"
        />
        <StatCard
          icon={<Activity size={22} />}
          label="Total Activities"
          value={activities.count}
          color="green"
        />
      </div>

      {/* Recent tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Recent Customers */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="section-title text-base">Recent Customers</h3>
            <Users size={16} className="text-gray-400" />
          </div>
          {loadingRecent ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : recentCustomers.length === 0 ? (
            <p className="text-center py-8 text-sm text-gray-400">No customers yet.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {recentCustomers.map((c) => (
                <li key={c.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.company ?? c.email}</p>
                  </div>
                  <Badge label={c.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Deals */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="section-title text-base">Recent Deals</h3>
            <TrendingUp size={16} className="text-gray-400" />
          </div>
          {loadingRecent ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : recentDeals.length === 0 ? (
            <p className="text-center py-8 text-sm text-gray-400">No deals yet.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {recentDeals.map((d) => (
                <li key={d.id} className="flex items-center justify-between px-5 py-3">
                  <div className="min-w-0 mr-3">
                    <p className="text-sm font-medium text-gray-800 truncate">{d.title}</p>
                    <p className="text-xs text-gray-400">{d.customerName}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-semibold text-gray-700">
                      ${Number(d.value).toLocaleString()}
                    </span>
                    <Badge label={d.stage} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
