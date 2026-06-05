import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/theme'
import { POOLS, Pool } from '@/lib/data'

type CardTheme = {
  bg1: string; bg2: string; textColor: string;
  icon?: { lib: 'fa5' | 'mci' | 'svg'; name: string; size?: number; svgUrl?: string }
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

const FAKE_ENTRANTS = ['j***n', 'm***e', 's***h', 'r***a', 'k***l']

function GiftCard({ pool, size }: { pool: Pool; size: number }) {
  const theme = CARD_THEMES[pool.brand] ?? { bg1: pool.bgColor, bg2: pool.bgColor, textColor: '#FFFFFF' }
  const ic = theme.icon
  const iconSize = Math.round(size * 0.36)
  const svgBg = ic?.lib === 'svg' && ic.svgUrl ? {
    backgroundImage: `url(${ic.svgUrl})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundSize: '70% 70%',
  } as any : {}
  return (
    <View style={{
      width: size, height: size * 0.63, borderRadius: 16, overflow: 'hidden',
      backgroundColor: theme.bg1, position: 'relative',
      alignItems: 'center', justifyContent: 'center',
      shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 24, shadowOffset: { width: 0, height: 8 },
    }}>
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: theme.bg2, opacity: 0.45 }]} />
      <View style={{ position: 'absolute', width: size * 0.6, height: size * 0.6, borderRadius: size * 0.3, backgroundColor: 'rgba(255,255,255,0.08)', top: -size * 0.15, right: -size * 0.15 }} />
      <View style={{ position: 'absolute', width: size * 0.4, height: size * 0.4, borderRadius: size * 0.2, backgroundColor: 'rgba(255,255,255,0.05)', bottom: -size * 0.1, left: -size * 0.1 }} />
      {ic?.lib === 'svg'
        ? <View style={[{ width: '70%', height: '60%' }, svgBg]} />
        : (
          <View style={{ marginBottom: 10 }}>
            {ic?.lib === 'fa5' && <FontAwesome5 name={ic.name as any} size={iconSize} color={theme.textColor} brand />}
            {ic?.lib === 'mci' && <MaterialCommunityIcons name={ic.name as any} size={iconSize} color={theme.textColor} />}
          </View>
        )
      }
      <Text style={{ position: 'absolute', bottom: 18, left: 18, color: theme.textColor, fontSize: 14, fontWeight: '800', letterSpacing: 0.5 }}>{pool.brand}</Text>
      <View style={{ position: 'absolute', bottom: 18, right: 18, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 }}>
        <Text style={{ fontSize: 9, fontWeight: '800', color: 'rgba(255,255,255,0.95)', letterSpacing: 1.5 }}>GIFT CARD</Text>
      </View>
    </View>
  )
}

export default function CompetitionDetailWeb() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const pool = POOLS.find(p => p.id === Number(id))

  if (!pool) {
    return (
      <View style={s.notFound}>
        <Text style={{ fontSize: 15, color: Colors.textSec }}>Competition not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12 }}>
          <Text style={{ color: Colors.primary, fontWeight: '700' }}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const isUrgent = pool.pct > 70
  const accent = pool.accent

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      {/* Top nav */}
      <View style={s.topNav}>
        <View style={s.topNavInner}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={s.backLink}>← Back to competitions</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={s.brandDot}>●</Text>
            <Text style={s.brandName}>Winify</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={s.page}>
          {/* Hero: two columns */}
          <View style={s.hero}>
            <View style={s.heroLeft}>
              <GiftCard pool={pool} size={360} />
            </View>
            <View style={s.heroRight}>
              <View style={[s.tierPill, { backgroundColor: pool.accentBg }]}>
                <Text style={[s.tierPillText, { color: accent }]}>{pool.tier} POOL</Text>
              </View>
              <Text style={s.title}>{pool.prize}</Text>
              <Text style={s.desc}>{pool.desc}</Text>

              {/* Stats */}
              <View style={s.statsRow}>
                <View style={s.stat}>
                  <Text style={s.statValue}>${pool.price}</Text>
                  <Text style={s.statLabel}>Entry Price</Text>
                </View>
                <View style={s.statDivider} />
                <View style={s.stat}>
                  <Text style={s.statValue}>{pool.total.toLocaleString()}</Text>
                  <Text style={s.statLabel}>Pool Size</Text>
                </View>
                <View style={s.statDivider} />
                <View style={s.stat}>
                  <Text style={s.statValue}>{pool.time}</Text>
                  <Text style={s.statLabel}>Closes In</Text>
                </View>
              </View>

              {/* Progress */}
              <View style={s.progressBlock}>
                <View style={s.progressHead}>
                  <Text style={s.progressLabel}>{pool.entries} of {pool.total} entries filled</Text>
                  <Text style={[s.progressPct, { color: isUrgent ? Colors.red : accent }]}>{pool.pct}%</Text>
                </View>
                <View style={s.progressBg}>
                  <View style={[s.progressFill, { width: `${pool.pct}%` as any, backgroundColor: isUrgent ? Colors.red : accent }]} />
                </View>
                {pool.hot && (
                  <Text style={s.urgent}>🔥 Filling fast — {pool.total - pool.entries} spots left</Text>
                )}
              </View>

              {/* CTA */}
              <TouchableOpacity
                style={[s.cta, { backgroundColor: accent }]}
                onPress={() => router.push(`/competition/${pool.id}/skill-gate`)}
              >
                <Text style={s.ctaText}>Enter for ${pool.price} →</Text>
              </TouchableOpacity>
              <Text style={s.ctaNote}>🔒 Secure checkout · RANDOM.ORG verified draw</Text>
            </View>
          </View>

          {/* Two-column info section */}
          <View style={s.infoGrid}>
            <View style={s.infoCard}>
              <Text style={s.infoTitle}>How It Works</Text>
              {[
                { n: 1, t: 'Answer a skill question', d: 'A simple question to confirm you\'re a real person.' },
                { n: 2, t: `Pay the $${pool.price} entry fee`, d: 'Secure payment via Apple Pay or card.' },
                { n: 3, t: 'Wait for the draw', d: `Pool closes in ${pool.time} when all ${pool.total} spots fill.` },
                { n: 4, t: 'Winner picked by RANDOM.ORG', d: 'Tamper-proof, independently verified draw.' },
              ].map(step => (
                <View key={step.n} style={s.step}>
                  <View style={[s.stepNum, { backgroundColor: pool.accentBg }]}>
                    <Text style={[s.stepNumText, { color: accent }]}>{step.n}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.stepTitle}>{step.t}</Text>
                    <Text style={s.stepDesc}>{step.d}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={s.infoCard}>
              <Text style={s.infoTitle}>Recent Entrants</Text>
              {FAKE_ENTRANTS.map((name, i) => (
                <View key={i} style={s.entrantRow}>
                  <View style={[s.entrantAvatar, { backgroundColor: pool.accentBg }]}>
                    <Text style={{ fontSize: 11, fontWeight: '800', color: accent }}>{name[0].toUpperCase()}</Text>
                  </View>
                  <Text style={s.entrantName}>{name}</Text>
                  <Text style={s.entrantTime}>{(i + 1) * 3} min ago</Text>
                </View>
              ))}
              <View style={s.trustBox}>
                <Text style={s.trustTitle}>✓ Verified Draw</Text>
                <Text style={s.trustDesc}>Winners are selected using RANDOM.ORG's tamper-proof randomness, independently audited.</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA' },
  topNav: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: Colors.border },
  topNavInner: { maxWidth: 1200, width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 14 },
  backLink: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  brandDot: { color: Colors.primary, fontSize: 14 },
  brandName: { fontSize: 14, fontWeight: '800', color: Colors.text, letterSpacing: -0.3 },
  page: { maxWidth: 1100, width: '100%', alignSelf: 'center', paddingHorizontal: 24, paddingTop: 32 },
  hero: { flexDirection: 'row', gap: 40, alignItems: 'flex-start', marginBottom: 28 },
  heroLeft: { width: 360 },
  heroRight: { flex: 1, paddingTop: 8 },
  tierPill: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 12 },
  tierPillText: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  title: { fontSize: 30, fontWeight: '800', color: Colors.text, letterSpacing: -0.8, lineHeight: 36, marginBottom: 8 },
  desc: { fontSize: 14, color: Colors.textSec, lineHeight: 20, marginBottom: 22 },
  statsRow: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: Colors.border, borderRadius: 12, marginBottom: 16, paddingVertical: 12 },
  stat: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: Colors.border, marginVertical: 4 },
  statValue: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 2 },
  statLabel: { fontSize: 10, fontWeight: '600', color: Colors.textSec, letterSpacing: 0.3, textTransform: 'uppercase' },
  progressBlock: { marginBottom: 18 },
  progressHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 12, color: Colors.textSec, fontWeight: '500' },
  progressPct: { fontSize: 12, fontWeight: '800' },
  progressBg: { height: 6, backgroundColor: '#F0EBFF', borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 999 },
  urgent: { fontSize: 11, color: '#EA580C', fontWeight: '600', marginTop: 8 },
  cta: { borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginBottom: 8 },
  ctaText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.2 },
  ctaNote: { fontSize: 11, color: Colors.muted, textAlign: 'center' },
  infoGrid: { flexDirection: 'row', gap: 20 },
  infoCard: { flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 20 },
  infoTitle: { fontSize: 14, fontWeight: '800', color: Colors.text, marginBottom: 14 },
  step: { flexDirection: 'row', gap: 12, marginBottom: 12, alignItems: 'flex-start' },
  stepNum: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  stepNumText: { fontSize: 11, fontWeight: '800' },
  stepTitle: { fontSize: 13, fontWeight: '700', color: Colors.text, marginBottom: 2 },
  stepDesc: { fontSize: 12, color: Colors.textSec, lineHeight: 17 },
  entrantRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  entrantAvatar: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  entrantName: { flex: 1, fontSize: 12, fontWeight: '600', color: Colors.text },
  entrantTime: { fontSize: 10, color: Colors.muted },
  trustBox: { marginTop: 14, padding: 12, backgroundColor: '#F0FDF4', borderRadius: 8, borderWidth: 1, borderColor: '#BBF7D0' },
  trustTitle: { fontSize: 12, fontWeight: '800', color: '#15803D', marginBottom: 4 },
  trustDesc: { fontSize: 11, color: '#166534', lineHeight: 15 },
})
