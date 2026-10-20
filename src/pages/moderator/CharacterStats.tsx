import { useEffect, useState } from 'react'
import { charactersApi } from '@/api'
import { MagicCard } from '@/components/ui'
import {
  Activity,
  ChevronRight,
  CircleGauge,
  Footprints,
  Heart,
  LoaderCircle,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  Zap,
} from 'lucide-react'
import type { Character, CharacterAttribute, CharacterMovement } from '@/types'
import { notify } from '@/lib/toast'

type CharacterTab = 'all' | 'vitals' | 'movement'
type NumericAttributeKey = 'startingValue' | 'maxValue' | 'regenRate' | 'regenDelay'

const attributeFields: { key: NumericAttributeKey; label: string; unit?: string }[] = [
  { key: 'startingValue', label: 'Starting Value' },
  { key: 'maxValue', label: 'Max Value' },
  { key: 'regenRate', label: 'Tốc độ hồi', unit: '/s' },
  { key: 'regenDelay', label: 'Độ trễ hồi', unit: 's' },
]

const movementGroups: {
  title: string
  description: string
  icon: typeof Footprints
  fields: { key: keyof CharacterMovement; label: string; unit: string }[]
}[] = [
  {
    title: 'Movement Settings',
    description: 'Cài đặt di chuyển',
    icon: Footprints,
    fields: [
      { key: 'moveSpeed', label: 'Move Speed', unit: 'm/s' },
      { key: 'sprintSpeed', label: 'Sprint Speed', unit: 'm/s' },
      { key: 'rotationSmoothingTime', label: 'Rotation Smoothing', unit: 's' },
      { key: 'speedChangeRate', label: 'Speed Change Rate', unit: '/s' },
      { key: 'forceDecayRate', label: 'Force Decay Rate', unit: '/s' },
    ],
  },
  {
    title: 'Gravity & Jump',
    description: 'Cài đặt trọng lực và nhảy',
    icon: Zap,
    fields: [
      { key: 'gravity', label: 'Gravity', unit: 'm/s²' },
      { key: 'jumpHeight', label: 'Jump Height', unit: 'm' },
      { key: 'groundedOffset', label: 'Grounded Offset', unit: 'm' },
      { key: 'groundedRadius', label: 'Grounded Radius', unit: 'm' },
      { key: 'slopeForce', label: 'Slope Force', unit: 'N' },
      { key: 'slopeForceRayLength', label: 'Slope Ray Length', unit: 'm' },
    ],
  },
]

function characterRole(character: Character) {
  if (character.role) return character.role
  return character.name.toLowerCase().includes('child') ? 'Child' : 'Dad'
}

function cloneCharacter(character: Character): Character {
  return structuredClone(character)
}

function NumericField({
  label,
  value,
  unit,
  onChange,
}: {
  label: string
  value: number | undefined
  unit?: string
  onChange: (value: number) => void
}) {
  if (value === undefined) return null

  return (
    <label className="grid grid-cols-[minmax(0,1fr)_minmax(100px,150px)] items-center gap-3 border-t border-white/[0.06] py-2.5 first:border-0">
      <span className="min-w-0 text-xs font-medium text-slate-300">{label}</span>
      <span className="relative flex items-center">
        <input
          type="number"
          step="any"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="h-9 w-full rounded-md border border-white/10 bg-[#080b12] px-3 pr-10 text-right font-mono text-xs text-white outline-none transition-colors focus:border-yellow-400/60"
        />
        {unit && <span className="pointer-events-none absolute right-2.5 text-[10px] text-slate-500">{unit}</span>}
      </span>
    </label>
  )
}

