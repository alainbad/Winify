import { useState, useEffect } from 'react'
import { getSession, clearSession, type AuthSession } from './auth'

export type AuthUser = AuthSession['user'] | null

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setSession(getSession())
    setLoading(false)

    // Listen for session changes from other tabs or sign-out
    function onStorage(e: StorageEvent) {
      if (e.key === 'tp_session') {
        setSession(e.newValue ? JSON.parse(e.newValue) : null)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  function refresh() {
    setSession(getSession())
  }

  return { user: session?.user ?? null, session, loading, refresh }
}
