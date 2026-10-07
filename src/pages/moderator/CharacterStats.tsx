import { useEffect, useState } from 'react'
import { charactersApi } from '@/api'
import { Card } from '@/components/ui'
import { Gamepad2 } from 'lucide-react'
import type { Character } from '@/types'

export default function CharacterStats() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    charactersApi
      .getAll()
      .then(setCharacters)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Character Stats</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Quản lý nhân vật trong game (Unity đọc từ API này lúc runtime)
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Đang tải...</div>
      ) : characters.length === 0 ? (
        <Card className="p-12 text-center">
          <Gamepad2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Chưa có nhân vật nào</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map((c) => (
            <Card key={c.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{c.name}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      c.role === 'Dad'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-pink-100 text-pink-700'
                    }`}
                  >
                    {c.role}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                {c.isActive ? '🟢 Active' : '⚪ Inactive'}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
