import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import { Colors } from '@/constants/theme'
import { POOLS, Pool } from '@/lib/data'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/useAuth'

const LOGO_DEV_TOKEN = 'pk_OfBoU3ocR7WzMrZfenk7Iw'
const BRAND_DOMAINS: Record<string, string> = {
  'Amazon': 'amazon.com', 'Xbox': 'xbox.com', 'Netflix': 'netflix.com',
  'Steam': 'steampowered.com', 'Spotify': 'spotify.com', 'Roblox': 'roblox.com',
  'Apple': 'apple.com', 'Uber Eats': 'ubereats.com', 'Starbucks': 'starbucks.com',
  'PlayStation': 'playstation.com', 'Microsoft': 'microsoft.com',
  'Booking.com': 'booking.com', 'Airbnb': 'airbnb.com', 'Nintendo': 'nintendo.com',
  'Disney+': 'disneyplus.com', 'Expedia': 'expedia.com',
}
const CARD_THEMES: Record<string, { bg1: string; bg2: string; textColor: string }> = {
  'Amazon': { bg1: '#FF9900', bg2: '#E47911', textColor: '#FFFFFF' },
  'Xbox': { bg1: '#FFFFFF', bg2: '#F0F0F0', textColor: '#107C10' },
  'Netflix': { bg1: '#141414', bg2: '#1A0000', textColor: '#E50914' },
  'Steam': { bg1: '#1B2838', bg2: '#2A475E', textColor: '#FFFFFF' },
  'Spotify': { bg1: '#191414', bg2: '#121212', textColor: '#1DB954' },
  'Roblox': { bg1: '#FFFFFF', bg2: '#F0F0F0', textColor: '#E2231A' },
  'Google Play': { bg1: '#FFFFFF', bg2: '#F5F5F5', textColor: '#34A853' },
  'Apple': { bg1: '#1A1A1A', bg2: '#2D2D2D', textColor: '#FFFFFF' },
  'Uber Eats': { bg1: '#142328', bg2: '#06C167', textColor: '#FFFFFF' },
  'Starbucks': { bg1: '#00704A', bg2: '#005F3E', textColor: '#FFFFFF' },
  'PlayStation': { bg1: '#003791', bg2: '#00287A', textColor: '#FFFFFF' },
  'Microsoft': { bg1: '#0078D4', bg2: '#005BA1', textColor: '#FFFFFF' },
  'Booking.com': { bg1: '#003580', bg2: '#002B6B', textColor: '#FFFFFF' },
  'Airbnb': { bg1: '#FF5A5F', bg2: '#E0474C', textColor: '#FFFFFF' },
  'Nintendo': { bg1: '#E60012', bg2: '#C4000F', textColor: '#FFFFFF' },
  'Disney+': { bg1: '#0F1F5C', bg2: '#1A3080', textColor: '#FFFFFF' },
  'Expedia': { bg1: '#00355F', bg2: '#00243F', textColor: '#FFC72C' },
}

function BrandCard({ pool, size = 80 }: { pool: Pool; size?: number }) {
  const theme = CARD_THEMES[pool.brand] ?? { bg1: pool.bgColor, bg2: pool.bgColor, textColor: '#FFFFFF' }
  const domain = BRAND_DOMAINS[pool.brand]
  const [failed, setFailed] = useState(false)
  return (
    <View style={{ width: size, height: size * 0.66, borderRadius: 8, overflow: 'hidden', backgroundColor: theme.bg1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: theme.bg2, opacity: 0.45 }]} />
      {domain && !failed
        ? <img src={`https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}&size=64&format=png`} onError={() => setFailed(true)} style={{ width: size * 0.45, height: size * 0.45, objectFit: 'contain' }} />
        : <Text style={{ color: theme.textColor, fontSize: 18, fontWeight: '800' }}>{pool.brand[0]}</Text>
      }
    </View>
  )
}

type Entry = { id: number; pool_id: number; tickets: number; amount_paid: number; created_at: string }

