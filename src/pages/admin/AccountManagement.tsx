import { useEffect, useState } from 'react'
import { accountsApi } from '@/api'
import {
  Button,
  Modal,
} from '@/components/ui'
import { useNotificationStore } from '@/stores'
import { formatDate } from '@/utils'
import {
  Search,
  Ban,
  CheckCircle,
  Trash2,
  X,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react'
import type { Account } from '@/types'

export default function AccountManagement() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [actionModal, setActionModal] = useState<'ban' | 'unban' | 'delete' | 'create' | null>(null)
  const [banReason, setBanReason] = useState('')
  const [createForm, setCreateForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Player' as 'Admin' | 'Moderator' | 'Player',
  })
  const { addNotification } = useNotificationStore()

  const loadAccounts = async () => {
    setLoading(true)
    try {
      const data = await accountsApi.getAll()
      setAccounts(data)
    } catch (error) {
      addNotification({ type: 'error', title: 'Lỗi', message: 'Không thể tải danh sách tài khoản' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAccounts()
  }, [])

  // Filter
  const filtered = accounts.filter((a) => {
    const matchesSearch =
      !search ||
      a.username.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = !roleFilter || a.role === roleFilter
    return matchesSearch && matchesRole
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  const handleCreate = async () => {
    try {
      const created = await accountsApi.create(createForm)
      addNotification({
        type: 'success',
        title: 'Tạo thành công',
        message: `Đã tạo tài khoản ${created.username}`,
      })
      // Reload danh sách + reset form + đóng modal
      await loadAccounts()
      setCreateForm({ username: '', email: '', password: '', role: 'Player' })
      setActionModal(null)
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Lỗi',
        message: err.response?.data?.message || 'Không thể tạo tài khoản',
      })
    }
  }

  const handleBan = async () => {
    if (!selectedAccount) return
    try {
      await accountsApi.ban(selectedAccount.id, { reason: banReason })
      addNotification({
        type: 'success',
        title: 'Đã khóa',
        message: `Tài khoản ${selectedAccount.username} đã bị khóa`,
      })
      await loadAccounts()
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Lỗi',
        message: err.response?.data?.message || 'Không thể khóa tài khoản',
      })
    }
    setActionModal(null)
    setSelectedAccount(null)
    setBanReason('')
  }

  const handleUnban = async () => {
    if (!selectedAccount) return
    try {
      await accountsApi.unban(selectedAccount.id)
      addNotification({
        type: 'success',
        title: 'Đã mở khóa',
        message: `Tài khoản ${selectedAccount.username} đã được mở khóa`,
      })
      await loadAccounts()
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Lỗi',
        message: err.response?.data?.message || 'Không thể mở khóa',
      })
    }
    setActionModal(null)
    setSelectedAccount(null)
  }

  const handleDelete = async () => {
    if (!selectedAccount) return
    try {
      await accountsApi.delete(selectedAccount.id)
      addNotification({
        type: 'success',
        title: 'Đã xóa',
        message: `Đã xóa tài khoản ${selectedAccount.username}`,
      })
      await loadAccounts()
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Lỗi',
        message: err.response?.data?.message || 'Không thể xóa',
      })
    }
    setActionModal(null)
    setSelectedAccount(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Quản lý người chơi</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            {accounts.length} tài khoản người dùng trong hệ thống
          </p>
        </div>
        <Button
          onClick={() => setActionModal('create')}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20 border-none self-start sm:self-center"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Tạo tài khoản
        </Button>
      </div>

      <div className="bg-[#111622]/90 border border-slate-800/80 rounded-xl shadow-xl overflow-hidden">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-slate-800/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-900/40">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Tìm theo username, email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="w-full pl-10 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value)
              setPage(1)
            }}
            className="px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          >
            <option value="">Tất cả vai trò</option>
            <option value="Admin">Admin</option>
            <option value="Moderator">Moderator</option>
            <option value="Player">Player</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold tracking-wider text-[11px] uppercase bg-slate-900/40">
                <th className="py-3 px-6">Tài khoản</th>
                <th className="py-3 px-6">Vai trò</th>
                <th className="py-3 px-6">Trạng thái</th>
                <th className="py-3 px-6">Lần đăng nhập cuối</th>
                <th className="py-3 px-6 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Đang tải danh sách...
                  </td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Không tìm thấy tài khoản phù hợp
                  </td>
                </tr>
              ) : (
                paged.map((account) => (
                  <tr key={account.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                          {account.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {account.username}
                            {account.displayName && (
                              <span className="text-slate-400 font-normal ml-1">
                                ({account.displayName})
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-slate-400">{account.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-medium">
                        {account.role}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          account.isBanned
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : account.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            account.isBanned
                              ? 'bg-rose-400'
                              : account.isActive
                              ? 'bg-emerald-400'
                              : 'bg-slate-500'
                          }`}
                        />
                        {account.isBanned ? 'Bị khóa' : account.isActive ? 'Hoạt động' : 'Chưa kích hoạt'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-400 text-xs">
                      {account.lastLoginAt ? formatDate(account.lastLoginAt) : '—'}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="inline-flex gap-1">
                        {account.isBanned ? (
                          <button
                            onClick={() => {
                              setSelectedAccount(account)
                              setActionModal('unban')
                            }}
                            className="p-1.5 hover:bg-emerald-500/20 rounded-lg text-emerald-400 transition-colors"
                            title="Mở khóa"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedAccount(account)
                              setBanReason('')
                              setActionModal('ban')
                            }}
                            className="p-1.5 hover:bg-amber-500/20 rounded-lg text-amber-400 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Khóa tài khoản"
                            disabled={account.role === 'Admin'}
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedAccount(account)
                            setActionModal('delete')
                          }}
                          className="p-1.5 hover:bg-rose-500/20 rounded-lg text-rose-400 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                          title="Xóa vĩnh viễn"
                          disabled={account.role === 'Admin'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

      {/* Action Modal */}
      <Modal
        isOpen={actionModal === 'ban' || actionModal === 'unban' || actionModal === 'delete'}
        onClose={() => {
          setActionModal(null)
          setSelectedAccount(null)
        }}
        title={
          actionModal === 'ban'
            ? 'Khóa tài khoản'
            : actionModal === 'unban'
            ? 'Mở khóa tài khoản'
            : 'Xóa tài khoản'
        }
      >
        <div className="space-y-4 text-slate-200">
          {actionModal === 'ban' && (
            <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200">
                Tài khoản sẽ bị khóa và session đang hoạt động sẽ bị kick ngay lập tức.
              </p>
            </div>
          )}
          <p className="text-sm">
            Bạn có chắc chắn muốn{' '}
            <strong className="text-amber-400">
              {actionModal === 'ban'
                ? 'khóa'
                : actionModal === 'unban'
                ? 'mở khóa'
                : 'xóa vĩnh viễn'}
            </strong>{' '}
            tài khoản <strong className="text-white">{selectedAccount?.username}</strong>?
          </p>
          {actionModal === 'ban' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Lý do khóa <span className="text-rose-400">*</span>
              </label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                rows={3}
                placeholder="Nhập lý do khóa tài khoản..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-xs text-white"
              />
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                setActionModal(null)
                setSelectedAccount(null)
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Hủy
            </Button>
            <Button
              className={
                actionModal === 'ban'
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : actionModal === 'delete'
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }
              onClick={
                actionModal === 'ban'
                  ? handleBan
                  : actionModal === 'unban'
                  ? handleUnban
                  : handleDelete
              }
              disabled={actionModal === 'ban' && !banReason.trim()}
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create Modal */}
      <Modal
        isOpen={actionModal === 'create'}
        onClose={() => setActionModal(null)}
        title="Tạo tài khoản mới"
        size="lg"
      >
        <div className="space-y-4 text-slate-200">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Username</label>
            <input
              type="text"
              value={createForm.username}
              onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-xs text-white"
              placeholder="username"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={createForm.email}
              onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-xs text-white"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Mật khẩu</label>
            <input
              type="password"
              value={createForm.password}
              onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-xs text-white"
              placeholder="••••••"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Vai trò</label>
            <select
              value={createForm.role}
              onChange={(e) =>
                setCreateForm({ ...createForm, role: e.target.value as 'Admin' | 'Moderator' | 'Player' })
              }
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-xs text-white"
            >
              <option value="Player">Player</option>
              <option value="Moderator">Moderator</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setActionModal(null)}>
              Hủy
            </Button>
            <Button
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
              onClick={handleCreate}
              disabled={!createForm.username || !createForm.email || !createForm.password}
            >
              Tạo tài khoản
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
