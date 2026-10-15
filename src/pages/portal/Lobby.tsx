import { useState } from 'react'
import { useNotificationStore } from '@/stores'
import {
  ArrowRight,
  CircleHelp,
  Hash,
  Plus,
  ShieldCheck,
  UserRound,
  Users,
} from 'lucide-react'

export default function PortalLobby() {
  const [joinCode, setJoinCode] = useState('')
  const { addNotification } = useNotificationStore()

  const handleCreate = () => {
    addNotification({
      type: 'info',
      title: 'Lobby',
      message: 'Tính năng này sẽ kết nối với Unity Game Client. Mở game để tạo lobby.',
    })
  }

  const handleJoin = () => {
    if (!joinCode.trim()) {
      addNotification({ type: 'error', title: 'Lỗi', message: 'Nhập mã phòng' })
      return
    }
    addNotification({
      type: 'info',
      title: 'Lobby',
      message: `Mở game và nhập mã ${joinCode.toUpperCase()} để tham gia.`,
    })
  }

  return (
    <div className="space-y-8 pb-8 text-slate-100">
      <section className="flex min-h-[170px] flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <div className="mb-4 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-300">
            <span className="h-px w-5 bg-yellow-300" />
            Hành trình bắt đầu từ đây
          </div>
          <h1 className="text-5xl font-extrabold leading-none tracking-tight text-white sm:text-6xl">
            Sảnh chờ<span className="text-yellow-300">.</span>
          </h1>
          <p className="mt-4 max-w-md text-xs leading-6 text-slate-400 sm:text-sm">
            Những chặng đường đẹp nhất không đi một mình.
            <br className="hidden sm:block" /> Tạo phòng hoặc gặp người đồng hành của bạn.
          </p>
        </div>
        <div className="pb-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          <span className="text-yellow-300">01</span> / Hành trình mới
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2" aria-label="Tạo hoặc tham gia phòng">
        <article className="flex min-h-[310px] flex-col border border-white/[0.1] bg-[#0d1219]/95 p-5 shadow-xl shadow-black/20 sm:p-6">
          <div className="flex items-center justify-between">
            <span className="flex h-9 w-9 items-center justify-center border border-white/10 bg-white/[0.04] text-yellow-300">
              <Plus className="h-5 w-5" />
            </span>
            <span className="text-[9px] font-mono text-slate-500">01 / CREATE</span>
          </div>
          <div className="mt-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-500">Bắt đầu hành trình</p>
            <h2 className="mt-2 text-xl font-bold text-white">Tạo phòng mới</h2>
            <p className="mt-2 max-w-sm text-[11px] leading-5 text-slate-400">
              Mở đầu một hành trình mới và gửi lời mời đến người bạn muốn đồng hành.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-400">
            <UserRound className="h-3.5 w-3.5 text-slate-500" />
            <span>Vai trò của bạn</span><span className="text-slate-600">/</span><strong className="text-slate-200">Dad</strong>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5" />
            Chỉ bạn và người có mã phòng
          </div>
          <button
            type="button"
            onClick={handleCreate}
            className="mt-auto flex min-h-10 w-full items-center justify-between gap-3 bg-yellow-300 px-4 text-[11px] font-bold text-[#11151a] transition-colors hover:bg-yellow-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-200"
          >
            <span className="inline-flex items-center gap-2"><Plus className="h-4 w-4" />Tạo phòng</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </article>

        <article className="flex min-h-[310px] flex-col border border-white/[0.1] bg-[#0d1219]/95 p-5 shadow-xl shadow-black/20 sm:p-6">
          <div className="flex items-center justify-between">
            <span className="flex h-9 w-9 items-center justify-center border border-white/10 bg-white/[0.04] text-yellow-300">
              <Hash className="h-5 w-5" />
            </span>
            <span className="text-[9px] font-mono text-slate-500">02 / JOIN</span>
          </div>
          <div className="mt-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-500">Đã có lời mời?</p>
            <h2 className="mt-2 text-xl font-bold text-white">Tham gia phòng</h2>
            <p className="mt-2 max-w-sm text-[11px] leading-5 text-slate-400">
              Một người bạn đang chờ bạn ở phía bên kia. Nhập mã phòng để cùng bắt đầu.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-400">
            <UserRound className="h-3.5 w-3.5 text-slate-500" />
            <span>Vai trò của bạn</span><span className="text-slate-600">/</span><strong className="text-slate-200">Child</strong>
          </div>
          <div className="mt-4 grid gap-2">
            <label className="sr-only" htmlFor="join-code">Mã phòng</label>
            <input
              id="join-code"
              type="text"
              autoComplete="off"
              value={joinCode}
              onChange={(event) => setJoinCode(event.target.value.toUpperCase().slice(0, 6))}
              placeholder="NHẬP MÃ PHÒNG"
              maxLength={6}
              className="h-10 w-full border border-white/[0.12] bg-[#171c23] px-4 text-center font-mono text-xs tracking-[0.35em] text-white placeholder:text-[9px] placeholder:tracking-[0.22em] placeholder:text-slate-600 focus:border-yellow-300/60 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleJoin}
              disabled={joinCode.length < 6}
              className="flex h-10 w-full items-center justify-between border border-white/[0.06] bg-[#171c23] px-4 text-[10px] font-semibold text-slate-300 transition-colors hover:border-white/15 hover:text-white disabled:cursor-not-allowed disabled:text-slate-600"
            >
              <span className="inline-flex items-center gap-2"><Users className="h-3.5 w-3.5" />Tham gia phòng</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-3 text-center text-[9px] text-slate-600">Mã gồm 6 ký tự người tạo phòng đã chia sẻ</p>
        </article>
      </section>

      <section className="border-y border-white/[0.1] py-6">
        <h2 className="flex items-center gap-2 text-xs font-semibold text-slate-200">
          <CircleHelp className="h-4 w-4 text-yellow-300" />Sẵn sàng cho chuyến đi?
        </h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-3 sm:gap-8">
          <div className="flex gap-3">
            <span className="pt-0.5 font-mono text-[9px] font-bold text-yellow-300">01</span>
            <div><h3 className="text-[10px] font-bold text-slate-200">Kết nối với nhau</h3><p className="mt-1.5 text-[10px] leading-4 text-slate-500">Tạo phòng và chia sẻ mã, hoặc nhập mã từ người đồng hành.</p></div>
          </div>
          <div className="flex gap-3">
            <span className="pt-0.5 font-mono text-[9px] font-bold text-yellow-300">02</span>
            <div><h3 className="text-[10px] font-bold text-slate-200">Chọn vai trò của bạn</h3><p className="mt-1.5 text-[10px] leading-4 text-slate-500">Dad hoặc Child, cả hai có thể đổi vai trước khi bắt đầu.</p></div>
          </div>
          <div className="flex gap-3">
            <span className="pt-0.5 font-mono text-[9px] font-bold text-yellow-300">03</span>
            <div><h3 className="text-[10px] font-bold text-slate-200">Cùng nhau xuất phát</h3><p className="mt-1.5 text-[10px] leading-4 text-slate-500">Khi cả hai đã sẵn sàng, hành trình mới sẽ bắt đầu.</p></div>
          </div>
        </div>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-2 pb-2 text-[8px] font-semibold uppercase tracking-[0.16em] text-slate-600">
        <span>© 2026 Hold My Hand</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-yellow-300" />Bản xem trước giao diện</span>
      </footer>
    </div>
  )
}
