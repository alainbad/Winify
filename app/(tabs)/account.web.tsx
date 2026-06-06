import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, ScrollView } from 'react-native'
import { Colors } from '@/constants/theme'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/useAuth'

function AuthForm() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit() {
    setError('')
    setSuccess('')
    if (!email || !password) { setError('Please enter your email and password.'); return }
    if (mode === 'signup' && password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      })
      if (error) {
        setError(error.message)
      } else if (data.session) {
        // Email confirmation disabled — user is signed in immediately, nothing to do
      } else {
        // Email confirmation enabled — tell them to check email
        setSuccess('Account created! Check your email to confirm, then sign in.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        if (error.message.includes('Invalid login')) {
          setError('Incorrect email or password.')
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please confirm your email first, then try signing in.')
        } else {
          setError(error.message)
        }
      }
    }
    setLoading(false)
  }

  return (
    <View style={f.wrap}>
      <View style={f.card}>
        <Text style={f.logo}>● Tick Pick</Text>
        <Text style={f.heading}>{mode === 'login' ? 'Welcome back' : 'Create account'}</Text>
        <Text style={f.sub}>{mode === 'login' ? 'Sign in to track your entries' : 'Join to start entering competitions'}</Text>

        {mode === 'signup' && (
          <View style={f.field}>
            <Text style={f.label}>Full name</Text>
            <TextInput style={f.input} placeholder="Your name" placeholderTextColor={Colors.muted}
              value={name} onChangeText={setName} autoCapitalize="words" />
          </View>
        )}

        <View style={f.field}>
          <Text style={f.label}>Email</Text>
          <TextInput style={f.input} placeholder="you@example.com" placeholderTextColor={Colors.muted}
            value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        </View>

        <View style={f.field}>
          <Text style={f.label}>Password{mode === 'signup' ? ' (min 6 characters)' : ''}</Text>
          <TextInput style={f.input} placeholder="••••••••" placeholderTextColor={Colors.muted}
            value={password} onChangeText={setPassword} secureTextEntry
            onSubmitEditing={handleSubmit} returnKeyType="go" />
        </View>

        {!!error && <View style={f.errorBox}><Text style={f.errorText}>{error}</Text></View>}
        {!!success && <View style={f.successBox}><Text style={f.successText}>{success}</Text></View>}

        <TouchableOpacity style={[f.btn, loading && { opacity: 0.6 }]} onPress={handleSubmit} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" size="small" />
            : <Text style={f.btnText}>{mode === 'login' ? 'Sign In' : 'Create Account'}</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setError(''); setSuccess('') }}>
          <Text style={f.switchText}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <Text style={{ color: Colors.primary, fontWeight: '700' }}>{mode === 'login' ? 'Sign up' : 'Sign in'}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

function AccountProfile() {
  const { user } = useAuth()
  const [entryCount, setEntryCount] = useState(0)
  const [signingOut, setSigningOut] = useState(false)

  const name: string = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const email: string = user?.email || ''
  const initials = name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : ''

  useEffect(() => {
    if (!user) return
    supabase.from('entries').select('id', { count: 'exact', head: true }).eq('user_id', user.id)
      .then(({ count }) => setEntryCount(count ?? 0))
  }, [user])

  async function signOut() {
    setSigningOut(true)
    await supabase.auth.signOut()
    setSigningOut(false)
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
          <TouchableOpacity style={p.row} onPress={signOut} disabled={signingOut} activeOpacity={0.7}>
            <Text style={{ fontSize: 18, marginRight: 12 }}>🚪</Text>
            <Text style={[p.rowLabel, { color: Colors.red }]}>
              {signingOut ? 'Signing out…' : 'Sign Out'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

export default function AccountWeb() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bg }}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    )
  }

  return user ? <AccountProfile /> : <AuthForm />
}

const f = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center', padding: 24, minHeight: 500 },
  card: { width: '100%', maxWidth: 400, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 28 },
  logo: { fontSize: 15, fontWeight: '900', color: Colors.primary, marginBottom: 20 },
  heading: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  sub: { fontSize: 13, color: Colors.textSec, marginBottom: 22 },
  field: { marginBottom: 14 },
  label: { fontSize: 11, fontWeight: '700', color: Colors.textSec, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.3 },
  input: { borderWidth: 1, borderColor: Colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 11, fontSize: 14, color: Colors.text, backgroundColor: '#FAFAFA' },
  btn: { backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 13, alignItems: 'center', marginTop: 6, marginBottom: 16 },
  btnText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  switchText: { fontSize: 13, color: Colors.textSec, textAlign: 'center' },
  errorBox: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', borderRadius: 8, padding: 10, marginBottom: 12 },
  errorText: { fontSize: 12, color: '#DC2626' },
  successBox: { backgroundColor: Colors.greenBg, borderWidth: 1, borderColor: Colors.greenLight, borderRadius: 8, padding: 10, marginBottom: 12 },
  successText: { fontSize: 12, color: Colors.green },
})

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
