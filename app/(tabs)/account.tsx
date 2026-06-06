import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import { Colors } from '@/constants/theme'
import { signIn, signUp, signOut } from '@/lib/auth'
import { useAuth } from '@/lib/useAuth'

function SettingsRow({ icon, label, danger, onPress }: { icon: string; label: string; danger?: boolean; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.settingsRow} activeOpacity={0.7} onPress={onPress}>
      <Text style={{ fontSize: 18, marginRight: 12 }}>{icon}</Text>
      <Text style={[styles.settingsLabel, danger && { color: Colors.red }]}>{label}</Text>
      {!danger && <Text style={{ marginLeft: 'auto', color: Colors.muted, fontSize: 16 }}>›</Text>}
    </TouchableOpacity>
  )
}

function AuthForm({ onSuccess }: { onSuccess: () => void }) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit() {
    setError(''); setSuccess('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    if (mode === 'signin') {
      const { session, error: err } = await signIn(email, password)
      setLoading(false)
      if (err) { setError(err); return }
      if (session) onSuccess()
    } else {
      if (!name) { setError('Please enter your name.'); setLoading(false); return }
      if (!phone) { setError('Phone number is required.'); setLoading(false); return }
      const { session, error: err } = await signUp(email, password, name, phone)
      setLoading(false)
      if (err) { setError(err); return }
      if (session) { onSuccess(); return }
      setSuccess('Check your email to confirm your account.')
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.authCard}>
        <Text style={styles.authTitle}>{mode === 'signin' ? 'Sign In' : 'Create Account'}</Text>
        <Text style={styles.authSub}>{mode === 'signin' ? 'Welcome back to Tick Pick' : 'Join Tick Pick today'}</Text>

        {mode === 'signup' && (
          <TextInput
            style={styles.input}
            placeholder="Full name"
            placeholderTextColor={Colors.muted}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        )}
        {mode === 'signup' && (
          <TextInput
            style={styles.input}
            placeholder="Phone number *"
            placeholderTextColor={Colors.muted}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor={Colors.muted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={Colors.muted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {!!error && <Text style={styles.errorText}>{error}</Text>}
        {!!success && <Text style={styles.successText}>{success}</Text>}

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>{mode === 'signin' ? 'Sign In' : 'Create Account'}</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setSuccess('') }} style={{ marginTop: 16, alignItems: 'center' }}>
          <Text style={styles.switchText}>
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <Text style={{ color: Colors.primary, fontWeight: '700' }}>{mode === 'signin' ? 'Sign Up' : 'Sign In'}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

function AccountProfile() {
  const { user, refresh } = useAuth()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)
    await signOut()
    refresh()
    setSigningOut(false)
  }

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : (user?.email?.[0] ?? '?').toUpperCase()
  const phone: string = user?.user_metadata?.phone || ''
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    : ''

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}>
      <View style={styles.profileCard}>
        <View style={styles.profileAvatar}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: 'white' }}>{initials}</Text>
        </View>
        <Text style={styles.profileName}>{user?.user_metadata?.full_name ?? 'User'}</Text>
        <Text style={styles.profileEmail}>{user?.email}</Text>
        {!!phone && <Text style={styles.profileEmail}>📱 {phone}</Text>}
        {!!memberSince && <Text style={styles.profileMember}>Member since {memberSince}</Text>}
      </View>

      <View style={styles.howCard}>
        <Text style={styles.howTitle}>How Tick Pick Works</Text>
        {[
          { n: '1', t: 'Browse competitions', d: 'Find a prize pool you like.' },
          { n: '2', t: 'Answer a skill question', d: 'Prove you\'re human — no bots!' },
          { n: '3', t: 'Pay $2 entry fee', d: 'Secure payment via Gumroad.' },
          { n: '4', t: 'Wait for the draw', d: 'RANDOM.ORG picks the winner.' },
        ].map(s => (
          <View key={s.n} style={styles.howStep}>
            <View style={styles.howNum}><Text style={{ fontSize: 12, fontWeight: '800', color: Colors.primary }}>{s.n}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.howStepTitle}>{s.t}</Text>
              <Text style={styles.howStepDesc}>{s.d}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.settingsCard}>
        <SettingsRow icon="📄" label="Terms & Conditions" />
        <View style={styles.settingsDivider} />
        <SettingsRow icon="🔒" label="Privacy Policy" />
        <View style={styles.settingsDivider} />
        <SettingsRow icon="🚪" label={signingOut ? 'Signing out…' : 'Sign Out'} danger onPress={handleSignOut} />
      </View>
    </ScrollView>
  )
}

export default function AccountScreen() {
  const { user, loading, refresh } = useAuth()

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <View style={styles.header}>
        <Text style={styles.title}>Account</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : !user ? (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}>
          <AuthForm onSuccess={refresh} />
        </ScrollView>
      ) : (
        <AccountProfile />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingTop: 56, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '800', color: Colors.text },
  authCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 24, marginTop: 8 },
  authTitle: { fontSize: 22, fontWeight: '900', color: Colors.text, marginBottom: 4 },
  authSub: { fontSize: 13, color: Colors.textSec, marginBottom: 20 },
  input: { backgroundColor: Colors.bg, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: Colors.text, marginBottom: 12 },
  errorText: { fontSize: 13, color: Colors.red, marginBottom: 10 },
  successText: { fontSize: 13, color: Colors.green, marginBottom: 10 },
  submitBtn: { backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  submitBtnText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  switchText: { fontSize: 13, color: Colors.textSec },
  profileCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 14 },
  profileAvatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  profileName: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  profileEmail: { fontSize: 13, color: Colors.textSec, marginBottom: 4 },
  profileMember: { fontSize: 12, color: Colors.muted },
  howCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 16, marginBottom: 14 },
  howTitle: { fontSize: 15, fontWeight: '800', color: Colors.text, marginBottom: 12 },
  howStep: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  howNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  howStepTitle: { fontSize: 13, fontWeight: '700', color: Colors.text },
  howStepDesc: { fontSize: 12, color: Colors.textSec, marginTop: 1 },
  settingsCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, overflow: 'hidden' },
  settingsRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  settingsLabel: { fontSize: 14, fontWeight: '600', color: Colors.text },
  settingsDivider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 16 },
})
