import { useEffect, useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { Modal } from '@/components/ui'
import type {
  Chapter,
  Quest,
  Character,
  CreateChapterRequest,
  UpdateChapterRequest,
  CreateQuestRequest,
  UpdateQuestRequest,
  CreateCharacterRequest,
  UpdateCharacterRequest,
  CharacterAttribute,
  CombatAbility,
  QuestObjective,
} from '@/types'

// ─── Shared dark form input classes ──────────────────────────────
const inputCls =
  'w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-xs text-white placeholder-slate-500'
const labelCls = 'block text-xs font-medium text-slate-300 mb-1'

// ─── Chapter Modal ──────────────────────────────────────────────

interface ChapterModalProps {
  isOpen: boolean
  onClose: () => void
  initial: Chapter | null
  onSubmit: (
    data: CreateChapterRequest | UpdateChapterRequest,
    isUpdate: boolean
  ) => Promise<void>
}

export function ChapterModal({
  isOpen,
  onClose,
  initial,
  onSubmit,
}: ChapterModalProps) {
  const [form, setForm] = useState<CreateChapterRequest>({
    name: '',
    theme: '',
    orderIndex: 1,
    description: '',
    backgroundAssetKey: '',
    cutscenes: [],
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (initial) {
        setForm({
          name: initial.name,
          theme: initial.theme,
          orderIndex: initial.orderIndex,
          description: initial.description,
          backgroundAssetKey: initial.backgroundAssetKey ?? '',
          cutscenes: initial.cutscenes ?? [],
        })
      } else {
        setForm({
          name: '',
          theme: '',
          orderIndex: 1,
          description: '',
          backgroundAssetKey: '',
          cutscenes: [],
        })
      }
    }
  }, [isOpen, initial])

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.theme.trim()) return
    setSubmitting(true)
    try {
      await onSubmit(form, !!initial)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initial ? 'Sửa Chapter' : 'Tạo Chapter mới'}
      size="lg"
    >
      <div className="space-y-4 text-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Tên Chapter *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputCls}
              placeholder="VD: The Whispering Forest"
            />
          </div>
          <div>
            <label className={labelCls}>Theme *</label>
            <input
              type="text"
              value={form.theme}
              onChange={(e) => setForm({ ...form, theme: e.target.value })}
              className={inputCls}
              placeholder="forest, cave, dream..."
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Thứ tự</label>
            <input
              type="number"
              value={form.orderIndex}
              onChange={(e) =>
                setForm({ ...form, orderIndex: Number(e.target.value) })
              }
              className={inputCls}
              min={1}
            />
          </div>
          <div>
            <label className={labelCls}>Background asset key</label>
            <input
              type="text"
              value={form.backgroundAssetKey}
              onChange={(e) =>
                setForm({ ...form, backgroundAssetKey: e.target.value })
              }
              className={inputCls}
              placeholder="bg_forest_dawn"
            />
          </div>
        </div>
        <div>
          <label className={labelCls}>Mô tả</label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            rows={3}
            className={inputCls}
            placeholder="Mô tả ngắn về chapter..."
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-medium"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              submitting || !form.name.trim() || !form.theme.trim()
            }
            className="px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-slate-950 text-xs font-bold disabled:opacity-50"
          >
            {submitting ? 'Đang lưu...' : initial ? 'Lưu thay đổi' : 'Tạo'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// ─── Quest Modal ────────────────────────────────────────────────

interface QuestModalProps {
  isOpen: boolean
  onClose: () => void
  initial: Quest | null
  chapters: Chapter[]
  defaultChapterId?: string
  onSubmit: (
    data: CreateQuestRequest | UpdateQuestRequest,
    isUpdate: boolean
  ) => Promise<void>
}

export function QuestModal({
  isOpen,
  onClose,
  initial,
  chapters,
  defaultChapterId,
  onSubmit,
}: QuestModalProps) {
  const [form, setForm] = useState<CreateQuestRequest>({
    chapterId: defaultChapterId || '',
    name: '',
    questType: 'Main',
    description: '',
    orderIndex: 1,
    objectives: [],
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (initial) {
        setForm({
          chapterId: initial.chapterId,
          name: initial.name,
          questType: initial.questType,
          description: initial.description,
          orderIndex: initial.orderIndex,
          objectives: initial.objectives ?? [],
        })
      } else {
        setForm({
          chapterId: defaultChapterId || chapters[0]?.id || '',
          name: '',
          questType: 'Main',
          description: '',
          orderIndex: 1,
          objectives: [],
        })
      }
    }
  }, [isOpen, initial, defaultChapterId, chapters])

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.chapterId) return
    setSubmitting(true)
    try {
      await onSubmit(form, !!initial)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  const addObjective = () =>
    setForm({
      ...form,
      objectives: [
        ...form.objectives,
        { description: '', targetCount: 1 },
      ],
    })
  const removeObjective = (i: number) =>
    setForm({
      ...form,
      objectives: form.objectives.filter((_, idx) => idx !== i),
    })
  const updateObjective = (i: number, patch: Partial<QuestObjective>) =>
    setForm({
      ...form,
      objectives: form.objectives.map((o, idx) =>
        idx === i ? { ...o, ...patch } : o
      ),
    })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initial ? 'Sửa Quest' : 'Tạo Quest mới'}
      size="lg"
    >
      <div className="space-y-4 text-slate-200 max-h-[70vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Chapter *</label>
            <select
              value={form.chapterId}
              onChange={(e) =>
                setForm({ ...form, chapterId: e.target.value })
              }
              className={inputCls}
              disabled={!!initial}
            >
              {chapters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Loại Quest</label>
            <select
              value={form.questType}
              onChange={(e) =>
                setForm({ ...form, questType: e.target.value })
              }
              className={inputCls}
            >
              <option value="Main">Main</option>
              <option value="Side">Side</option>
              <option value="Daily">Daily</option>
              <option value="Hidden">Hidden</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Tên Quest *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputCls}
              placeholder="VD: Find the lantern"
            />
          </div>
          <div>
            <label className={labelCls}>Thứ tự</label>
            <input
              type="number"
              value={form.orderIndex}
              onChange={(e) =>
                setForm({ ...form, orderIndex: Number(e.target.value) })
              }
              className={inputCls}
              min={1}
            />
          </div>
        </div>
        <div>
          <label className={labelCls}>Mô tả</label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            rows={2}
            className={inputCls}
          />
        </div>

        {/* Objectives */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={`${labelCls} mb-0`}>Mục tiêu</label>
            <button
              type="button"
              onClick={addObjective}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 text-[11px] font-bold"
            >
              <Plus className="w-3 h-3" /> Thêm
            </button>
          </div>
          {form.objectives.length === 0 && (
            <p className="text-[11px] text-slate-500 italic">
              Chưa có mục tiêu nào.
            </p>
          )}
          <div className="space-y-2">
            {form.objectives.map((o, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={o.description}
                  onChange={(e) =>
                    updateObjective(i, { description: e.target.value })
                  }
                  className={inputCls}
                  placeholder="Mô tả mục tiêu..."
                />
                <input
                  type="number"
                  value={o.targetCount}
                  onChange={(e) =>
                    updateObjective(i, {
                      targetCount: Number(e.target.value),
                    })
                  }
                  className={`${inputCls} w-20`}
                  min={1}
                />
                <button
                  type="button"
                  onClick={() => removeObjective(i)}
                  className="p-2 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                  title="Xóa"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-medium"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !form.name.trim() || !form.chapterId}
            className="px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-slate-950 text-xs font-bold disabled:opacity-50"
          >
            {submitting ? 'Đang lưu...' : initial ? 'Lưu thay đổi' : 'Tạo'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// ─── Character Modal ────────────────────────────────────────────

interface CharacterModalProps {
  isOpen: boolean
  onClose: () => void
  initial: Character | null
  onSubmit: (
    data: CreateCharacterRequest | UpdateCharacterRequest,
    isUpdate: boolean
  ) => Promise<void>
}

const defaultAttributes: CharacterAttribute[] = [
  {
    statName: 'Health',
    minValue: 0,
    maxValue: 100,
    startingValue: 100,
    regenRate: 0,
    regenDelay: 3,
    eventFlags: 3,
  },
]

export function CharacterModal({
  isOpen,
  onClose,
  initial,
  onSubmit,
}: CharacterModalProps) {
  const [form, setForm] = useState<CreateCharacterRequest>({
    name: '',
    physicsType: 'Platformer',
    primaryStatName: 'Health',
    attributes: defaultAttributes,
    combatAbilities: [],
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (initial) {
        setForm({
          name: initial.name,
          physicsType: initial.physicsType ?? 'Platformer',
          primaryStatName: initial.primaryStatName ?? 'Health',
          attributes: Array.isArray(initial.attributes)
            ? initial.attributes
            : defaultAttributes,
          combatAbilities: initial.combatAbilities ?? [],
        })
      } else {
        setForm({
          name: '',
          physicsType: 'Platformer',
          primaryStatName: 'Health',
          attributes: defaultAttributes,
          combatAbilities: [],
        })
      }
    }
  }, [isOpen, initial])

  const handleSubmit = async () => {
    if (!form.name.trim()) return
    setSubmitting(true)
    try {
      await onSubmit(form, !!initial)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  const addAttribute = () =>
    setForm({
      ...form,
      attributes: [
        ...form.attributes,
        {
          statName: '',
          minValue: 0,
          maxValue: 100,
          startingValue: 100,
          regenRate: 0,
          regenDelay: 3,
          eventFlags: 3,
        },
      ],
    })
  const removeAttribute = (i: number) =>
    setForm({
      ...form,
      attributes: form.attributes.filter((_, idx) => idx !== i),
    })
  const updateAttribute = (i: number, patch: Partial<CharacterAttribute>) =>
    setForm({
      ...form,
      attributes: form.attributes.map((a, idx) =>
        idx === i ? { ...a, ...patch } : a
      ),
    })

  const addAbility = () =>
    setForm({
      ...form,
      combatAbilities: [
        ...(form.combatAbilities ?? []),
        { name: '', effect: '', cooldownSec: 1 },
      ],
    })
  const removeAbility = (i: number) =>
    setForm({
      ...form,
      combatAbilities: (form.combatAbilities ?? []).filter(
        (_, idx) => idx !== i
      ),
    })
  const updateAbility = (i: number, patch: Partial<CombatAbility>) =>
    setForm({
      ...form,
      combatAbilities: (form.combatAbilities ?? []).map((a, idx) =>
        idx === i ? { ...a, ...patch } : a
      ),
    })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initial ? 'Sửa Character' : 'Tạo Character mới'}
      size="xl"
    >
      <div className="space-y-4 text-slate-200 max-h-[75vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Tên nhân vật *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputCls}
              placeholder="Dad / Child / Helper..."
            />
          </div>
          <div>
            <label className={labelCls}>Physics Type</label>
            <select
              value={form.physicsType}
              onChange={(e) =>
                setForm({ ...form, physicsType: e.target.value })
              }
              className={inputCls}
            >
              <option value="Platformer">Platformer</option>
              <option value="Shooter">Shooter</option>
              <option value="TopDown">TopDown</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Primary Stat</label>
            <input
              type="text"
              value={form.primaryStatName}
              onChange={(e) =>
                setForm({ ...form, primaryStatName: e.target.value })
              }
              className={inputCls}
              placeholder="Health"
            />
          </div>
        </div>

        {/* Attributes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-yellow-400 uppercase">
              Thuộc tính (Stats)
            </h4>
            <button
              type="button"
              onClick={addAttribute}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 text-[11px] font-bold"
            >
              <Plus className="w-3 h-3" /> Thêm stat
            </button>
          </div>
          <div className="space-y-3">
            {form.attributes.map((a, i) => (
              <div
                key={i}
                className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg space-y-2"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className={labelCls}>Stat name</label>
                    <input
                      type="text"
                      value={a.statName}
                      onChange={(e) =>
                        updateAttribute(i, { statName: e.target.value })
                      }
                      className={inputCls}
                      placeholder="Stamina"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Min</label>
                    <input
                      type="number"
                      value={a.minValue}
                      onChange={(e) =>
                        updateAttribute(i, {
                          minValue: Number(e.target.value),
                        })
                      }
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Max</label>
                    <input
                      type="number"
                      value={a.maxValue}
                      onChange={(e) =>
                        updateAttribute(i, {
                          maxValue: Number(e.target.value),
                        })
                      }
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Start</label>
                    <input
                      type="number"
                      value={a.startingValue}
                      onChange={(e) =>
                        updateAttribute(i, {
                          startingValue: Number(e.target.value),
                        })
                      }
                      className={inputCls}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 items-end">
                  <div>
                    <label className={labelCls}>Regen rate (/s)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={a.regenRate}
                      onChange={(e) =>
                        updateAttribute(i, {
                          regenRate: Number(e.target.value),
                        })
                      }
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Regen delay (s)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={a.regenDelay}
                      onChange={(e) =>
                        updateAttribute(i, {
                          regenDelay: Number(e.target.value),
                        })
                      }
                      className={inputCls}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttribute(i)}
                    className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Xóa stat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Combat abilities */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-yellow-400 uppercase">
              Combat abilities
            </h4>
            <button
              type="button"
              onClick={addAbility}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 text-[11px] font-bold"
            >
              <Plus className="w-3 h-3" /> Thêm ability
            </button>
          </div>
          {(form.combatAbilities ?? []).length === 0 && (
            <p className="text-[11px] text-slate-500 italic">
              Chưa có ability nào.
            </p>
          )}
          <div className="space-y-2">
            {(form.combatAbilities ?? []).map((ab, i) => (
              <div
                key={i}
                className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg grid grid-cols-1 sm:grid-cols-4 gap-2"
              >
                <input
                  type="text"
                  value={ab.name}
                  onChange={(e) =>
                    updateAbility(i, { name: e.target.value })
                  }
                  className={inputCls}
                  placeholder="Tên"
                />
                <input
                  type="text"
                  value={ab.effect}
                  onChange={(e) =>
                    updateAbility(i, { effect: e.target.value })
                  }
                  className={inputCls}
                  placeholder="Hiệu ứng"
                />
                <input
                  type="number"
                  step="0.1"
                  value={ab.cooldownSec}
                  onChange={(e) =>
                    updateAbility(i, {
                      cooldownSec: Number(e.target.value),
                    })
                  }
                  className={inputCls}
                  placeholder="Cooldown"
                />
                <button
                  type="button"
                  onClick={() => removeAbility(i)}
                  className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-medium"
                >
                  <X className="w-3.5 h-3.5" /> Xóa
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-medium"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !form.name.trim()}
            className="px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500 text-slate-950 text-xs font-bold disabled:opacity-50"
          >
            {submitting ? 'Đang lưu...' : initial ? 'Lưu thay đổi' : 'Tạo'}
          </button>
        </div>
      </div>
    </Modal>
  )
}