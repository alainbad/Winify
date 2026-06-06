import { Platform } from 'react-native'

const SUPABASE_URL = 'https://dwjghqslnrkcjhaoaneq.supabase.co'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3amdocXNsbnJrY2poYW9hbmVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NDM1NTgsImV4cCI6MjA5NjMxOTU1OH0.Q-q70ee0ViQpcPSTgRIe_-T6GorXrEo4uuc2dvb5UJE'
const SESSION_KEY = 'tp_session'

export type AuthSession = {
  access_token: string
  refresh_token: string
  user: { id: string; email: string; user_metadata: { full_name?: string }; created_at: string }
}

function headers(token?: string) {
  return {
    'Content-Type': 'application/json',
    apikey: ANON_KEY,
    Authorization: `Bearer ${token ?? ANON_KEY}`,
  }
}

// Storage abstraction: localStorage on web, AsyncStorage on native
const storage = {
  get: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      if (typeof localStorage === 'undefined') return null
      return localStorage.getItem(key)
    }
    const AS = require('@react-native-async-storage/async-storage').default
    return AS.getItem(key)
  },
  set: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      if (typeof localStorage === 'undefined') return
      localStorage.setItem(key, value)
      return
    }
    const AS = require('@react-native-async-storage/async-storage').default
    await AS.setItem(key, value)
  },
  remove: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      if (typeof localStorage === 'undefined') return
      localStorage.removeItem(key)
      return
    }
    const AS = require('@react-native-async-storage/async-storage').default
    await AS.removeItem(key)
  },
}

// Sync getter for web only (used in useAuth init)
export function getSession(): AuthSession | null {
  if (Platform.OS !== 'web') return null // native uses getSessionAsync
  if (typeof localStorage === 'undefined') return null
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null') } catch { return null }
}

export async function getSessionAsync(): Promise<AuthSession | null> {
  try {
    const raw = await storage.get(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

async function saveSession(s: AuthSession) {
  await storage.set(SESSION_KEY, JSON.stringify(s))
}

export async function clearSession() {
  await storage.remove(SESSION_KEY)
}

export async function signUp(email: string, password: string, fullName: string, phone?: string): Promise<{ session: AuthSession | null; error: string | null }> {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ email, password, data: { full_name: fullName, phone } }),
  })
  const data = await res.json()
  if (!res.ok) return { session: null, error: data.msg || data.error_description || 'Sign up failed' }
  if (data.access_token) {
    await saveSession(data as AuthSession)
    return { session: data as AuthSession, error: null }
  }
  return { session: null, error: null }
}

export async function signIn(email: string, password: string): Promise<{ session: AuthSession | null; error: string | null }> {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) return { session: null, error: data.error_description || data.msg || 'Incorrect email or password' }
  await saveSession(data as AuthSession)
  return { session: data as AuthSession, error: null }
}

export async function signOut() {
  const s = await getSessionAsync()
  if (s) {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, { method: 'POST', headers: headers(s.access_token) }).catch(() => {})
  }
  await clearSession()
}

export async function dbQuery(path: string, token: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { ...headers(token), Prefer: 'return=representation' },
  })
  return res.json()
}

export async function dbInsert(table: string, body: object, token: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { ...headers(token), Prefer: 'return=representation' },
    body: JSON.stringify(body),
  })
  return res.json()
}

export async function rpc(fnName: string, token?: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fnName}`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify({}),
  })
  return res.json()
}
