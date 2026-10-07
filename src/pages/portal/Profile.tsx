import { useEffect, useState } from 'react'
import { profileApi } from '@/api'
import { Card, Button } from '@/components/ui'
import { useNotificationStore } from '@/stores'
import { Save, Lock, User as UserIcon, Camera } from 'lucide-react'
import type { ProfileResponse } from '@/types'

export default function PortalProfile() {
  const [profile, setProfile] = useState<ProfileResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    displayName: '',
    avatarUrl: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const { addNotification } = useNotificationStore()

  useEffect(() => {
    profileApi
      .getProfile()
      .then((data) => {
        setProfile(data)
        setForm((f) => ({
          ...f,
          displayName: data.displayName || '',
          avatarUrl: data.avatarUrl || '',
        }))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      addNotification({ type: 'error', title: 'Lỗi', message: 'Mật khẩu xác nhận không khớp' })
      return
    }

    setSaving(true)
    try {
      const updated = await profileApi.updateProfile({
        displayName: form.displayName,
        avatarUrl: form.avatarUrl,
        currentPassword: form.currentPassword || undefined,
        newPassword: form.newPassword || undefined,
      })
      setProfile(updated)
      setForm((f) => ({ ...f, currentPassword: '', newPassword: '', confirmPassword: '' }))
      addNotification({ type: 'success', title: 'Thành công', message: 'Đã cập nhật hồ sơ' })
    } catch (err: any) {
      addNotification({
        type: 'error',
        title: 'Lỗi',
        message: err.response?.data?.message || 'Không thể cập nhật',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading || !profile) {
    return (
      <div className="text-center py-12 text-purple-200">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500/20 via-purple-600/20 to-indigo-500/20 backdrop-blur-xl border border-white/10 p-8">
        <div className="flex items-start gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-2xl">
              {(profile.displayName || profile.username).charAt(0).toUpperCase()}
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">
              {profile.displayName || profile.username}
            </h1>
            <p className="text-purple-200">@{profile.username}</p>
            <div className="flex gap-2 mt-3">
              <span className="text-xs px-2.5 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-200 font-medium">
                {profile.role}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-purple-200">
                Tham gia {new Date(profile.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal info */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-5">
            <UserIcon className="w-5 h-5 text-pink-400" />
            Thông tin cá nhân
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-1.5">
                Tên hiển thị
              </label>
              <input
                type="text"
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
                placeholder="Tên của bạn"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-1.5">
                Avatar URL
              </label>
              <input
                type="url"
                value={form.avatarUrl}
                onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-1.5">Email</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-purple-300 cursor-not-allowed"
              />
            </div>
          </div>
        </Card>

        {/* Password */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10 p-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-5">
            <Lock className="w-5 h-5 text-purple-400" />
            Đổi mật khẩu
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-1.5">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
                placeholder="••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-1.5">
                Mật khẩu mới
              </label>
              <input
                type="password"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
                placeholder="••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-1.5">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
                placeholder="••••••"
              />
            </div>
            <p className="text-xs text-purple-300">
              Để trống nếu không muốn đổi mật khẩu
            </p>
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          isLoading={saving}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          Lưu thay đổi
        </Button>
      </div>
    </div>
  )
}
