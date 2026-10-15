import { useEffect, useState } from 'react'
import { BookOpen, Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react'
import { modChaptersApi } from '@/api'
import { notify } from '@/lib/toast'
import { ChapterModal } from '@/components/moderator/ModeratorModals'
import type { Chapter } from '@/types'

export default function ChapterManagement() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Chapter | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Chapter | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await modChaptersApi.getAll()
      setChapters(data)
    } catch (err) {
      console.error(err)
      notify.error('Không thể tải danh sách chapter')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleSubmit = async (
    data: any,
    isUpdate: boolean
  ): Promise<void> => {
    try {
      if (isUpdate && editing) {
        const updated = await modChaptersApi.update(editing.id, data)
        setChapters((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        )
        notify.success('Đã cập nhật chapter')
      } else {
        const created = await modChaptersApi.create(data)
        setChapters((prev) => [...prev, created])
        notify.success(`Đã tạo chapter "${created.name}"`)
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || 'Thao tác thất bại'
      notify.error(msg)
      throw err
    }
  }

  const handleDelete = async (chapter: Chapter) => {
    try {
      await modChaptersApi.delete(chapter.id)
      setChapters((prev) => prev.filter((c) => c.id !== chapter.id))
      notify.success(`Đã xóa chapter "${chapter.name}"`)
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || 'Không thể xóa chapter'
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
            Chapters
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Quản lý các chapter trong hành trình game
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold">
            <BookOpen className="w-4 h-4 text-yellow-400" />
            <span>Tổng: {chapters.length} chương</span>
          </div>
          <button
            onClick={() => {
              setEditing(null)
              setModalOpen(true)
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-slate-950 text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            Thêm chapter
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm font-medium animate-pulse">
          Đang tải dữ liệu chapter...
        </div>
      ) : chapters.length === 0 ? (
        <div className="p-12 text-center bg-[#0c1019] border border-white/10 rounded-2xl">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Chưa có chapter nào</p>
          <button
            onClick={() => {
              setEditing(null)
              setModalOpen(true)
            }}
            className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-slate-950 text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            Tạo chapter đầu tiên
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {chapters
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((chapter) => (
              <div
                key={chapter.id}
                className="p-6 bg-[#0c1019] border border-white/10 hover:border-yellow-400/30 rounded-2xl transition-all duration-300 flex items-start sm:items-center gap-5 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-amber-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-extrabold text-xl flex-shrink-0 font-mono">
                  {chapter.orderIndex}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {chapter.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {chapter.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 font-semibold tracking-wide">
                      Theme: {chapter.theme}
                    </span>
                    {chapter.backgroundAssetKey && (
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-mono">
                        {chapter.backgroundAssetKey}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                  <button
                    onClick={() => {
                      setEditing(chapter)
                      setModalOpen(true)
                    }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-yellow-400/20 text-slate-300 hover:text-yellow-400 transition-colors"
                    title="Sửa"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(chapter)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Form modal */}
      <ChapterModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={editing}
        onSubmit={handleSubmit}
      />

      {/* Delete confirm */}
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
                  Xóa chapter "{confirmDelete.name}"?
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Hành động này không thể hoàn tác. Toàn bộ quest trong
                  chapter cũng sẽ bị ảnh hưởng.
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