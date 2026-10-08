import { useEffect, useState } from 'react'
import { accountsApi } from '@/api'
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
    BAN: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    UNBAN: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    DELETE: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    CREATE: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    UPDATE: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  }

  const uniqueActions = [...new Set(logs.map((l) => l.action))]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Nhật ký hệ thống</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            {logs.length} audit log ghi nhận mọi hành động quản trị hệ thống
          </p>
        </div>
      </div>

      <div className="bg-[#111622]/90 border border-slate-800/80 rounded-xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800/60 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between bg-slate-900/40">
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-white text-sm">Lịch sử thao tác (Audit Log)</h3>
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
                className="pl-9 pr-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 w-full sm:w-60"
              />
            </div>
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value)
                setPage(1)
              }}
              className="px-3 py-1.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
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
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold tracking-wider text-[11px] uppercase bg-slate-900/40">
                <th className="px-6 py-3">Thời gian</th>
                <th className="px-6 py-3">Hành động</th>
                <th className="px-6 py-3">Loại đối tượng</th>
                <th className="px-6 py-3">Admin ID</th>
                <th className="px-6 py-3">Target ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Đang tải nhật ký...
                  </td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Chưa có nhật ký ghi nhận
                  </td>
                </tr>
              ) : (
                paged.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-3 text-slate-400 text-xs whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${
                          actionColors[log.action] || 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-white font-medium">{log.targetType}</td>
                    <td className="px-6 py-3">
                      <span className="font-mono text-xs text-slate-400">
                        {log.adminId.slice(-8)}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="font-mono text-xs text-amber-400/80">
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
          <div className="px-6 py-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <p>
              Trang {page} / {totalPages} • {filtered.length} kết quả
            </p>
            <div className="inline-flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
