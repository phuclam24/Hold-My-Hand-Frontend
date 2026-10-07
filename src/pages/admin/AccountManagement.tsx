import { useEffect, useState } from 'react'
import { accountsApi } from '@/api'
import {
  Card,
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý User</h1>
          <p className="text-slate-500 mt-1 text-sm">{accounts.length} tài khoản trong hệ thống</p>
        </div>
        <Button onClick={() => setActionModal('create')} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <UserPlus className="w-4 h-4 mr-2" />
          Tạo tài khoản
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
              className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value)
              setPage(1)
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Tất cả vai trò</option>
            <option value="Admin">Admin</option>
            <option value="Moderator">Moderator</option>
            <option value="Player">Player</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Tài khoản
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Last login
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Hành động
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
                    Không có tài khoản nào
                  </td>
                </tr>
              ) : (
                paged.map((account) => (
                  <tr key={account.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {account.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {account.username}
                            {account.displayName && (
                              <span className="text-slate-500 font-normal ml-1.5">
                                ({account.displayName})
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-500">{account.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          account.role === 'Admin'
                            ? 'bg-rose-100 text-rose-700'
                            : account.role === 'Moderator'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-indigo-100 text-indigo-700'
                        }`}
                      >
                        {account.role}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                          account.isBanned
                            ? 'bg-rose-100 text-rose-700'
                            : account.isActive
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            account.isBanned
                              ? 'bg-rose-500'
                              : account.isActive
                              ? 'bg-emerald-500'
                              : 'bg-slate-400'
                          }`}
                        />
                        {account.isBanned ? 'Banned' : account.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-500 text-xs">
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
                            className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors"
                            title="Unban"
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
                            className="p-2 hover:bg-amber-50 rounded-lg text-amber-600 transition-colors"
                            title="Ban"
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
                          className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors"
                          title="Delete"
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
        <div className="space-y-4">
          {actionModal === 'ban' && (
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                Tài khoản sẽ bị khóa và session đang hoạt động sẽ bị kick ngay lập tức.
              </p>
            </div>
          )}
          <p className="text-slate-700">
            Bạn có chắc chắn muốn{' '}
            <strong>
              {actionModal === 'ban'
                ? 'khóa'
                : actionModal === 'unban'
                ? 'mở khóa'
                : 'xóa vĩnh viễn'}
            </strong>{' '}
            tài khoản <strong>{selectedAccount?.username}</strong>?
          </p>
          {actionModal === 'ban' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Lý do khóa <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                rows={3}
                placeholder="Nhập lý do khóa tài khoản..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
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
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input
              type="text"
              value={createForm.username}
              onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={createForm.email}
              onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              value={createForm.password}
              onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Vai trò</label>
            <select
              value={createForm.role}
              onChange={(e) =>
                setCreateForm({ ...createForm, role: e.target.value as 'Admin' | 'Moderator' | 'Player' })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
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
