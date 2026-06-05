import { View, Text, ScrollView, TouchableOpacity, Animated, StyleSheet } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import { router } from 'expo-router'
import { Colors } from '@/constants/theme'
import { POOLS, RECENT_WINNERS, Pool } from '@/lib/data'
import { ThumbnailCard } from '@/components/ThumbnailCard'

function WinnerToast() {
  const [visible, setVisible] = useState(false)
  const [idx, setIdx] = useState(0)
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(8)).current

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(true)
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start()
    }, 1500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!visible) return
    const hide = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 8, duration: 200, useNativeDriver: true }),
      ]).start(() => {
        setIdx(i => (i + 1) % RECENT_WINNERS.length)
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
          ]).start()
        }, 500)
      })
    }, 5000)
    return () => clearTimeout(hide)
  }, [visible, idx])

  const w = RECENT_WINNERS[idx]
  return (
    <Animated.View style={[styles.toast, { opacity, transform: [{ translateY }] }]}>
      <Text style={{ fontSize: 20 }}>🎉</Text>
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.greenDark }}>{w.name} just won {w.prize}</Text>
        <Text style={{ fontSize: 11, color: Colors.green }}>{w.timeAgo}</Text>
      </View>
    </Animated.View>
  )
}

function TrustStrip() {
  return (
    <View style={styles.trustStrip}>
      <View style={styles.trustItem}>
        <Text style={{ fontSize: 12, color: Colors.green }}>✓</Text>
        <Text style={[styles.trustText, { color: Colors.green }]}> Verified Fair Draw</Text>
      </View>
      <View style={styles.dividerV} />
      <View style={styles.trustItem}>
        <View style={styles.liveDot} />
        <Text style={styles.trustText}> RANDOM.ORG</Text>
      </View>
      <View style={styles.dividerV} />
      <Text style={styles.trustText}>● 38 live draws</Text>
    </View>
  )
}

