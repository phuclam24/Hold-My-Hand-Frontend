import { useEffect, useState } from 'react'
import {
  ScrollText,
  Layers,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
} from 'lucide-react'
import { modChaptersApi, questsApi } from '@/api'
import { notify } from '@/lib/toast'
import { QuestModal } from '@/components/moderator/ModeratorModals'
import type { Chapter, Quest } from '@/types'

export default function QuestManagement() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [quests, setQuests] = useState<Quest[]>([])
  const [selectedChapter, setSelectedChapter] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Quest | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Quest | null>(null)

  useEffect(() => {
    modChaptersApi
      .getAll()
      .then((data) => {
        setChapters(data)
        if (data.length > 0) setSelectedChapter(data[0].id)
      })
      .catch(() => notify.error('Không thể tải chapters'))
  }, [])

  useEffect(() => {
    if (!selectedChapter) return
    setLoading(true)
    questsApi
      .getByChapter(selectedChapter)
      .then(setQuests)
      .catch(() => notify.error('Không thể tải quest'))
      .finally(() => setLoading(false))
  }, [selectedChapter])

  const handleSubmit = async (payload: any, isUpdate: boolean) => {
    try {
      if (isUpdate && editing) {
        const updated = await questsApi.update(editing.id, payload)
        setQuests((prev) =>
          prev.map((q) => (q.id === updated.id ? updated : q))
        )
        notify.success('Đã cập nhật quest')
      } else {
        const created = await questsApi.create(payload)
        if (created.chapterId === selectedChapter) {
          setQuests((prev) => [...prev, created])
        }
        notify.success(`Đã tạo quest "${created.name}"`)
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || 'Thao tác thất bại'
      notify.error(msg)
      throw err
    }
  }

  const handleDelete = async (quest: Quest) => {
    try {
      await questsApi.delete(quest.id)
      setQuests((prev) => prev.filter((q) => q.id !== quest.id))
      notify.success(`Đã xóa quest "${quest.name}"`)
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || 'Không thể xóa quest'
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
            Quests
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Quản lý nhiệm vụ và mục tiêu khám phá
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-[#0c1019] border border-white/10 rounded-xl px-3.5 py-2">
            <Layers className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">
              Chapter:
            </span>
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id} className="bg-[#0c1019] text-white">
                  {ch.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => {
              if (!selectedChapter) {
                notify.warning('Vui lòng tạo chapter trước')
                return
              }
              setEditing(null)
              setModalOpen(true)
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-slate-950 text-xs font-bold disabled:opacity-50"
            disabled={!selectedChapter}
          >
            <Plus className="w-4 h-4" />
            Thêm quest
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm font-medium animate-pulse">
          Đang tải quest...
        </div>
      ) : quests.length === 0 ? (
        <div className="p-12 text-center bg-[#0c1019] border border-white/10 rounded-2xl">
          <ScrollText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">
            Chưa có quest nào trong chapter này
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quests
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((quest) => (
              <div
                key={quest.id}
                className="p-6 bg-[#0c1019] border border-white/10 hover:border-yellow-400/30 rounded-2xl transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 font-mono text-sm font-extrabold flex-shrink-0">
                    #{quest.orderIndex}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-base">
                      {quest.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {quest.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-block text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-semibold">
                        Loại: {quest.questType}
                      </span>
                      {quest.objectives && quest.objectives.length > 0 && (
                        <span className="inline-block text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-semibold">
                          {quest.objectives.length} mục tiêu
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        setEditing(quest)
                        setModalOpen(true)
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-yellow-400/20 text-slate-300 hover:text-yellow-400 transition-colors"
                      title="Sửa"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(quest)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      <QuestModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={editing}
        chapters={chapters}
        defaultChapterId={selectedChapter}
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
                  Xóa quest "{confirmDelete.name}"?
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