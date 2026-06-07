import React, { useState, useEffect } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { Colors } from '@/constants/theme'
import { signUp, signIn, signOut, dbQuery } from '@/lib/auth'
import { useAuth } from '@/lib/useAuth'

const IS = {
  wrap: { display: 'flex' as any, alignItems: 'center', justifyContent: 'center', minHeight: '80vh', background: '#F4F6FA', padding: 24 },
  card: { width: '100%', maxWidth: 420, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  logo: { fontSize: 15, fontWeight: 900, color: '#7C3AED', marginBottom: 24, display: 'block' as any },
  heading: { fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 4, display: 'block' as any },
  sub: { fontSize: 13, color: '#6B7280', marginBottom: 26, display: 'block' as any },
  field: { marginBottom: 16 },
  label: { display: 'block' as any, fontSize: 11, fontWeight: 700, color: '#6B7280', marginBottom: 6, textTransform: 'uppercase' as any, letterSpacing: '0.5px' },
  input: { width: '100%', boxSizing: 'border-box' as any, border: '1px solid #E5E7EB', borderRadius: 8, padding: '11px 14px', fontSize: 14, color: '#111827', background: '#FAFAFA', outline: 'none', fontFamily: 'inherit', display: 'block' as any },
  btn: { width: '100%', background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontSize: 14, fontWeight: 800, cursor: 'pointer', marginTop: 8, marginBottom: 16, fontFamily: 'inherit', display: 'block' as any },
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
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="11" fill="#7C3AED"/>
            <path d="M20 9l2.8 6.1 6.1.9-4.4 4.3 1.05 6.1L20 23.2l-5.55 3.2 1.05-6.1-4.4-4.3 6.1-.9z" fill="white"/>
          </svg>
          <span style={{ fontSize: 20, fontWeight: 900, color: '#7C3AED', letterSpacing: -0.5 }}>Tick<span style={{ color: '#F59E0B' }}>Pick</span></span>
        </div>
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
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
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

  const dash: React.CSSProperties = {
    display: 'flex',
    minHeight: '100vh',
    background: '#F4F6FA',
    fontFamily: 'inherit',
  }

  const sidebar: React.CSSProperties = {
    width: 260,
    minWidth: 260,
    background: '#fff',
    borderRight: '1px solid #E5E7EB',
    display: 'flex',
    flexDirection: 'column',
    padding: '32px 24px',
  }

  const main: React.CSSProperties = {
    flex: 1,
    padding: '40px 48px',
    overflowY: 'auto',
  }

  const sectionCard: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #E5E7EB',
    borderRadius: 12,
    padding: '24px 28px',
    marginBottom: 24,
  }

  const sectionTitle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginBottom: 16,
    display: 'block',
  }

  const statBox: React.CSSProperties = {
    background: '#F9FAFB',
    border: '1px solid #E5E7EB',
    borderRadius: 10,
    padding: '20px 24px',
    flex: 1,
  }

  const navItem: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
    color: '#374151',
    textDecoration: 'none',
    marginBottom: 4,
  }

  const navItemActive: React.CSSProperties = {
    ...navItem,
    background: '#EDE9FE',
    color: '#7C3AED',
  }

  return (
    <div style={dash}>
      {/* Sidebar */}
      <div style={sidebar}>
        {/* Logo */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="11" fill="#7C3AED"/>
              <path d="M20 9l2.8 6.1 6.1.9-4.4 4.3 1.05 6.1L20 23.2l-5.55 3.2 1.05-6.1-4.4-4.3 6.1-.9z" fill="white"/>
            </svg>
            <span style={{ fontSize: 20, fontWeight: 900, color: '#7C3AED', letterSpacing: -0.5 }}>Tick<span style={{ color: '#F59E0B' }}>Pick</span></span>
          </div>
        </div>

        {/* Avatar + name */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingBottom: 24, borderBottom: '1px solid #E5E7EB', marginBottom: 24 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>{initials}</span>
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#111827', display: 'block', marginBottom: 4 }}>{name}</span>
          <span style={{ fontSize: 12, color: '#6B7280', display: 'block', wordBreak: 'break-all' }}>{email}</span>
          {phone && <span style={{ fontSize: 12, color: '#6B7280', display: 'block', marginTop: 4 }}>📱 {phone}</span>}
          {memberSince && <span style={{ fontSize: 11, color: '#9CA3AF', display: 'block', marginTop: 8 }}>Member since {memberSince}</span>}
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1 }}>
          <a href="/" style={navItem}>
            <span style={{ fontSize: 16 }}>🏠</span> Home
          </a>
          <a href="/browse" style={navItem}>
            <span style={{ fontSize: 16 }}>🔍</span> Browse
          </a>
          <a href="/entries" style={navItem}>
            <span style={{ fontSize: 16 }}>🎟️</span> My Entries
          </a>
          <a href="/account" style={navItemActive}>
            <span style={{ fontSize: 16 }}>👤</span> Account
          </a>
        </nav>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          style={{ marginTop: 'auto', width: '100%', background: 'none', border: '1px solid #E5E7EB', borderRadius: 8, padding: '10px 14px', fontSize: 13, fontWeight: 600, color: '#DC2626', cursor: signingOut ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <span>🚪</span> {signingOut ? 'Signing out…' : 'Sign Out'}
        </button>
      </div>

      {/* Main content */}
      <div style={main}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111827', margin: 0, marginBottom: 4 }}>My Account</h1>
          <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>Manage your profile and view your competition history.</p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <div style={statBox}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: 8 }}>Total Entries</span>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#111827', display: 'block', lineHeight: 1 }}>{entryCount}</span>
          </div>
          <div style={statBox}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: 8 }}>Wins 🏆</span>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#D97706', display: 'block', lineHeight: 1 }}>0</span>
          </div>
          <div style={statBox}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'block', marginBottom: 8 }}>Credits ⚡</span>
            <span style={{ fontSize: 32, fontWeight: 800, color: '#7C3AED', display: 'block', lineHeight: 1 }}>0</span>
          </div>
        </div>

        {/* Account details */}
        <div style={sectionCard}>
          <span style={sectionTitle}>Account Details</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 32px' }}>
            {[
              { label: 'Full Name', value: name },
              { label: 'Email Address', value: email },
              { label: 'Phone Number', value: phone || '—' },
              { label: 'Member Since', value: memberSince || '—' },
            ].map(({ label, value }) => (
              <div key={label}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' as any, letterSpacing: '0.5px', display: 'block', marginBottom: 4 }}>{label}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#111827', display: 'block' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Legal & Settings */}
        <div style={sectionCard}>
          <span style={sectionTitle}>Settings & Legal</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[
              { icon: '📄', label: 'Terms & Conditions' },
              { icon: '🔒', label: 'Privacy Policy' },
              { icon: '✉️', label: 'Free Entry by Post' },
            ].map(({ icon, label }) => (
              <div
                key={label}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 8, cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ fontSize: 16 }}>{icon}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#374151', flex: 1 }}>{label}</span>
                <span style={{ color: '#9CA3AF', fontSize: 16 }}>›</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
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
