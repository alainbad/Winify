import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native'
import { Colors } from '@/constants/theme'
import { signUp, signIn, signOut, dbQuery } from '@/lib/auth'
import { useAuth } from '@/lib/useAuth'

const IS = {
  wrap: { display: 'flex' as any, alignItems: 'center', justifyContent: 'center', minHeight: '80vh', background: '#F9FAFB', padding: 24 },
  card: { width: '100%', maxWidth: 400, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 28 },
  logo: { fontSize: 15, fontWeight: 900, color: '#7C3AED', marginBottom: 20, display: 'block' as any },
  heading: { fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 4, display: 'block' as any },
  sub: { fontSize: 13, color: '#6B7280', marginBottom: 22, display: 'block' as any },
  field: { marginBottom: 14 },
  label: { display: 'block' as any, fontSize: 11, fontWeight: 700, color: '#6B7280', marginBottom: 6, textTransform: 'uppercase' as any, letterSpacing: '0.3px' },
  input: { width: '100%', boxSizing: 'border-box' as any, border: '1px solid #E5E7EB', borderRadius: 8, padding: '11px 12px', fontSize: 14, color: '#111827', background: '#FAFAFA', outline: 'none', fontFamily: 'inherit', display: 'block' as any },
  btn: { width: '100%', background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontSize: 14, fontWeight: 800, cursor: 'pointer', marginTop: 6, marginBottom: 16, fontFamily: 'inherit', display: 'block' as any },
  btnDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  switchBtn: { fontSize: 13, color: '#6B7280', textAlign: 'center' as any, cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit', width: '100%', padding: 0 },
  switchSpan: { color: '#7C3AED', fontWeight: 700 },
  error: { background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: 10, marginBottom: 12, fontSize: 12, color: '#DC2626' },
  success: { background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: 10, marginBottom: 12, fontSize: 12, color: '#16A34A' },
}

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
    const nameEl = form.elements.namedItem('name') as HTMLInputElement | null
    const name = nameEl?.value.trim() ?? ''
    const phoneEl = form.elements.namedItem('phone') as HTMLInputElement | null
    const phone = phoneEl?.value.trim() ?? ''

    setError('')
    setSuccess('')
    if (!email || !password) { setError('Please enter your email and password.'); return }
    if (mode === 'signup' && password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (mode === 'signup' && !phone) { setError('Phone number is required.'); return }

    setLoading(true)
    if (mode === 'signup') {
      const { session, error } = await signUp(email, password, name, phone)
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

  return (
    <div style={IS.wrap}>
      <div style={IS.card}>
        <span style={IS.logo}>● Tick Pick</span>
        <span style={IS.heading}>{mode === 'login' ? 'Welcome back' : 'Create account'}</span>
        <span style={IS.sub}>{mode === 'login' ? 'Sign in to track your entries' : 'Join to start entering competitions'}</span>

        <form onSubmit={handleSubmit} noValidate>
          {mode === 'signup' && (
            <>
              <div style={IS.field}>
                <label style={IS.label} htmlFor="name">Full name</label>
                <input style={IS.input} id="name" name="name" type="text" placeholder="Your name" />
              </div>
              <div style={IS.field}>
                <label style={IS.label} htmlFor="phone">Phone number *</label>
                <input style={IS.input} id="phone" name="phone" type="tel" placeholder="+1 234 567 8900" required />
              </div>
            </>
          )}
          <div style={IS.field}>
            <label style={IS.label} htmlFor="email">Email</label>
            <input style={IS.input} id="email" name="email" type="email" placeholder="you@example.com" />
          </div>
          <div style={IS.field}>
            <label style={IS.label} htmlFor="password">Password{mode === 'signup' ? ' (min 6 chars)' : ''}</label>
            <input style={IS.input} id="password" name="password" type="password" placeholder="••••••••" />
          </div>

          {error ? <div style={IS.error}>{error}</div> : null}
          {success ? <div style={IS.success}>{success}</div> : null}

          <button style={{ ...IS.btn, ...(loading ? IS.btnDisabled : {}) }} type="submit" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <button style={IS.switchBtn} type="button" onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setError(''); setSuccess('') }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span style={IS.switchSpan}>{mode === 'login' ? 'Sign up' : 'Sign in'}</span>
        </button>
      </div>
    </div>
  )
}

function AccountProfile({ onSignOut }: { onSignOut: () => void }) {
  const { user, session } = useAuth()
  const [entryCount, setEntryCount] = useState(0)
  const [signingOut, setSigningOut] = useState(false)

  const name: string = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const email: string = user?.email || ''
  const phone: string = user?.user_metadata?.phone || ''
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
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Top Nav */}
      <View style={{ backgroundColor: Colors.primary }}>
        <View style={{ maxWidth: 1280, width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 32, paddingVertical: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '900' }}>●</Text>
            <Text style={{ fontSize: 18, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.4 }}>Tick Pick</Text>
          </View>
          <TouchableOpacity onPress={handleSignOut} disabled={signingOut}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.8)' }}>{signingOut ? 'Signing out…' : 'Sign Out'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={{ maxWidth: 900, width: '100%', alignSelf: 'center', paddingHorizontal: 24, paddingTop: 40 }}>

          {/* Profile header */}
          <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 32, flexDirection: 'row', alignItems: 'center', gap: 24, marginBottom: 20 }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 28, fontWeight: '800', color: '#fff' }}>{initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 4 }}>{name}</Text>
              <Text style={{ fontSize: 14, color: Colors.textSec, marginBottom: 2 }}>{email}</Text>
              {!!phone && <Text style={{ fontSize: 14, color: Colors.textSec, marginBottom: 2 }}>📱 {phone}</Text>}
              {!!memberSince && <Text style={{ fontSize: 12, color: Colors.muted }}>Member since {memberSince}</Text>}
            </View>
          </View>

          {/* Stats */}
          <View style={{ flexDirection: 'row', gap: 16, marginBottom: 20 }}>
            {[
              { label: 'Entries', value: entryCount, color: Colors.text },
              { label: 'Wins 🏆', value: 0, color: Colors.gold },
              { label: 'Credits ⚡', value: 0, color: Colors.primary },
            ].map(stat => (
              <View key={stat.label} style={{ flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 20, alignItems: 'center' }}>
                <Text style={{ fontSize: 28, fontWeight: '800', color: stat.color, marginBottom: 4 }}>{stat.value}</Text>
                <Text style={{ fontSize: 12, color: Colors.textSec, fontWeight: '600' }}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Settings */}
          <View style={{ backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: Colors.border, borderRadius: 16, overflow: 'hidden' }}>
            {[
              { icon: '🔔', label: 'Notifications' },
              { icon: '✉️', label: 'Free Entry by Post' },
              { icon: '📄', label: 'Terms & Conditions' },
              { icon: '🔒', label: 'Privacy Policy' },
            ].map((row, i, arr) => (
              <View key={row.label}>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }} activeOpacity={0.7}>
                  <Text style={{ fontSize: 18, marginRight: 14 }}>{row.icon}</Text>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.text, flex: 1 }}>{row.label}</Text>
                  <Text style={{ color: Colors.muted, fontSize: 18 }}>›</Text>
                </TouchableOpacity>
                {i < arr.length - 1 && <View style={{ height: 1, backgroundColor: Colors.border, marginHorizontal: 20 }} />}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
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
