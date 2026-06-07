import { useState, useEffect } from 'react'
import { Platform, AppState } from 'react-native'
import { getSession, getSessionAsync, type AuthSession } from './auth'

export type AuthUser = AuthSession['user'] | null

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Web: sync read, then listen for same-tab and cross-tab changes
      setSession(getSession())
      setLoading(false)
      function onStorage(e: StorageEvent) {
        if (e.key === 'tp_session') {
          setSession(e.newValue ? JSON.parse(e.newValue) : null)
        }
      }
      window.addEventListener('storage', onStorage)
      // Re-read on tab focus (handles navigate-back-after-login)
      function onFocus() { setSession(getSession()) }
      window.addEventListener('focus', onFocus)
      return () => {
        window.removeEventListener('storage', onStorage)
        window.removeEventListener('focus', onFocus)
      }
    } else {
      // Native: async read, re-read when app comes to foreground
      getSessionAsync().then(s => { setSession(s); setLoading(false) })
      const sub = AppState.addEventListener('change', state => {
        if (state === 'active') getSessionAsync().then(setSession)
      })
      return () => sub.remove()
    }
  }, [])

  function refresh() {
    getSessionAsync().then(setSession)
  }

  return { user: session?.user ?? null, session, loading, refresh }
}
