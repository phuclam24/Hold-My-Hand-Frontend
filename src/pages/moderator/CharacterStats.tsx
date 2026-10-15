import { useEffect, useState } from 'react'
import {
  Gamepad2,
  Users,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  Zap,
  Heart,
} from 'lucide-react'
import { charactersApi } from '@/api'
import { notify } from '@/lib/toast'
import { CharacterModal } from '@/components/moderator/ModeratorModals'
import type { Character } from '@/types'

export default function CharacterStats() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Character | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Character | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await charactersApi.getAll()
      setCharacters(data)
    } catch (err) {
      console.error(err)
      notify.error('Không thể tải danh sách nhân vật')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleSubmit = async (payload: any, isUpdate: boolean) => {
    try {
      if (isUpdate && editing) {
        const updated = await charactersApi.update(editing.id, payload)
        setCharacters((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        )
        notify.success('Đã cập nhật nhân vật')
      } else {
        const created = await charactersApi.create(payload)
        setCharacters((prev) => [...prev, created])
        notify.success(`Đã tạo nhân vật "${created.name}"`)
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || 'Thao tác thất bại'
      notify.error(msg)
      throw err
    }
  }

  const handleDelete = async (c: Character) => {
    try {
      await charactersApi.delete(c.id)
      setCharacters((prev) => prev.filter((x) => x.id !== c.id))
      notify.success(`Đã xóa nhân vật "${c.name}"`)
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || 'Không thể xóa nhân vật'
      notify.error(msg)
    } finally {
      setConfirmDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Character Stats
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Quản lý nhân vật và stat runtime cho Unity
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold">
            <Users className="w-4 h-4 text-yellow-400" />
            <span>Tổng: {characters.length} nhân vật</span>
          </div>
          <button
            onClick={() => {
              setEditing(null)
              setModalOpen(true)
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-slate-950 text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            Thêm nhân vật
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm font-medium animate-pulse">
          Đang tải dữ liệu nhân vật...
        </div>
      ) : characters.length === 0 ? (
        <div className="p-12 text-center bg-[#0c1019] border border-white/10 rounded-2xl">
          <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">
            Chưa có nhân vật nào trong hệ thống
          </p>
          <button
            onClick={() => {
              setEditing(null)
              setModalOpen(true)
            }}
            className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-slate-950 text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            Tạo nhân vật đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {characters.map((c) => {
            const attrs = Array.isArray(c.attributes)
              ? c.attributes
              : []
            return (
              <div
                key={c.id}
                className="p-6 bg-[#0c1019] border border-white/10 hover:border-yellow-400/30 rounded-2xl transition-all duration-300 space-y-4 relative group"
              >
                <div className="absolute top-3 right-3 flex gap-1">
                  <button
                    onClick={() => {
                      setEditing(c)
                      setModalOpen(true)
                    }}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-yellow-400/20 text-slate-300 hover:text-yellow-400 transition-colors"
                    title="Sửa"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(c)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-bold text-lg">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      {c.name}
                    </h3>
                    <span
                      className={`inline-block mt-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold tracking-wide ${
                        c.role === 'Dad'
                          ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                          : c.role === 'Child'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-white/5 text-slate-300 border border-white/10'
                      }`}
                    >
                      {c.role || c.physicsType || 'Character'}
                    </span>
                  </div>
                </div>

                {/* Stats preview */}
                {attrs.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    {attrs.slice(0, 3).map((a, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-[11px]"
                      >
                        <span className="text-slate-400 flex items-center gap-1.5">
                          {a.statName?.toLowerCase().includes('health') ||
                          a.statName?.toLowerCase().includes('hp') ? (
                            <Heart className="w-3 h-3 text-rose-400" />
                          ) : (
                            <Zap className="w-3 h-3 text-yellow-400" />
                          )}
                          {a.statName}
                        </span>
                        <span className="font-mono text-slate-300">
                          {a.startingValue}/{a.maxValue}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <span>Trạng thái</span>
                  <span
                    className={`inline-flex items-center gap-1.5 font-semibold ${
                      c.isActive ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        c.isActive ? 'bg-emerald-400' : 'bg-slate-500'
                      }`}
                    />
                    {c.isActive ? 'Hoạt động' : 'Tạm khóa'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <CharacterModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={editing}
        onSubmit={handleSubmit}
      />

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setConfirmDelete(null)}
          />
          <div className="relative bg-[#0c1019] border border-white/10 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-rose-400 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-white text-base">
                  Xóa nhân vật "{confirmDelete.name}"?
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Hành động này không thể hoàn tác.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-medium"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Xóa vĩnh viễn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}