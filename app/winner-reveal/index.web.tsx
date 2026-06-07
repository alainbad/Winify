import React, { useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native'
import { router } from 'expo-router'
import { Colors } from '@/constants/theme'

export default function WinnerRevealWeb() {
  const trophyScale = useRef(new Animated.Value(0)).current
  const contentOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.spring(trophyScale, { toValue: 1, tension: 60, friction: 5, useNativeDriver: true }),
        Animated.timing(contentOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
    ]).start()
  }, [])

  return (
    <View style={s.page}>
      {/* Top Nav */}
      <View style={s.topNav}>
        <View style={s.topNavInner}>
          <TouchableOpacity onPress={() => router.push('/')} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="11" fill="white"/>
              <path d="M20 9l2.8 6.1 6.1.9-4.4 4.3 1.05 6.1L20 23.2l-5.55 3.2 1.05-6.1-4.4-4.3 6.1-.9z" fill="#7C3AED"/>
            </svg>
            <Text style={{ fontSize: 20, fontWeight: '900', color: '#fff', letterSpacing: -0.5 }}>Tick<Text style={{ color: '#F59E0B' }}>Pick</Text></Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 28 }}>
            <TouchableOpacity onPress={() => router.push('/')}><Text style={s.navItem}>Competitions</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/browse')}><Text style={s.navItem}>Browse</Text></TouchableOpacity>
          </View>
        </View>
      </View>

      <Animated.View style={[s.content, { opacity: contentOpacity }]}>
        {/* Live badge */}
        <View style={s.liveBadge}>
          <View style={s.liveDot} />
          <Text style={s.liveText}>LIVE DRAW</Text>
        </View>

        {/* Trophy */}
        <Animated.Text style={[s.trophy, { transform: [{ scale: trophyScale }] }]}>🏆</Animated.Text>

        <Text style={s.heading}>We have a winner!</Text>
        <Text style={s.sub}>RANDOM.ORG has spoken</Text>

        {/* Winner card */}
        <View style={s.card}>
          <View style={s.winnerAvatar}>
            <Text style={{ fontSize: 28, fontWeight: '800', color: 'white' }}>j***n</Text>
          </View>
          <Text style={s.winnerName}>j***n</Text>
          <Text style={s.winnerPrize}>$50 Amazon Gift Card</Text>
          <View style={s.entryBadge}>
            <Text style={s.entryBadgeText}>Entry #E-2004 · 1 of 75</Text>
          </View>
        </View>

        {/* Verification */}
        <View style={s.verifyCard}>
          <Text style={s.verifyCheck}>✓</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.verifyTitle}>Verified by RANDOM.ORG</Text>
            <Text style={s.verifyHash}>Seed: 0x4a2f...b7c1 · {new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={s.actions}>
          <TouchableOpacity style={s.nextBtn} onPress={() => router.push('/')}>
            <Text style={s.nextBtnText}>Enter Next Competition →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.backBtn} onPress={() => router.canGoBack() ? router.back() : router.push('/')}>
            <Text style={s.backBtnText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  )
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#0F0820' },
  topNav: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  topNavInner: { maxWidth: 1280, width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 32, paddingVertical: 14 },
  brandName: { fontSize: 16, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.4 },
  navItem: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.7)' },
  content: { maxWidth: 520, width: '100%', alignSelf: 'center', alignItems: 'center', paddingHorizontal: 24, paddingTop: 56, paddingBottom: 60 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(239,68,68,0.15)', borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 24 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
  liveText: { fontSize: 11, fontWeight: '800', color: '#EF4444', letterSpacing: 2 },
  trophy: { fontSize: 80, marginBottom: 16 },
  heading: { fontSize: 32, fontWeight: '900', color: '#FFFFFF', textAlign: 'center', marginBottom: 6, letterSpacing: -0.5 },
  sub: { fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 32 },
  card: { width: '100%', backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 32, alignItems: 'center', marginBottom: 16 },
  winnerAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  winnerName: { fontSize: 24, fontWeight: '800', color: '#FFFFFF', marginBottom: 6 },
  winnerPrize: { fontSize: 18, fontWeight: '700', color: '#F59E0B', marginBottom: 12 },
  entryBadge: { backgroundColor: 'rgba(167,139,250,0.2)', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 6 },
  entryBadgeText: { fontSize: 13, color: '#A78BFA', fontWeight: '600' },
  verifyCard: { width: '100%', flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: 'rgba(16,185,129,0.1)', borderWidth: 1, borderColor: 'rgba(16,185,129,0.25)', borderRadius: 14, padding: 16, marginBottom: 32 },
  verifyCheck: { fontSize: 16, color: '#10B981', fontWeight: '800' },
  verifyTitle: { fontSize: 13, fontWeight: '700', color: '#10B981', marginBottom: 3 },
  verifyHash: { fontSize: 11, color: 'rgba(16,185,129,0.6)', fontFamily: 'monospace' as any },
  actions: { width: '100%', gap: 12 },
  nextBtn: { width: '100%', backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  nextBtnText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF' },
  backBtn: { width: '100%', alignItems: 'center', paddingVertical: 10 },
  backBtnText: { fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: '500' },
})