export default function CharacterStats() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [draft, setDraft] = useState<Character | null>(null)
  const [activeTab, setActiveTab] = useState<CharacterTab>('all')
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')
  const [detailRetry, setDetailRetry] = useState(0)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    charactersApi
      .getAll()
      .then((data) => {
        setCharacters(data)
        if (data.length > 0) {
          setSelectedId(data[0].id)
          setDraft(cloneCharacter(data[0]))
        }
      })
      .catch((loadError) => {
        console.error(loadError)
        setError('Không thể tải cấu hình nhân vật.')
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedId) return

    let isCurrentRequest = true
    setDetailLoading(true)
    setDetailError('')

    charactersApi
      .getById(selectedId)
      .then((character) => {
        if (isCurrentRequest) setDraft(cloneCharacter(character))
      })
      .catch((loadError) => {
        if (!isCurrentRequest) return
        console.error(loadError)
        setDetailError('Không thể tải chi tiết nhân vật từ API.')
      })
      .finally(() => {
        if (isCurrentRequest) setDetailLoading(false)
      })

    return () => {
      isCurrentRequest = false
    }
  }, [selectedId, detailRetry])

  const selectCharacter = (character: Character) => {
    setSelectedId(character.id)
    setDraft(cloneCharacter(character))
    setActiveTab('all')
  }

  const updateAttribute = (index: number, key: keyof CharacterAttribute, value: number) => {
    setDraft((current) => {
      if (!current?.attributes) return current
      const attributes = current.attributes.map((attribute, attributeIndex) =>
        attributeIndex === index ? { ...attribute, [key]: value } : attribute,
      )
      return { ...current, attributes }
    })
  }

  const updateMovement = (key: keyof CharacterMovement, value: number) => {
    setDraft((current) =>
      current ? { ...current, movement: { ...current.movement, [key]: value } } : current,
    )
  }

  const saveCharacter = async () => {
    if (!draft || saving || deleting) return

    setSaving(true)
    try {
      const { id, ...data } = draft
      const updated = await charactersApi.update(id, data)
      setCharacters((current) => current.map((character) => (character.id === id ? updated : character)))
      setDraft(cloneCharacter(updated))
      notify.success('Đã cập nhật cấu hình nhân vật.')
    } catch (saveError) {
      console.error(saveError)
      notify.error('Không thể cập nhật cấu hình nhân vật.')
    } finally {
      setSaving(false)
    }
  }

  const deleteCharacter = async () => {
    if (!draft || saving || deleting) return
    if (!window.confirm(`Bạn có chắc muốn xóa nhân vật "${draft.name}"?`)) return

    setDeleting(true)
    try {
      await charactersApi.delete(draft.id)
      const remainingCharacters = characters.filter((character) => character.id !== draft.id)
      setCharacters(remainingCharacters)
      const nextCharacter = remainingCharacters[0]
      setSelectedId(nextCharacter?.id ?? '')
      setDraft(nextCharacter ? cloneCharacter(nextCharacter) : null)
      notify.success('Đã xóa nhân vật.')
    } catch (deleteError) {
      console.error(deleteError)
      notify.error('Không thể xóa nhân vật.')
    } finally {
      setDeleting(false)
    }
  }

  const tabs: { id: CharacterTab; label: string; icon: typeof Activity }[] = [
    { id: 'all', label: 'Tất cả thông số', icon: Activity },
    { id: 'vitals', label: 'Chỉ số sinh tồn', icon: Heart },
    { id: 'movement', label: 'Di chuyển & Nhảy', icon: Footprints },
  ]

  if (loading) {
    return <div className="py-20 text-center text-sm text-slate-400">Đang tải dữ liệu nhân vật...</div>
  }

  if (error || characters.length === 0 || !draft) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-3 border border-white/10 bg-[#0b0e16] px-6 text-center">
        <UserRound className="h-8 w-8 text-slate-500" />
        <p className="text-sm text-slate-300">{error || 'Chưa có nhân vật nào trong hệ thống.'}</p>
      </div>
    )
  }

  const role = characterRole(draft)
  const filteredAttributes = activeTab === 'movement' ? [] : draft.attributes ?? []
  const showMovement = activeTab !== 'vitals'

  return (
    <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <div className="border-b border-white/10 pb-3">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Character Management</p>
          <h2 className="mt-1 text-sm font-semibold text-white">Nhân vật <span className="ml-1 font-mono text-slate-500">{String(characters.length).padStart(2, '0')}</span></h2>
        </div>

        <div className="space-y-2">
          {characters.map((character) => {
            const selected = character.id === selectedId
            const itemRole = characterRole(character)
            return (
              <button
                key={character.id}
                type="button"
                onClick={() => selectCharacter(character)}
                className={`flex min-h-14 w-full items-center gap-3 border px-3 text-left transition-colors ${
                  selected
                    ? 'border-yellow-400/50 bg-yellow-400/[0.07] text-white'
                    : 'border-white/[0.07] bg-[#0b0e15] text-slate-300 hover:border-white/20'
                }`}
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border font-mono text-xs font-bold ${itemRole === 'Dad' ? 'border-yellow-400/20 bg-yellow-400/10 text-yellow-300' : 'border-cyan-400/20 bg-cyan-400/10 text-cyan-300'}`}>
                  {itemRole === 'Dad' ? 'D' : 'C'}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold">{character.name}</span>
                  <span className="mt-0.5 block text-[10px] text-slate-500">{itemRole === 'Dad' ? 'Người cha' : 'Người con'}</span>
                </span>
                <ChevronRight className={`h-3.5 w-3.5 shrink-0 ${selected ? 'text-yellow-300' : 'text-slate-600'}`} />
              </button>
            )
          })}
        </div>

        <div className="relative min-h-[230px] overflow-hidden border border-white/10 bg-[#0b0e15]">
          <div className="absolute inset-0 bg-cover bg-center opacity-35" style={{ backgroundImage: "url('/banner_garden.jpg')" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080a10] via-[#080a10]/45 to-transparent" />
          <div className="relative flex min-h-[230px] flex-col justify-end p-4">
            <div className="mb-auto flex h-10 w-10 items-center justify-center border border-yellow-300/30 bg-[#11151d]/80 text-yellow-300">
              <UserRound className="h-5 w-5" />
            </div>
            <p className="font-mono text-[9px] tracking-widest text-slate-400">{draft.id}</p>
            <h3 className="mt-1 text-base font-bold text-white">{draft.name}</h3>
            <p className="text-[11px] text-slate-400">{role === 'Dad' ? 'Người cha' : 'Người con'}</p>
            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-[10px]">
              <span className="text-slate-400">Trạng thái</span>
              <span className={draft.isActive ? 'text-emerald-400' : 'text-slate-500'}>
                {draft.isActive ? '● Hoạt động' : '● Tạm khóa'}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px]">
              <span className="text-slate-400">Loại nhân vật</span>
              <span className="text-slate-200">{draft.physicsType || '—'}</span>
            </div>
          </div>
        </div>
      </aside>

      <section className="min-w-0">
        <MagicCard glowColor="indigo" intensity={3} interactive={false} className="p-6 mb-5">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[10px] text-slate-500">
                <span>Character Stats</span><ChevronRight className="h-3 w-3" /><span className="text-slate-300">{draft.name}</span>
              </div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Character Configuration</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">Chi tiết nhân vật.</h1>
              <p className="mt-1 text-xs text-slate-400">Thiết lập các chỉ số và khả năng di chuyển của nhân vật.</p>
              {detailLoading && <p role="status" className="mt-2 text-[10px] text-cyan-300">Đang tải chi tiết nhân vật...</p>}
              {detailError && (
                <p role="alert" className="mt-2 flex items-center gap-2 text-[10px] text-rose-300">
                  {detailError}
                  <button type="button" onClick={() => setDetailRetry((retry) => retry + 1)} className="underline underline-offset-2 hover:text-white">
                    Thử lại
                  </button>
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={saveCharacter} disabled={saving || deleting} className="inline-flex h-9 items-center gap-2 rounded-md bg-yellow-400 px-3 text-[11px] font-bold text-slate-950 transition-colors hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50">
                {saving ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
              <button type="button" onClick={deleteCharacter} disabled={saving || deleting} className="inline-flex h-9 items-center gap-2 rounded-md border border-rose-400/30 px-3 text-[11px] font-semibold text-rose-300 transition-colors hover:border-rose-400/60 hover:bg-rose-400/10 disabled:cursor-not-allowed disabled:opacity-50">
                {deleting ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                {deleting ? 'Đang xóa...' : 'Xóa nhân vật'}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 py-4">
            <div className="flex flex-wrap gap-1" role="tablist" aria-label="Nhóm cấu hình nhân vật">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === id}
                  onClick={() => setActiveTab(id)}
                  className={`inline-flex h-9 items-center gap-2 border-b-2 px-3 text-[11px] font-semibold transition-colors ${activeTab === id ? 'border-yellow-400 text-yellow-300' : 'border-transparent text-slate-500 hover:text-slate-200'}`}
                >
                  <Icon className="h-3.5 w-3.5" />{label}
                </button>
              ))}
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500"><ShieldCheck className="h-3.5 w-3.5" />{draft.primaryStatName || 'Cấu hình nhân vật'}</span>
          </div>
        </MagicCard>

        <div className="space-y-5 pt-5">
          {filteredAttributes.length > 0 && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xs font-bold text-white"><Heart className="h-3.5 w-3.5 text-rose-400" />Chỉ số sinh tồn</h2>
                <span className="text-[9px] text-slate-500">{filteredAttributes.length} thông số</span>
              </div>
              <div className="grid grid-cols-1 gap-3 2xl:grid-cols-2">
                {filteredAttributes.map((attribute, index) => (
                  <article key={`${attribute.statName}-${index}`} className="border border-white/[0.08] bg-[#0b0e15]">
                    <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-md border border-rose-400/15 bg-rose-400/[0.08] text-rose-300">
                        {attribute.statName.toLowerCase() === 'health' ? <Heart className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-xs font-bold text-slate-100">{attribute.statName}</h3>
                        <p className="text-[10px] text-slate-500">{attribute.statName === draft.primaryStatName ? 'Chỉ số chính của nhân vật' : 'Chỉ số của nhân vật'}</p>
                      </div>
                    </div>
                    <div className="px-4 py-1">
                      {attributeFields.map(({ key, label, unit }) => (
                        <NumericField key={key} label={label} value={attribute[key]} unit={unit} onChange={(value) => updateAttribute(index, key, value)} />
                      ))}
                      <NumericField label="Giá trị tối thiểu" value={attribute.minValue} onChange={(value) => updateAttribute(index, 'minValue', value)} />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeTab !== 'movement' && (draft.attributes?.length ?? 0) === 0 && (
            <div className="border border-dashed border-white/10 px-5 py-8 text-center text-xs text-slate-500">Nhân vật chưa có chỉ số sinh tồn.</div>
          )}

          {showMovement && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xs font-bold text-white"><Footprints className="h-3.5 w-3.5 text-cyan-300" />Di chuyển & Nhảy</h2>
                <span className="text-[9px] text-slate-500">{Object.values(draft.movement ?? {}).length} thông số</span>
              </div>
              {draft.movement && Object.keys(draft.movement).length > 0 ? (
                <div className="grid grid-cols-1 gap-3 2xl:grid-cols-2">
                  {movementGroups.map(({ title, description, icon: Icon, fields }) => {
                    const visibleFields = fields.filter(({ key }) => draft.movement?.[key] !== undefined)
                    if (visibleFields.length === 0) return null
                    return (
                      <article key={title} className="border border-white/[0.08] bg-[#0b0e15]">
                        <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-cyan-300/15 bg-cyan-300/[0.08] text-cyan-200"><Icon className="h-4 w-4" /></span>
                          <div>
                            <h3 className="text-xs font-bold text-slate-100">{title}</h3>
                            <p className="text-[10px] text-slate-500">{description}</p>
                          </div>
                        </div>
                        <div className="px-4 py-1">
                          {visibleFields.map(({ key, label, unit }) => (
                            <NumericField key={key} label={label} value={draft.movement?.[key]} unit={unit} onChange={(value) => updateMovement(key, value)} />
                          ))}
                        </div>
                      </article>
                    )
                  })}
                </div>
              ) : (
                <div className="border border-dashed border-white/10 px-5 py-8 text-center text-xs text-slate-500">API chưa trả về thông số di chuyển cho nhân vật này.</div>
              )}
            </section>
          )}

          {activeTab === 'all' && (draft.combatAbilities?.length ?? 0) > 0 && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xs font-bold text-white"><Sparkles className="h-3.5 w-3.5 text-yellow-300" />Combat Abilities</h2>
                <span className="text-[9px] text-slate-500">{draft.combatAbilities?.length} kỹ năng</span>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {draft.combatAbilities?.map((ability) => (
                  <article key={ability.name} className="flex items-start justify-between gap-4 border border-white/[0.08] bg-[#0b0e15] p-4">
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-white">{ability.name}</h3>
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-400">{ability.effect}</p>
                    </div>
                    <span className="shrink-0 rounded border border-yellow-300/15 bg-yellow-300/[0.06] px-2 py-1 font-mono text-[10px] text-yellow-200">{ability.cooldownSec}s</span>
                  </article>
                ))}
              </div>
            </section>
          )}

          <div className="flex items-center gap-2 border-t border-white/[0.07] pt-3 text-[10px] text-slate-500">
            <CircleGauge className="h-3.5 w-3.5" />Lưu thay đổi để cập nhật cấu hình trên máy chủ.
          </div>
        </div>
      </section>
    </div>
  )
}