function EntryRow({ entry, pool }: { entry: Entry; pool: Pool }) {
  const isUrgent = pool.pct > 70
  const date = new Date(entry.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  return (
    <View style={s.entryCard}>
      <View style={s.entryTop}>
        <BrandCard pool={pool} size={80} />
        <View style={s.entryInfo}>
          <Text style={s.entryPrize}>{pool.prize}</Text>
          <Text style={s.entryMeta}>Entry #{entry.id} · ${Number(entry.amount_paid).toFixed(2)} paid · {date}</Text>
        </View>
        <View style={s.activeBadge}>
          <View style={s.activeDot} />
          <Text style={s.activeText}>Active</Text>
        </View>
      </View>
      <View style={s.progressBlock}>
        <View style={s.progressHead}>
          <Text style={s.progressLabel}>{pool.entries.toLocaleString()}/{pool.total.toLocaleString()} entries · closes in {pool.time}</Text>
          <Text style={[s.progressPct, { color: isUrgent ? Colors.red : Colors.primary }]}>{pool.pct}%</Text>
        </View>
        <View style={s.progressBg}>
          <View style={[s.progressFill, { width: `${pool.pct}%` as any, backgroundColor: isUrgent ? Colors.red : Colors.primary }]} />
        </View>
      </View>
      <View style={s.entryFooter}>
        <View style={s.verifyNote}>
          <Text style={{ fontSize: 10 }}>🔒</Text>
          <Text style={s.verifyText}>Draw verified by RANDOM.ORG — tamper-proof</Text>
        </View>
        <TouchableOpacity style={s.simulateBtn} onPress={() => router.push('/winner-reveal')}>
          <Text style={s.simulateBtnText}>Simulate Draw →</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default function EntriesWeb() {
  const { user, loading: authLoading } = useAuth()
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    supabase.from('entries').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => { setEntries(data ?? []); setLoading(false) })
  }, [user])

  const entriesWithPools = entries
    .map(e => ({ entry: e, pool: POOLS.find(p => p.id === e.pool_id) }))
    .filter(x => x.pool) as { entry: Entry; pool: Pool }[]

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <View style={s.topNav}>
        <View style={s.topNavInner}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '900' }}>●</Text>
            <Text style={s.brandName}>Tick Pick</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 28 }}>
            <TouchableOpacity onPress={() => router.push('/')}><Text style={s.navItem}>Competitions</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/browse')}><Text style={s.navItem}>Browse</Text></TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={s.page}>
          {authLoading || loading ? (
            <View style={{ alignItems: 'center', paddingTop: 80 }}>
              <ActivityIndicator color={Colors.primary} size="large" />
            </View>
          ) : !user ? (
            <View style={s.emptyBox}>
              <Text style={{ fontSize: 40, marginBottom: 14 }}>🎟</Text>
              <Text style={s.emptyTitle}>Sign in to see your entries</Text>
              <Text style={s.emptyDesc}>Create an account to track your competitions and get notified when you win.</Text>
              <TouchableOpacity style={s.browseBtn} onPress={() => router.push('/(tabs)/account')}>
                <Text style={s.browseBtnText}>Sign In / Create Account</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={s.pageHeader}>
                <View>
                  <Text style={s.pageTitle}>My Entries</Text>
                  <Text style={s.pageSubtitle}>{entriesWithPools.length} active competition{entriesWithPools.length !== 1 ? 's' : ''}</Text>
                </View>
                <TouchableOpacity style={s.browseBtn} onPress={() => router.push('/')}>
                  <Text style={s.browseBtnText}>+ Enter More</Text>
                </TouchableOpacity>
              </View>

              {entriesWithPools.length === 0 ? (
                <View style={s.emptyBox}>
                  <Text style={{ fontSize: 40, marginBottom: 14 }}>🎟</Text>
                  <Text style={s.emptyTitle}>No entries yet</Text>
                  <Text style={s.emptyDesc}>Enter a competition to see it tracked here.</Text>
                  <TouchableOpacity style={s.browseBtn} onPress={() => router.push('/')}>
                    <Text style={s.browseBtnText}>Browse Competitions</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={s.entriesList}>
                  {entriesWithPools.map(({ entry, pool }) => <EntryRow key={entry.id} entry={entry} pool={pool} />)}
                </View>
              )}
            </>
          )}

          <View style={s.postalCard}>
            <Text style={{ fontSize: 32, marginBottom: 10 }}>✉️</Text>
            <Text style={s.postalTitle}>Free Postal Entry</Text>
            <Text style={s.postalDesc}>Enter any competition for free by post. Hand-write your name, address, and competition name on a postcard and send to:</Text>
            <View style={s.postalAddress}>
              <Text style={s.postalAddressText}>Tick Pick Competitions Ltd</Text>
              <Text style={s.postalAddressText}>PO Box 1234</Text>
              <Text style={s.postalAddressText}>London, EC1A 1BB</Text>
              <Text style={s.postalAddressText}>United Kingdom</Text>
            </View>
            <Text style={s.postalNote}>One entry per envelope. Must arrive before draw date.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  topNav: { backgroundColor: Colors.primary },
  topNavInner: { maxWidth: 1280, width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 32, paddingVertical: 14 },
  brandName: { fontSize: 18, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.4 },
  navItem: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  page: { maxWidth: 900, width: '100%', alignSelf: 'center', paddingHorizontal: 24, paddingTop: 32 },
  pageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  pageTitle: { fontSize: 26, fontWeight: '900', color: Colors.text, letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 13, color: Colors.textSec, marginTop: 3, fontWeight: '500' },
  browseBtn: { backgroundColor: Colors.primary, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 10 },
  browseBtnText: { fontSize: 13, fontWeight: '800', color: '#FFFFFF' },
  entriesList: { gap: 14, marginBottom: 28 },
  entryCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: Colors.border, borderRadius: 14, padding: 20 },
  entryTop: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  entryInfo: { flex: 1 },
  entryPrize: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 3 },
  entryMeta: { fontSize: 12, color: Colors.textSec, fontWeight: '500' },
  activeBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#D1FAE5', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 },
  activeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#10B981' },
  activeText: { fontSize: 12, fontWeight: '700', color: '#059669' },
  progressBlock: { marginBottom: 14 },
  progressHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 12, color: Colors.textSec, fontWeight: '500' },
  progressPct: { fontSize: 12, fontWeight: '800' },
  progressBg: { height: 6, backgroundColor: '#F0EBFF', borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999 },
  entryFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  verifyNote: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.primaryLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  verifyText: { fontSize: 11, color: Colors.primary, fontWeight: '600' },
  simulateBtn: { backgroundColor: Colors.primary, borderRadius: 8, paddingHorizontal: 18, paddingVertical: 9 },
  simulateBtnText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  emptyBox: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: Colors.border, borderRadius: 14, padding: 40, alignItems: 'center', marginBottom: 24 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 8 },
  emptyDesc: { fontSize: 13, color: Colors.textSec, textAlign: 'center', lineHeight: 20, marginBottom: 18, maxWidth: 360 },
  postalCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: Colors.border, borderRadius: 14, padding: 28, alignItems: 'center', marginTop: 8 },
  postalTitle: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 8 },
  postalDesc: { fontSize: 13, color: Colors.textSec, textAlign: 'center', lineHeight: 20, marginBottom: 14, maxWidth: 480 },
  postalAddress: { backgroundColor: Colors.primaryLight, borderRadius: 10, paddingVertical: 14, paddingHorizontal: 24, marginBottom: 12, alignItems: 'center' },
  postalAddressText: { fontSize: 13, color: Colors.primary, fontWeight: '700', lineHeight: 24 },
  postalNote: { fontSize: 11, color: Colors.muted },
})