function HeroCard({ pool }: { pool: Pool }) {
  return (
    <TouchableOpacity onPress={() => router.push(`/competition/${pool.id}`)} activeOpacity={0.9} style={styles.heroWrap}>
      <View style={styles.heroCard}>
        <View style={styles.heroCircle1} />
        <View style={styles.heroCircle2} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <View style={styles.featuredBadge}><Text style={styles.featuredText}>FEATURED POOL</Text></View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={styles.liveDotGreen} />
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>{pool.entries} entries</Text>
          </View>
        </View>
        <Text style={{ fontSize: 44, marginBottom: 4 }}>{pool.emoji}</Text>
        <Text style={styles.heroTitle}>{pool.prize}</Text>
        <Text style={styles.heroDesc}>{pool.desc}</Text>
        <View style={{ marginTop: 16, marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>Closes in {pool.time}</Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>{pool.entries}/{pool.total}</Text>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${pool.pct}%` as any }]} />
          </View>
        </View>
        <TouchableOpacity style={styles.heroCta} onPress={() => router.push(`/competition/${pool.id}`)}>
          <Text style={styles.heroCtaText}>Enter for ${pool.price} →</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

function CompactCard({ pool }: { pool: Pool }) {
  const isUrgent = pool.pct > 70
  return (
    <TouchableOpacity onPress={() => router.push(`/competition/${pool.id}`)} activeOpacity={0.85} style={styles.compactCard}>
      <View style={[styles.emojiBox, { backgroundColor: pool.accentBg }]}>
        <Text style={{ fontSize: 26 }}>{pool.emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 4 }}>
          <View style={[styles.tierBadge, { backgroundColor: pool.accentBg }]}>
            <Text style={[styles.tierText, { color: pool.accent }]}>{pool.tier}</Text>
          </View>
          {pool.hot && (
            <View style={styles.hotBadge}><Text style={styles.hotText}>HOT 🔥</Text></View>
          )}
        </View>
        <Text style={styles.compactTitle} numberOfLines={1}>{pool.prize}</Text>
        <View style={styles.compactProgressBg}>
          <View style={[styles.compactProgressFill, {
            width: `${pool.pct}%` as any,
            backgroundColor: isUrgent ? Colors.red : pool.accent,
          }]} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 }}>
          <Text style={styles.compactMeta}>{pool.entries}/{pool.total} entries</Text>
          <Text style={styles.compactMeta}>{pool.time}</Text>
        </View>
      </View>
      <View style={styles.priceBtn}><Text style={styles.priceBtnText}>${pool.price}</Text></View>
    </TouchableOpacity>
  )
}

type Filter = 'All' | 'MICRO' | 'VOLUME' | 'MEGA'

function FilterTabs({ active, onSelect }: { active: Filter; onSelect: (f: Filter) => void }) {
  const tabs: Filter[] = ['All', 'MICRO', 'VOLUME', 'MEGA']
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 16, marginBottom: 12 }} contentContainerStyle={{ gap: 8 }}>
      {tabs.map(t => (
        <TouchableOpacity key={t} onPress={() => onSelect(t)}
          style={[styles.filterTab, active === t && styles.filterTabActive]}>
          <Text style={[styles.filterTabText, active === t && styles.filterTabTextActive]}>{t}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

export default function HomeScreen() {
  const [filter, setFilter] = useState<Filter>('All')
  const featured = POOLS.find(p => p.featured)!
  const others = POOLS.filter(p => !p.featured && (filter === 'All' || p.tier === filter))

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <View style={styles.statusBar}>
        <Text style={styles.statusTime}>9:41</Text>
        <Text style={{ fontSize: 12, color: Colors.text }}>▊▊▊ WiFi 🔋</Text>
      </View>
      <View style={styles.navBar}>
        <Text style={styles.logo}>Winify</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={styles.creditsPill}>
            <Text style={{ fontSize: 14 }}>⚡</Text>
            <Text style={styles.creditsText}>5 credits</Text>
          </View>
          <View style={styles.avatar}><Text style={{ fontSize: 14, fontWeight: '700', color: 'white' }}>A</Text></View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <WinnerToast />
        <TrustStrip />

        <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
          <Text style={styles.sectionLabel}>🔥 Featured</Text>
        </View>
        <HeroCard pool={featured} />

        <FilterTabs active={filter} onSelect={setFilter} />

        <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
          <Text style={styles.sectionLabel}>All Competitions</Text>
        </View>
        <View style={styles.grid}>
          {others.map(p => (
            <View key={p.id} style={styles.gridItem}>
              <ThumbnailCard pool={p} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  statusBar: { height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: Colors.bg },
  statusTime: { fontSize: 15, fontWeight: '600', color: Colors.text },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10 },
  logo: { fontSize: 24, fontWeight: '800', color: Colors.primary, letterSpacing: -0.5 },
  creditsPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.goldBg, borderWidth: 1, borderColor: '#FDE68A', borderRadius: 999, paddingVertical: 5, paddingHorizontal: 12 },
  creditsText: { fontSize: 13, fontWeight: '700', color: Colors.goldDark },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  toast: { marginHorizontal: 16, marginBottom: 10, backgroundColor: Colors.greenBg, borderWidth: 1.5, borderColor: Colors.greenLight, borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  trustStrip: { marginHorizontal: 16, marginBottom: 12, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10 },
  trustItem: { flexDirection: 'row', alignItems: 'center' },
  trustText: { fontSize: 11, fontWeight: '600', color: Colors.textSec },
  dividerV: { width: 1, height: 14, backgroundColor: Colors.border },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.green },
  liveDotGreen: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4ADE80' },
  heroWrap: { marginHorizontal: 16, marginBottom: 14 },
  heroCard: { borderRadius: 22, padding: 20, paddingBottom: 24, overflow: 'hidden', position: 'relative', backgroundColor: Colors.primary, shadowColor: Colors.primary, shadowOpacity: 0.4, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 8 },
  heroCircle1: { position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.07)' },
  heroCircle2: { position: 'absolute', bottom: -60, left: -30, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.05)' },
  featuredBadge: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  featuredText: { fontSize: 10, fontWeight: '700', letterSpacing: 1, color: 'white' },
  heroTitle: { fontSize: 28, fontWeight: '800', color: 'white', letterSpacing: -0.5, lineHeight: 32, marginBottom: 6 },
  heroDesc: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '500' },
  progressBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 999 },
  progressFill: { height: '100%', backgroundColor: Colors.gold, borderRadius: 999 },
  heroCta: { backgroundColor: 'white', borderRadius: 999, padding: 14, alignItems: 'center' },
  heroCtaText: { fontSize: 15, fontWeight: '700', color: Colors.primary },
  compactCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  emojiBox: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  tierBadge: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  tierText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  hotBadge: { backgroundColor: '#FFF7ED', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  hotText: { fontSize: 10, fontWeight: '700', color: '#EA580C' },
  compactTitle: { fontSize: 13, fontWeight: '700', color: Colors.text, marginBottom: 5 },
  compactProgressBg: { height: 4, backgroundColor: '#F0EBFF', borderRadius: 999 },
  compactProgressFill: { height: '100%', borderRadius: 999 },
  compactMeta: { fontSize: 11, color: Colors.textSec, fontWeight: '500' },
  priceBtn: { backgroundColor: Colors.primaryLight, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  priceBtnText: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  sectionLabel: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  filterTab: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 7 },
  filterTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterTabText: { fontSize: 13, fontWeight: '600', color: Colors.textSec },
  filterTabTextActive: { color: 'white' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingBottom: 24 },
  gridItem: { width: '50%', padding: 4 },
})
