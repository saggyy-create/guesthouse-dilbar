import { useEffect, useMemo, useState } from 'react'
import { storageKeys, loadJson, saveJson } from '../utils/storage'

const PIN_HASH = 'b4882fd477ddb7145d8fc6ef8c750a5be8fb15c5310fe631278f93a2ade06444'

const sha256Hex = async (text) => {
  const enc = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest('SHA-256', enc)
  const bytes = Array.from(new Uint8Array(buf))
  return bytes.map((b) => b.toString(16).padStart(2, '0')).join('')
}

const AdminGate = ({ children }) => {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [unlocked, setUnlocked] = useState(false)

  useEffect(() => {
    const sess = loadJson(storageKeys.adminSession, null)
    if (sess?.ok && typeof sess?.ts === 'number') {
      // Session valid for 12 hours.
      const age = Date.now() - sess.ts
      if (age < 12 * 60 * 60 * 1000) setUnlocked(true)
    }
  }, [])

  const canSubmit = useMemo(() => pin.trim().length >= 4, [pin])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const hash = await sha256Hex(pin.trim())
      if (hash !== PIN_HASH) {
        setError('Неверный PIN')
        return
      }
      saveJson(storageKeys.adminSession, { ok: true, ts: Date.now() })
      setUnlocked(true)
    } catch {
      setError('Не удалось проверить PIN')
    }
  }

  const onLogout = () => {
    saveJson(storageKeys.adminSession, { ok: false, ts: Date.now() })
    setUnlocked(false)
    setPin('')
  }

  if (unlocked) {
    return (
      <div className="relative">
        <div className="absolute right-4 top-4 z-20">
          <button type="button" className="btn-secondary py-2 px-4" onClick={onLogout}>
            Выйти из админки
          </button>
        </div>
        {children}
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <h3 className="text-2xl font-display font-bold text-gray-900 mb-2">Админка календаря</h3>
      <p className="text-gray-600 font-body mb-6">
        Введите PIN, чтобы редактировать занятость. Данные сохраняются в этом браузере.
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors font-body"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="PIN"
          inputMode="numeric"
          autoComplete="off"
        />
        {error && <div className="text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 font-body">{error}</div>}
        <button className="btn-primary w-full" disabled={!canSubmit} type="submit">
          Войти
        </button>
      </form>
    </div>
  )
}

export default AdminGate
