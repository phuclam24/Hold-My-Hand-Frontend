import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { chaptersApi, questsApi } from '@/api'
import { notify } from '@/lib/toast'
import type { Chapter, Quest } from '@/types'
import {
  ArrowLeft,
  BookOpen,
  CalendarClock,
  Check,
  Coins,
  LoaderCircle,
  ListChecks,
  Pencil,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'

type QuestFormData = Pick<Quest, 'name' | 'description' | 'questType' | 'orderIndex' | 'isActive'>

function formatDate(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('vi-VN')
}

export default function QuestDetail() {
  const { id = '' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [quest, setQuest] = useState<Quest | null>(null)
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const [editOpen, setEditOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState<QuestFormData | null>(null)

  useEffect(() => {
    let isCurrentRequest = true
    setLoading(true)
    setError('')

    Promise.all([questsApi.getById(id), chaptersApi.getAll().catch(() => [])])
      .then(([questData, chapters]) => {
        if (!isCurrentRequest) return
        setQuest(questData)
        setChapter(chapters.find((item) => item.id === questData.chapterId) ?? null)
      })
      .catch((loadError) => {
        console.error(loadError)
        if (isCurrentRequest) setError('Không thể tải chi tiết nhiệm vụ.')
      })
      .finally(() => {
        if (isCurrentRequest) setLoading(false)
      })

    return () => {
      isCurrentRequest = false
    }
  }, [id, retry])

  const openEdit = () => {
    if (!quest) return
    setForm({
      name: quest.name,
      description: quest.description,
      questType: quest.questType,
      orderIndex: quest.orderIndex,
      isActive: quest.isActive ?? true,
    })
    setEditOpen(true)
  }

  const saveQuest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!quest || !form || saving) return

    setSaving(true)
    try {
      const updated = await questsApi.update(quest.id, {
        ...form,
        name: form.name.trim(),
        description: form.description.trim(),
        questType: form.questType.trim(),
      })
      setQuest((current) => current ? { ...current, ...updated } : updated)
      setEditOpen(false)
      notify.success('Đã cập nhật nhiệm vụ.')
    } catch (saveError) {
      console.error(saveError)
      notify.error('Không thể cập nhật nhiệm vụ.')
    } finally {
      setSaving(false)
    }
  }

  const deleteQuest = async () => {
    if (!quest || deleting) return
    if (!window.confirm(`Bạn có chắc muốn xóa nhiệm vụ "${quest.name}"?`)) return

    setDeleting(true)
    try {
      await questsApi.delete(quest.id)
      notify.success('Đã xóa nhiệm vụ.')
      navigate('/moderator/quests')
    } catch (deleteError) {
      console.error(deleteError)
      notify.error('Không thể xóa nhiệm vụ.')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div role="status" className="py-20 text-center text-sm text-slate-400">
        <LoaderCircle className="mx-auto mb-3 h-5 w-5 animate-spin text-amber-300" />
        Đang tải chi tiết nhiệm vụ...
      </div>
    )
  }

  if (error || !quest) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-3 border border-white/10 bg-[#0b0e16] px-6 text-center">
        <p role="alert" className="text-sm text-slate-300">{error || 'Không tìm thấy nhiệm vụ.'}</p>
        <button
          type="button"
          onClick={() => setRetry((value) => value + 1)}
          className="rounded-md border border-white/10 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-amber-300/40"
        >
          Thử lại
        </button>
      </div>
    )
  }

  const objectives = quest.objectives ?? quest.goals ?? []
  const experienceReward = quest.expReward ?? quest.experienceReward ?? quest.rewards?.exp ?? quest.rewards?.experience
  const goldReward = quest.goldReward ?? quest.rewards?.gold

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <Link
        to="/moderator/quests"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" />Quay lại danh sách
      </Link>

      <section className="relative rounded-[20px] border border-slate-700/45 bg-[linear-gradient(145deg,rgba(18,26,41,0.98),rgba(12,17,28,0.98))] p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-400/25 bg-amber-400/[0.09] font-mono text-sm font-extrabold text-amber-300">
            #{quest.orderIndex}
          </span>
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
              <span className="rounded-full bg-amber-400 px-2.5 py-1 font-bold text-slate-950">{quest.questType}</span>
              <BookOpen className="h-3.5 w-3.5" />
              <span>{chapter?.name ?? 'Chapter không xác định'}</span>
            </div>
            <h1 className="break-words text-2xl font-extrabold text-white">{quest.name}</h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">{quest.description}</p>
          </div>
          <div className="flex shrink-0 gap-2 sm:absolute sm:right-5 sm:top-5">
            <button
              type="button"
              onClick={openEdit}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-[#0b1019] px-3 text-xs font-semibold text-slate-200 transition-colors hover:border-amber-300/40 hover:text-white"
            >
              <Pencil className="h-3.5 w-3.5" />Sửa
            </button>
            <button
              type="button"
              onClick={deleteQuest}
              disabled={deleting}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-rose-500 px-3 text-xs font-bold text-white transition-colors hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              Xóa
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_264px]">
        <section className="min-h-[300px] rounded-[20px] border border-slate-700/45 bg-[linear-gradient(145deg,rgba(18,26,41,0.98),rgba(12,17,28,0.98))] p-5 sm:p-6">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-extrabold text-slate-100">
            <ListChecks className="h-4 w-4 text-amber-400" />Mục tiêu
          </h2>
          {objectives.length > 0 ? (
            <ol className="space-y-2.5">
              {objectives
                .slice()
                .sort((first, second) => (first.orderIndex ?? 0) - (second.orderIndex ?? 0))
                .map((objective, index) => {
                  const text = objective.description || objective.name || objective.title || 'Mục tiêu'
                  return (
                    <li key={objective.id ?? `${text}-${index}`} className="flex items-start gap-2.5 rounded-2xl bg-white/[0.035] px-3 py-3 text-xs leading-relaxed text-slate-300">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400/10 font-mono text-[10px] font-bold text-amber-300">
                        {objective.orderIndex ?? index + 1}
                      </span>
                      <span className="pt-1">{text}</span>
                    </li>
                  )
                })}
            </ol>
          ) : (
            <p className="rounded-xl border border-dashed border-white/10 px-4 py-5 text-xs text-slate-500">
              API chưa trả về mục tiêu riêng cho nhiệm vụ này.
            </p>
          )}
        </section>

        <aside className="space-y-4">
          <section className="rounded-[20px] border border-slate-700/45 bg-[linear-gradient(145deg,rgba(18,26,41,0.98),rgba(12,17,28,0.98))] p-5">
            <h2 className="mb-4 text-sm font-extrabold text-slate-100">Phần thưởng</h2>
            {experienceReward !== undefined || goldReward !== undefined ? (
              <div className="grid grid-cols-2 gap-2.5">
                <div className="min-h-20 rounded-2xl bg-amber-400/[0.12] p-3">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <p className="mt-2 text-lg font-extrabold text-white">{experienceReward ?? '—'}</p>
                  <p className="text-[10px] text-slate-400">EXP</p>
                </div>
                <div className="min-h-20 rounded-2xl bg-amber-400/[0.12] p-3">
                  <Coins className="h-4 w-4 text-amber-400" />
                  <p className="mt-2 text-lg font-extrabold text-white">{goldReward ?? '—'}</p>
                  <p className="text-[10px] text-slate-400">Gold</p>
                </div>
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-white/10 px-3 py-4 text-xs text-slate-500">
                API chưa trả về thông tin phần thưởng.
              </p>
            )}
          </section>

          <section className="rounded-[20px] border border-slate-700/45 bg-[linear-gradient(145deg,rgba(18,26,41,0.98),rgba(12,17,28,0.98))] p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-extrabold text-slate-100">
              <CalendarClock className="h-4 w-4 text-amber-400" />Thông tin
            </h2>
            <dl className="space-y-2.5 text-xs">
              <div className="flex items-start justify-between gap-3">
                <dt className="shrink-0 text-slate-400">Mã quest</dt>
                <dd className="break-all text-right font-mono text-[10px] text-slate-200">{quest.slug ?? quest.id}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="shrink-0 text-slate-400">Ngày tạo</dt>
                <dd className="text-right text-slate-200">{formatDate(quest.createdAt)}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="shrink-0 text-slate-400">Cập nhật</dt>
                <dd className="text-right text-slate-200">{formatDate(quest.updatedAt)}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>

      {editOpen && form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
          <section role="dialog" aria-modal="true" aria-labelledby="edit-quest-title" className="my-auto w-full max-w-lg rounded-xl border border-white/10 bg-[#101621] shadow-2xl">
            <header className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
              <h2 id="edit-quest-title" className="text-base font-bold text-white">Sửa nhiệm vụ</h2>
              <button type="button" onClick={() => setEditOpen(false)} aria-label="Đóng" className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-white/[0.06] hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </header>
            <form onSubmit={saveQuest} className="space-y-4 p-5">
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-slate-300">Tên nhiệm vụ</span>
                <input required maxLength={120} value={form.name} onChange={(event) => setForm((current) => current ? { ...current, name: event.target.value } : current)} className="h-10 w-full rounded-md border border-white/10 bg-[#090d14] px-3 text-sm text-white outline-none focus:border-amber-400/60" />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-slate-300">Mô tả</span>
                <textarea required rows={3} maxLength={1000} value={form.description} onChange={(event) => setForm((current) => current ? { ...current, description: event.target.value } : current)} className="w-full resize-y rounded-md border border-white/10 bg-[#090d14] px-3 py-2.5 text-sm text-white outline-none focus:border-amber-400/60" />
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-300">Loại nhiệm vụ</span>
                  <input required maxLength={60} value={form.questType} onChange={(event) => setForm((current) => current ? { ...current, questType: event.target.value } : current)} className="h-10 w-full rounded-md border border-white/10 bg-[#090d14] px-3 text-sm text-white outline-none focus:border-amber-400/60" />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-300">Thứ tự</span>
                  <input required type="number" min={0} step={1} value={form.orderIndex} onChange={(event) => setForm((current) => current ? { ...current, orderIndex: Number(event.target.value) } : current)} className="h-10 w-full rounded-md border border-white/10 bg-[#090d14] px-3 text-sm text-white outline-none focus:border-amber-400/60" />
                </label>
              </div>
              <label className="flex items-center gap-2.5 text-xs font-medium text-slate-300">
                <input type="checkbox" checked={form.isActive ?? true} onChange={(event) => setForm((current) => current ? { ...current, isActive: event.target.checked } : current)} className="h-4 w-4 accent-amber-400" />
                Nhiệm vụ đang hoạt động
              </label>
              <div className="flex justify-end gap-2 border-t border-white/[0.08] pt-4">
                <button type="button" onClick={() => setEditOpen(false)} disabled={saving} className="h-9 rounded-md border border-white/10 px-3 text-xs font-semibold text-slate-300 hover:border-white/20 disabled:opacity-50">Hủy</button>
                <button type="submit" disabled={saving} className="inline-flex h-9 items-center gap-2 rounded-md bg-amber-400 px-3 text-xs font-bold text-slate-950 hover:bg-amber-300 disabled:opacity-50">
                  {saving ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}