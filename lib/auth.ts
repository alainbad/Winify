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

export function getSession(): AuthSession | null {
  if (typeof localStorage === 'undefined') return null
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null') } catch { return null }
}

function saveSession(s: AuthSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(s))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export async function signUp(email: string, password: string, fullName: string): Promise<{ session: AuthSession | null; error: string | null }> {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ email, password, data: { full_name: fullName } }),
  })
  const data = await res.json()
  if (!res.ok) return { session: null, error: data.msg || data.error_description || 'Sign up failed' }
  if (data.access_token) {
    saveSession(data as AuthSession)
    return { session: data as AuthSession, error: null }
  }
  // Email confirmation required
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
  saveSession(data as AuthSession)
  return { session: data as AuthSession, error: null }
}

export async function signOut() {
  const s = getSession()
  if (s) {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, { method: 'POST', headers: headers(s.access_token) }).catch(() => {})
  }
  clearSession()
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
