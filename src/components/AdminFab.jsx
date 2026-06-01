import { useEffect, useState } from 'react'
import { storageKeys, loadJson } from '../utils/storage'

// Hidden entry: double-press "D" within 500ms.
// After admin login it also shows a small "Admin" button.
const AdminFab = () => {
  const [armed, setArmed] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const sess = loadJson(storageKeys.adminSession, null)
    if (sess?.ok) setShow(true)
  }, [])

  useEffect(() => {
    let timer = null
    const onKeyDown = (e) => {
      if (e.key.toLowerCase() !== 'd') return
      if (!armed) {
        setArmed(true)
        timer = setTimeout(() => setArmed(false), 500)
        return
      }
      setArmed(false)
      setShow(true)
      window.location.assign('/#/admin')
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      if (timer) clearTimeout(timer)
    }
  }, [armed])

  if (!show) return null

  return (
    <a
      href="/#/admin"
      className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-4 py-3 rounded-full shadow-xl hover:bg-gray-800 transition-colors font-sans"
      title="Админка"
    >
      Admin
    </a>
  )
}

export default AdminFab
