import { useState, useEffect } from 'react'
import { Platform } from 'react-native'
import { getSession, getSessionAsync, type AuthSession } from './auth'

export type AuthUser = AuthSession['user'] | null

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (Platform.OS === 'web') {
      // Web: sync read from localStorage, then listen for cross-tab changes
      setSession(getSession())
      setLoading(false)
      function onStorage(e: StorageEvent) {
        if (e.key === 'tp_session') {
          setSession(e.newValue ? JSON.parse(e.newValue) : null)
        }
      }
      window.addEventListener('storage', onStorage)
      return () => window.removeEventListener('storage', onStorage)
    } else {
      // Native: async read from AsyncStorage
      getSessionAsync().then(s => {
        setSession(s)
        setLoading(false)
      })
    }
  }, [])

  function refresh() {
    getSessionAsync().then(setSession)
  }

  return { user: session?.user ?? null, session, loading, refresh }
}
