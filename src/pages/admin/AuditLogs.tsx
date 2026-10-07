import { useEffect, useState } from 'react'
import { accountsApi } from '@/api'
import { Card } from '@/components/ui'
import { Search, FileText, ChevronLeft, ChevronRight } from 'lucide-react'
import type { ModActionLog } from '@/types'

export default function AuditLogs() {
  const [logs, setLogs] = useState<ModActionLog[]>([])
  const [loading, setLoading] = useState(true)
  const [actionFilter, setActionFilter] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 20

  useEffect(() => {
    accountsApi
      .getLogs()
      .then((data) => setLogs(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = logs.filter((l) => {
    const matchesAction = !actionFilter || l.action === actionFilter
    const matchesSearch = !search || l.adminId.toLowerCase().includes(search.toLowerCase())
    return matchesAction && matchesSearch
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  const actionColors: Record<string, string> = {
    BAN: 'bg-rose-100 text-rose-700',
    UNBAN: 'bg-emerald-100 text-emerald-700',
    DELETE: 'bg-rose-100 text-rose-700',
    CREATE: 'bg-emerald-100 text-emerald-700',
    UPDATE: 'bg-amber-100 text-amber-700',
  }

  const uniqueActions = [...new Set(logs.map((l) => l.action))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Logs</h1>
          <p className="text-slate-500 mt-1 text-sm">
            {logs.length} audit logs gần nhất — theo dõi mọi hành động admin/mod
          </p>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-slate-900">Audit Trail</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Tìm theo Admin ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white w-full sm:w-64"
              />
            </div>
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value)
                setPage(1)
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Tất cả hành động</option>
              {uniqueActions.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Hành động
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">
                  Target ID
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Đang tải...
                  </td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Không có log nào
                  </td>
                </tr>
              ) : (
                paged.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 text-slate-700 text-xs whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          actionColors[log.action] || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-700">{log.targetType}</td>
                    <td className="px-6 py-3">
                      <span className="font-mono text-xs text-slate-600">
                        {log.adminId.slice(-8)}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="font-mono text-xs text-slate-400">
                        {log.targetId.slice(-12)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between text-sm">
            <p className="text-slate-500">
              Trang {page} / {totalPages} • {filtered.length} kết quả
            </p>
            <div className="inline-flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
