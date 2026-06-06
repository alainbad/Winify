import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native'
import { Colors } from '@/constants/theme'
import { signUp, signIn, signOut, dbQuery } from '@/lib/auth'
import { useAuth } from '@/lib/useAuth'

function AuthForm({ onSuccess }: { onSuccess: () => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: any) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim()
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    const name = mode === 'signup' ? (form.elements.namedItem('name') as HTMLInputElement)?.value.trim() ?? '' : ''

    setError('')
    setSuccess('')
    if (!email || !password) { setError('Please enter your email and password.'); return }
    if (mode === 'signup' && password.length < 6) { setError('Password must be at least 6 characters.'); return }

    setLoading(true)
    if (mode === 'signup') {
      const { session, error } = await signUp(email, password, name)
      if (error) setError(error)
      else if (session) onSuccess()
      else setSuccess('Account created! Check your email to confirm, then sign in.')
    } else {
      const { session, error } = await signIn(email, password)
      if (error) setError(error)
      else if (session) onSuccess()
    }
    setLoading(false)
  }

  const css = `
    .auth-wrap { display:flex; align-items:center; justify-content:center; min-height:80vh; background:#F9FAFB; padding:24px; }
    .auth-card { width:100%; max-width:400px; background:#fff; border:1px solid #E5E7EB; border-radius:16px; padding:28px; }
    .auth-logo { font-size:15px; font-weight:900; color:#7C3AED; margin-bottom:20px; }
    .auth-heading { font-size:22px; font-weight:800; color:#111827; margin-bottom:4px; }
    .auth-sub { font-size:13px; color:#6B7280; margin-bottom:22px; }
    .auth-field { margin-bottom:14px; }
    .auth-label { display:block; font-size:11px; font-weight:700; color:#6B7280; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.3px; }
    .auth-input { width:100%; box-sizing:border-box; border:1px solid #E5E7EB; border-radius:8px; padding:11px 12px; font-size:14px; color:#111827; background:#FAFAFA; outline:none; font-family:inherit; }
    .auth-input:focus { border-color:#7C3AED; background:#fff; }
    .auth-btn { width:100%; background:#7C3AED; color:#fff; border:none; border-radius:10px; padding:13px; font-size:14px; font-weight:800; cursor:pointer; margin-top:6px; margin-bottom:16px; font-family:inherit; }
    .auth-btn:hover { background:#6D28D9; }
    .auth-btn:disabled { opacity:0.6; cursor:not-allowed; }
    .auth-switch { font-size:13px; color:#6B7280; text-align:center; cursor:pointer; background:none; border:none; font-family:inherit; width:100%; }
    .auth-switch span { color:#7C3AED; font-weight:700; }
    .auth-error { background:#FEF2F2; border:1px solid #FECACA; border-radius:8px; padding:10px; margin-bottom:12px; font-size:12px; color:#DC2626; }
    .auth-success { background:#F0FDF4; border:1px solid #BBF7D0; border-radius:8px; padding:10px; margin-bottom:12px; font-size:12px; color:#16A34A; }
  `

  return (
    <View style={{ flex: 1 }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-logo">● Tick Pick</div>
          <div className="auth-heading">{mode === 'login' ? 'Welcome back' : 'Create account'}</div>
          <div className="auth-sub">{mode === 'login' ? 'Sign in to track your entries' : 'Join to start entering competitions'}</div>

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="auth-field">
                <label className="auth-label" htmlFor="name">Full name</label>
                <input className="auth-input" id="name" name="name" type="text" placeholder="Your name" autoComplete="name" />
              </div>
            )}
            <div className="auth-field">
              <label className="auth-label" htmlFor="email">Email</label>
              <input className="auth-input" id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
            </div>
            <div className="auth-field">
              <label className="auth-label" htmlFor="password">Password{mode === 'signup' ? ' (min 6 chars)' : ''}</label>
              <input className="auth-input" id="password" name="password" type="password" placeholder="••••••••" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} required />
            </div>

            {error ? <div className="auth-error">{error}</div> : null}
            {success ? <div className="auth-success">{success}</div> : null}

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <button className="auth-switch" type="button" onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setError(''); setSuccess('') }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <span>{mode === 'login' ? 'Sign up' : 'Sign in'}</span>
          </button>
        </div>
      </div>
    </View>
  )
}

