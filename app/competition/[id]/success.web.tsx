import React, { useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/theme'
import { POOLS, Pool } from '@/lib/data'

type CardTheme = {
  bg1: string; bg2: string; textColor: string;
  icon?: { lib: 'fa5' | 'mci' | 'svg'; name: string; svgUrl?: string }
}

const CARD_THEMES: Record<string, CardTheme> = {
  'Amazon':      { bg1: '#FF9900', bg2: '#E47911', textColor: '#FFFFFF', icon: { lib: 'fa5', name: 'amazon' } },
  'Xbox':        { bg1: '#107C10', bg2: '#0A5A0A', textColor: '#FFFFFF', icon: { lib: 'fa5', name: 'xbox' } },
  'Netflix':     { bg1: '#141414', bg2: '#1A0000', textColor: '#E50914', icon: { lib: 'svg', name: 'netflix', svgUrl: 'https://cdn.simpleicons.org/netflix/E50914' } },
  'Steam':       { bg1: '#1B2838', bg2: '#2A475E', textColor: '#FFFFFF', icon: { lib: 'fa5', name: 'steam' } },
  'Spotify':     { bg1: '#191414', bg2: '#121212', textColor: '#1DB954', icon: { lib: 'fa5', name: 'spotify' } },
  'Roblox':      { bg1: '#FFFFFF', bg2: '#F0F0F0', textColor: '#E2231A', icon: { lib: 'svg', name: 'roblox', svgUrl: 'https://cdn.simpleicons.org/roblox/E2231A' } },
  'Google Play': { bg1: '#FFFFFF', bg2: '#F5F5F5', textColor: '#34A853', icon: { lib: 'svg', name: 'googleplay', svgUrl: 'https://cdn.simpleicons.org/googleplay/34A853' } },
  'Apple':       { bg1: '#1A1A1A', bg2: '#2D2D2D', textColor: '#FFFFFF', icon: { lib: 'fa5', name: 'apple' } },
  'Uber Eats':   { bg1: '#142328', bg2: '#06C167', textColor: '#FFFFFF', icon: { lib: 'svg', name: 'ubereats', svgUrl: 'https://cdn.simpleicons.org/ubereats/FFFFFF' } },
  'Starbucks':   { bg1: '#00704A', bg2: '#005F3E', textColor: '#FFFFFF', icon: { lib: 'svg', name: 'starbucks', svgUrl: 'https://cdn.simpleicons.org/starbucks/FFFFFF' } },
  'PlayStation': { bg1: '#003791', bg2: '#00287A', textColor: '#FFFFFF', icon: { lib: 'fa5', name: 'playstation' } },
  'Microsoft':   { bg1: '#0078D4', bg2: '#005BA1', textColor: '#FFFFFF', icon: { lib: 'fa5', name: 'microsoft' } },
  'Booking.com': { bg1: '#003580', bg2: '#002B6B', textColor: '#FFFFFF', icon: { lib: 'svg', name: 'bookingcom', svgUrl: 'https://cdn.simpleicons.org/bookingdotcom/FFFFFF' } },
  'Airbnb':      { bg1: '#FF5A5F', bg2: '#E0474C', textColor: '#FFFFFF', icon: { lib: 'fa5', name: 'airbnb' } },
  'Nintendo':    { bg1: '#E60012', bg2: '#C4000F', textColor: '#FFFFFF', icon: { lib: 'mci', name: 'nintendo-switch' } },
  'Disney+':     { bg1: '#0F1F5C', bg2: '#1A3080', textColor: '#FFFFFF', icon: { lib: 'svg', name: 'disneyplus', svgUrl: 'https://cdn.simpleicons.org/disneyplus/FFFFFF' } },
  'Expedia':     { bg1: '#00355F', bg2: '#00243F', textColor: '#FFC72C', icon: { lib: 'svg', name: 'expedia', svgUrl: 'https://cdn.simpleicons.org/expedia/FFC72C' } },
}

function MiniGiftCard({ pool, size = 96 }: { pool: Pool; size?: number }) {
  const theme = CARD_THEMES[pool.brand] ?? { bg1: pool.bgColor, bg2: pool.bgColor, textColor: '#FFFFFF' }
  const ic = theme.icon
  const svgBg = ic?.lib === 'svg' && ic.svgUrl ? {
    backgroundImage: `url(${ic.svgUrl})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundSize: '65% 65%',
  } as any : {}
  return (
    <View style={{
      width: size, height: size * 0.66, borderRadius: 8, overflow: 'hidden',
      backgroundColor: theme.bg1, alignItems: 'center', justifyContent: 'center', position: 'relative',
    }}>
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: theme.bg2, opacity: 0.45 }]} />
      {ic?.lib === 'svg'
        ? <View style={[{ width: '100%', height: '100%' }, svgBg]} />
        : ic?.lib === 'fa5'
          ? <FontAwesome5 name={ic.name as any} size={size * 0.4} color={theme.textColor} brand />
          : ic?.lib === 'mci'
            ? <MaterialCommunityIcons name={ic.name as any} size={size * 0.4} color={theme.textColor} />
            : <Text style={{ color: theme.textColor, fontSize: 22, fontWeight: '800' }}>{pool.brand[0]}</Text>
      }
    </View>
  )
}

export default function SuccessWeb() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const pool = POOLS.find(p => p.id === Number(id))
  const scale = useRef(new Animated.Value(0)).current
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.sequence([
      Animated.delay(150),
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 70, friction: 5 }),
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
    ]).start()
  }, [])

  const entryNum = `E-${2000 + (pool?.id ?? 0)}`
  const closesDate = pool ? `Closes in ${pool.time}` : 'Soon'
  const odds = pool ? `1 in ${pool.total - pool.entries + 1}` : '1 in N'
  const fee = pool ? pool.price.toFixed(2) : '0.00'

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <View style={s.topNav}>
        <View style={s.topNavInner}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '900' }}>●</Text>
            <Text style={s.brandName}>Tick Pick</Text>
          </View>
        </View>
      </View>

      <View style={s.page}>
        <Animated.View style={[s.checkWrap, { transform: [{ scale }], opacity }]}>
          <View style={s.checkCircle}>
            <Text style={{ fontSize: 40, color: '#10B981' }}>✓</Text>
          </View>
        </Animated.View>

        <Text style={s.heading}>You're in! 🎉</Text>
        <Text style={s.sub}>Your entry has been confirmed and verified.</Text>

        <View style={s.card}>
          <Text style={s.cardTitle}>Entry Details</Text>
          {pool && (
            <View style={s.prizeRow}>
              <MiniGiftCard pool={pool} size={96} />
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={s.prizeLabel}>{pool.prize}</Text>
                <Text style={s.prizeBrand}>{pool.brand} · {pool.tier} Pool</Text>
              </View>
            </View>
          )}

          <View style={s.detailsTable}>
            <View style={s.detailRow}>
              <Text style={s.detailKey}>Entry #</Text>
              <Text style={s.detailVal}>{entryNum}</Text>
            </View>
            <View style={s.detailRow}>
              <Text style={s.detailKey}>Draw closes</Text>
              <Text style={s.detailVal}>{closesDate}</Text>
            </View>
            <View style={s.detailRow}>
              <Text style={s.detailKey}>Your odds</Text>
              <Text style={[s.detailVal, { color: Colors.primary }]}>{odds}</Text>
            </View>
            <View style={s.detailRow}>
              <Text style={s.detailKey}>Amount paid</Text>
              <Text style={s.detailVal}>${fee}</Text>
            </View>
          </View>
        </View>

        <View style={s.verifyCard}>
          <Text style={{ fontSize: 18, marginRight: 12 }}>🔒</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.verifyTitle}>RANDOM.ORG Verified</Text>
            <Text style={s.verifyDesc}>The winner will be picked using tamper-proof randomness. You'll be notified by email.</Text>
          </View>
        </View>

        <View style={s.ctaRow}>
          <TouchableOpacity style={s.secondaryBtn} onPress={() => router.push('/')}>
            <Text style={s.secondaryBtnText}>Enter Another Competition</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.primaryBtn} onPress={() => router.push('/entries')}>
            <Text style={s.primaryBtnText}>Watch Progress →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  topNav: { backgroundColor: Colors.primary },
  topNavInner: { maxWidth: 1280, width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 32, paddingVertical: 14 },
  brandName: { fontSize: 18, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.4 },
  page: { maxWidth: 640, width: '100%', alignSelf: 'center', paddingHorizontal: 24, paddingTop: 48, paddingBottom: 60, alignItems: 'center' },
  checkWrap: { marginBottom: 18 },
  checkCircle: { width: 84, height: 84, borderRadius: 42, backgroundColor: '#D1FAE5', borderWidth: 3, borderColor: '#A7F3D0', alignItems: 'center', justifyContent: 'center' },
  heading: { fontSize: 28, fontWeight: '900', color: Colors.text, marginBottom: 6, textAlign: 'center', letterSpacing: -0.5 },
  sub: { fontSize: 14, color: Colors.textSec, textAlign: 'center', marginBottom: 28, lineHeight: 20 },
  card: { width: '100%', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: Colors.border, borderRadius: 14, padding: 22, marginBottom: 16 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: Colors.text, marginBottom: 14 },
  prizeRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primaryLight, borderRadius: 12, padding: 14 },
  prizeLabel: { fontSize: 15, fontWeight: '800', color: Colors.primary, marginBottom: 2 },
  prizeBrand: { fontSize: 11, color: Colors.textSec, fontWeight: '600', letterSpacing: 0.3 },
  detailsTable: { marginTop: 14, gap: 10 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  detailKey: { fontSize: 13, color: Colors.textSec, fontWeight: '500' },
  detailVal: { fontSize: 13, fontWeight: '700', color: Colors.text },
  verifyCard: { width: '100%', backgroundColor: Colors.primaryLight, borderRadius: 12, padding: 14, flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24 },
  verifyTitle: { fontSize: 13, fontWeight: '800', color: Colors.primary, marginBottom: 3 },
  verifyDesc: { fontSize: 12, color: Colors.textSec, lineHeight: 17 },
  ctaRow: { width: '100%', flexDirection: 'row', gap: 12 },
  primaryBtn: { flex: 1, backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  primaryBtnText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  secondaryBtn: { flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: Colors.border, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  secondaryBtnText: { fontSize: 14, fontWeight: '700', color: Colors.textSec },
})
