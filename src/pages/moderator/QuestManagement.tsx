import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { chaptersApi, questsApi } from '@/api'
import {
  Check,
  ChevronDown,
  Layers,
  LoaderCircle,
  MoreVertical,
  Pencil,
  Plus,
  ScrollText,
  Trash2,
  X,
} from 'lucide-react'
import { notify } from '@/lib/toast'
import type { Chapter, Quest } from '@/types'

type QuestFormData = Omit<Quest, 'id'>

function createEmptyQuest(chapterId: string, orderIndex: number): QuestFormData {
  return {
    name: '',
    description: '',
    questType: 'Main',
    orderIndex,
    chapterId,
    isActive: true,
  }
}

export default function QuestManagement() {
  const navigate = useNavigate()
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [quests, setQuests] = useState<Quest[]>([])
  const [selectedChapter, setSelectedChapter] = useState('')
  const [chaptersLoading, setChaptersLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [pageError, setPageError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingQuestId, setEditingQuestId] = useState<string | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [form, setForm] = useState<QuestFormData>(() => createEmptyQuest('', 1))

  useEffect(() => {
    let isCurrentRequest = true

    chaptersApi
      .getAll()
      .then((data) => {
        if (!isCurrentRequest) return
        setChapters(data)
        setSelectedChapter(data[0]?.id ?? '')
      })
      .catch((error) => {
        console.error(error)
        if (isCurrentRequest) setPageError('Không thể tải danh sách chapter.')
      })
      .finally(() => {
        if (isCurrentRequest) setChaptersLoading(false)
      })

    return () => {
      isCurrentRequest = false
    }
  }, [])

  useEffect(() => {
    if (!selectedChapter) {
      setQuests([])
      setLoading(false)
      return
    }

    let isCurrentRequest = true
    setLoading(true)
    setPageError('')
    questsApi
      .getByChapter(selectedChapter)
      .then((data) => {
        if (isCurrentRequest) setQuests(data)
      })
      .catch((error) => {
        console.error(error)
        if (isCurrentRequest) setPageError('Không thể tải danh sách quest.')
      })
      .finally(() => {
        if (isCurrentRequest) setLoading(false)
      })

    return () => {
      isCurrentRequest = false
    }
  }, [selectedChapter])

  const openCreateModal = () => {
    const nextOrder = quests.reduce((highest, quest) => Math.max(highest, quest.orderIndex), 0) + 1
    setEditingQuestId(null)
    setForm(createEmptyQuest(selectedChapter, nextOrder))
    setModalOpen(true)
  }

  const openEditModal = (quest: Quest) => {
    setEditingQuestId(quest.id)
    setForm({
      name: quest.name,
      description: quest.description,
      questType: quest.questType,
      orderIndex: quest.orderIndex,
      chapterId: quest.chapterId,
      isActive: quest.isActive ?? true,
    })
    setOpenMenuId(null)
    setModalOpen(true)
  }

  const closeModal = () => {
    if (saving) return
    setModalOpen(false)
    setEditingQuestId(null)
  }

  const saveQuest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (saving) return

    const payload: QuestFormData = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
      questType: form.questType.trim(),
      orderIndex: Number(form.orderIndex),
      chapterId: selectedChapter,
    }

    setSaving(true)
    try {
      if (editingQuestId) {
        const updated = await questsApi.update(editingQuestId, payload)
        setQuests((current) => current.map((quest) => (quest.id === updated.id ? updated : quest)))
        notify.success('Đã cập nhật quest.')
      } else {
        const created = await questsApi.create(payload)
        setQuests((current) => [...current, created])
        notify.success('Đã tạo quest mới.')
      }
      setModalOpen(false)
      setEditingQuestId(null)
    } catch (error) {
      console.error(error)
      notify.error('Không thể lưu quest.')
    } finally {
      setSaving(false)
    }
  }

  const deleteQuest = async (quest: Quest) => {
    setOpenMenuId(null)
    if (!window.confirm(`Bạn có chắc muốn xóa quest "${quest.name}"?`)) return

    setDeletingId(quest.id)
    try {
      await questsApi.delete(quest.id)
      setQuests((current) => current.filter((item) => item.id !== quest.id))
      notify.success('Đã xóa quest.')
    } catch (error) {
      console.error(error)
      notify.error('Không thể xóa quest.')
    } finally {
      setDeletingId(null)
    }
  }

  const selectedChapterName = chapters.find((chapter) => chapter.id === selectedChapter)?.name
  const sortedQuests = [...quests].sort((first, second) => first.orderIndex - second.orderIndex)

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header className="flex flex-col gap-5 border-b border-white/[0.08] pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">Quests</h1>
          <p className="mt-1 text-sm text-slate-400">Danh sách quest trong game</p>
        </div>

        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <label className="flex h-10 items-center gap-2 rounded-full border border-white/[0.08] bg-[#0c1019] px-3.5">
            <Layers className="h-3.5 w-3.5 shrink-0 text-amber-400" />
            <span className="shrink-0 text-xs font-semibold text-slate-400">Chapter:</span>
            <span className="relative min-w-0">
              <select
                aria-label="Chọn chapter"
                value={selectedChapter}
                onChange={(event) => setSelectedChapter(event.target.value)}
                disabled={chaptersLoading || chapters.length === 0}
                className="max-w-[220px] appearance-none truncate bg-transparent py-2 pr-5 text-xs font-bold text-white outline-none disabled:opacity-50"
              >
                {chapters.map((chapter) => (
                  <option key={chapter.id} value={chapter.id} className="bg-[#0c1019] text-white">
                    {chapter.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
            </span>
          </label>
          <button
            type="button"
            onClick={openCreateModal}
            disabled={!selectedChapter || chaptersLoading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-amber-400 px-4 text-xs font-bold text-slate-950 shadow-[0_4px_18px_rgba(251,191,36,0.18)] transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />Tạo quest mới
          </button>
        </div>
      </header>

      {pageError && <p role="alert" className="text-sm text-rose-300">{pageError}</p>}

      {chaptersLoading || loading ? (
        <div role="status" className="py-16 text-center text-sm text-slate-400">
          <LoaderCircle className="mx-auto mb-3 h-5 w-5 animate-spin text-amber-300" />
          Đang tải quest...
        </div>
      ) : !selectedChapter ? (
        <div className="flex min-h-44 flex-col items-center justify-center border border-dashed border-white/10 bg-[#0c1019]/70 px-6 text-center">
          <Layers className="mb-3 h-8 w-8 text-slate-600" />
          <p className="text-sm font-semibold text-slate-300">Chưa có chapter</p>
          <p className="mt-1 text-xs text-slate-500">Tạo chapter trước khi thêm quest.</p>
        </div>
      ) : sortedQuests.length === 0 ? (
        <div className="flex min-h-44 flex-col items-center justify-center border border-dashed border-white/10 bg-[#0c1019]/70 px-6 text-center">
          <ScrollText className="mb-3 h-8 w-8 text-slate-600" />
          <p className="text-sm font-semibold text-slate-300">Chưa có quest trong chapter này</p>
          <p className="mt-1 text-xs text-slate-500">Tạo quest mới để bắt đầu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {sortedQuests.map((quest) => (
            <article
              key={quest.id}
              role="link"
              tabIndex={0}
              aria-label={`Xem chi tiết nhiệm vụ ${quest.name}`}
              onClick={() => navigate(`/moderator/quests/${quest.id}`)}
              onKeyDown={(event) => {
                if (event.target === event.currentTarget && (event.key === 'Enter' || event.key === ' ')) {
                  event.preventDefault()
                  navigate(`/moderator/quests/${quest.id}`)
                }
              }}
              className="relative flex min-h-[186px] cursor-pointer items-start gap-3 rounded-[20px] border border-slate-700/45 bg-[linear-gradient(145deg,rgba(18,26,41,0.98),rgba(12,17,28,0.98))] p-5 shadow-[0_14px_36px_rgba(0,0,0,0.12)] outline-none transition-colors hover:border-amber-300/25 focus-visible:ring-2 focus-visible:ring-amber-400/60"
            >
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-amber-400/25 bg-amber-400/[0.09] font-mono text-xs font-extrabold text-amber-300">
                #{quest.orderIndex}
              </span>
              <div className="min-w-0 flex-1 pt-11">
                <h2 className="text-sm font-extrabold text-slate-100">{quest.name}</h2>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{quest.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="inline-flex rounded-full border border-white/[0.07] bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold text-slate-300">
                    Loại: {quest.questType}
                  </span>
                  {quest.isActive === false && (
                    <span className="inline-flex rounded-full border border-slate-600/50 bg-slate-800/60 px-2.5 py-1 text-[10px] font-semibold text-slate-400">
                      Tạm khóa
                    </span>
                  )}
                </div>
              </div>

              <div className="absolute right-3 top-3">
                <button
                  type="button"
                  aria-label={`Thao tác với quest ${quest.name}`}
                  aria-expanded={openMenuId === quest.id}
                  onClick={(event) => {
                    event.stopPropagation()
                    setOpenMenuId((current) => current === quest.id ? null : quest.id)
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
                {openMenuId === quest.id && (
                  <div
                    onClick={(event) => event.stopPropagation()}
                    className="absolute right-0 top-9 z-20 w-36 overflow-hidden rounded-lg border border-white/10 bg-[#111722] p-1 shadow-xl"
                  >
                    <button
                      type="button"
                      onClick={() => openEditModal(quest)}
                      className="flex h-9 w-full items-center gap-2 rounded px-2 text-left text-xs font-semibold text-slate-200 transition-colors hover:bg-white/[0.06]"
                    >
                      <Pencil className="h-3.5 w-3.5" />Chỉnh sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteQuest(quest)}
                      disabled={deletingId === quest.id}
                      className="flex h-9 w-full items-center gap-2 rounded px-2 text-left text-xs font-semibold text-rose-300 transition-colors hover:bg-rose-400/10 disabled:opacity-50"
                    >
                      {deletingId === quest.id ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      Xóa quest
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal()
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="quest-dialog-title"
            className="my-auto w-full max-w-lg rounded-xl border border-white/10 bg-[#101621] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
              <div>
                <h2 id="quest-dialog-title" className="text-base font-bold text-white">
                  {editingQuestId ? 'Chỉnh sửa quest' : 'Tạo quest mới'}
                </h2>
                <p className="mt-1 text-xs text-slate-500">{selectedChapterName}</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Đóng biểu mẫu"
                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-white/[0.06] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={saveQuest} className="space-y-4 p-5">
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-slate-300">Tên quest</span>
                <input
                  autoFocus
                  required
                  maxLength={120}
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className="h-10 w-full rounded-md border border-white/10 bg-[#090d14] px-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-amber-400/60"
                  placeholder="Nhập tên quest"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-slate-300">Mô tả</span>
                <textarea
                  required
                  rows={3}
                  maxLength={1000}
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  className="w-full resize-y rounded-md border border-white/10 bg-[#090d14] px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-amber-400/60"
                  placeholder="Mô tả mục tiêu quest"
                />
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-300">Loại quest</span>
                  <input
                    required
                    maxLength={60}
                    value={form.questType}
                    onChange={(event) => setForm((current) => ({ ...current, questType: event.target.value }))}
                    className="h-10 w-full rounded-md border border-white/10 bg-[#090d14] px-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-amber-400/60"
                    placeholder="Main"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-300">Thứ tự</span>
                  <input
                    required
                    type="number"
                    min={0}
                    step={1}
                    value={form.orderIndex}
                    onChange={(event) => setForm((current) => ({ ...current, orderIndex: Number(event.target.value) }))}
                    className="h-10 w-full rounded-md border border-white/10 bg-[#090d14] px-3 text-sm text-white outline-none transition-colors focus:border-amber-400/60"
                  />
                </label>
              </div>
              <label className="flex items-center gap-2.5 pt-1 text-xs font-medium text-slate-300">
                <input
                  type="checkbox"
                  checked={form.isActive ?? true}
                  onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
                  className="h-4 w-4 accent-amber-400"
                />
                Quest đang hoạt động
              </label>
              <div className="flex justify-end gap-2 border-t border-white/[0.08] pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="h-9 rounded-md border border-white/10 px-3 text-xs font-semibold text-slate-300 transition-colors hover:border-white/20 hover:text-white disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-9 items-center gap-2 rounded-md bg-amber-400 px-3 text-xs font-bold text-slate-950 transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                  {saving ? 'Đang lưu...' : editingQuestId ? 'Lưu thay đổi' : 'Tạo quest'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