function AccountProfile({ onSignOut }: { onSignOut: () => void }) {
  const { user, session } = useAuth()
  const [entryCount, setEntryCount] = useState(0)
  const [signingOut, setSigningOut] = useState(false)

  const name: string = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const email: string = user?.email || ''
  const initials = name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : ''

  useEffect(() => {
    if (!user || !session) return
    dbQuery(`entries?user_id=eq.${user.id}&select=id`, session.access_token)
      .then((data: any) => setEntryCount(Array.isArray(data) ? data.length : 0))
      .catch(() => {})
  }, [user])

  async function handleSignOut() {
    setSigningOut(true)
    await signOut()
    onSignOut()
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.bg }} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={p.header}><Text style={p.title}>Account</Text></View>
      <View style={{ paddingHorizontal: 16 }}>
        <View style={p.profileCard}>
          <View style={p.avatar}>
            <Text style={{ fontSize: 26, fontWeight: '800', color: '#fff' }}>{initials}</Text>
          </View>
          <Text style={p.profileName}>{name}</Text>
          <Text style={p.profileEmail}>{email}</Text>
          {!!memberSince && <Text style={p.profileMember}>Member since {memberSince}</Text>}
        </View>

        <View style={p.statsGrid}>
          <View style={p.statItem}>
            <Text style={p.statValue}>{entryCount}</Text>
            <Text style={p.statLabel}>Entries</Text>
          </View>
          <View style={[p.statItem, p.statDivider]}>
            <Text style={[p.statValue, { color: Colors.gold }]}>0</Text>
            <Text style={p.statLabel}>Wins 🏆</Text>
          </View>
          <View style={p.statItem}>
            <Text style={[p.statValue, { color: Colors.primary }]}>0</Text>
            <Text style={p.statLabel}>Credits ⚡</Text>
          </View>
        </View>

        <View style={p.section}>
          {[
            { icon: '🔔', label: 'Notifications' },
            { icon: '✉️', label: 'Free Entry by Post' },
            { icon: '📄', label: 'Terms & Conditions' },
            { icon: '🔒', label: 'Privacy Policy' },
          ].map((row, i, arr) => (
            <View key={row.label}>
              <TouchableOpacity style={p.row} activeOpacity={0.7}>
                <Text style={{ fontSize: 18, marginRight: 12 }}>{row.icon}</Text>
                <Text style={p.rowLabel}>{row.label}</Text>
                <Text style={{ marginLeft: 'auto', color: Colors.muted, fontSize: 16 }}>›</Text>
              </TouchableOpacity>
              {i < arr.length - 1 && <View style={p.divider} />}
            </View>
          ))}
          <View style={p.divider} />
          <TouchableOpacity style={p.row} onPress={handleSignOut} disabled={signingOut} activeOpacity={0.7}>
            <Text style={{ fontSize: 18, marginRight: 12 }}>🚪</Text>
            <Text style={[p.rowLabel, { color: Colors.red }]}>{signingOut ? 'Signing out…' : 'Sign Out'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

export default function AccountWeb() {
  const { user, loading, refresh } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bg }}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    )
  }

  return user
    ? <AccountProfile onSignOut={refresh} />
    : <AuthForm onSuccess={refresh} />
}

const p = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingTop: 56, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '800', color: Colors.text },
  profileCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 14 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  profileName: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  profileEmail: { fontSize: 13, color: Colors.textSec, marginBottom: 4 },
  profileMember: { fontSize: 12, color: Colors.muted },
  statsGrid: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, flexDirection: 'row', marginBottom: 14 },
  statItem: { flex: 1, padding: 16, alignItems: 'center' },
  statDivider: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: Colors.border },
  statValue: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 2 },
  statLabel: { fontSize: 11, color: Colors.textSec, fontWeight: '600' },
  section: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  rowLabel: { fontSize: 14, fontWeight: '600', color: Colors.text },
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 16 },
})
