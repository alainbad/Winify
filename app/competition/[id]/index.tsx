import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { Colors } from '@/constants/theme'
import { POOLS } from '@/lib/data'

const FAKE_ENTRANTS = ['j***n', 'm***e', 's***h', 'r***a', 'k***l']

export default function CompetitionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const pool = POOLS.find(p => p.id === Number(id))

  if (!pool) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bg }}>
        <Text style={{ fontSize: 16, color: Colors.textSec }}>Competition not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: Colors.primary, fontWeight: '700' }}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      {/* Header */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero Section */}
        <View style={[styles.heroSection, { backgroundColor: pool.accentBg }]}>
          <Text style={{ fontSize: 72, marginBottom: 10 }}>{pool.emoji}</Text>
          <View style={[styles.tierBadge, { backgroundColor: pool.accent }]}>
            <Text style={styles.tierText}>{pool.tier} POOL</Text>
          </View>
          <Text style={styles.prizeTitle}>{pool.prize}</Text>
          <Text style={styles.prizeDesc}>{pool.desc}</Text>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${pool.price}</Text>
              <Text style={styles.statLabel}>Entry Price</Text>
            </View>
            <View style={[styles.statItem, styles.statDivider]}>
              <Text style={styles.statValue}>{pool.total}</Text>
              <Text style={styles.statLabel}>Pool Size</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{pool.time}</Text>
              <Text style={styles.statLabel}>Closes In</Text>
            </View>
          </View>

          {/* Progress */}
          <View style={styles.progressCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={styles.progressLabel}>{pool.entries} of {pool.total} entries filled</Text>
              <Text style={[styles.progressLabel, { color: pool.pct > 70 ? Colors.red : pool.accent, fontWeight: '700' }]}>{pool.pct}%</Text>
            </View>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${pool.pct}%` as any, backgroundColor: pool.pct > 70 ? Colors.red : pool.accent }]} />
            </View>
            {pool.hot && (
              <View style={styles.urgentNote}>
                <Text style={styles.urgentText}>🔥 Filling fast — {pool.total - pool.entries} spots left!</Text>
              </View>
            )}
          </View>

          {/* How It Works */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>How It Works</Text>
            {[
              { n: 1, t: 'Answer a skill question', d: 'A simple question to confirm you\'re a real person.' },
              { n: 2, t: 'Pay the $2 entry fee', d: 'Secure payment via Apple Pay or card.' },
              { n: 3, t: 'Wait for the draw', d: `Pool closes in ${pool.time} when all ${pool.total} spots fill.` },
              { n: 4, t: 'Winner picked by RANDOM.ORG', d: 'Tamper-proof, independently verified draw.' },
            ].map(s => (
              <View key={s.n} style={styles.step}>
                <View style={[styles.stepNum, { backgroundColor: pool.accentBg }]}>
                  <Text style={[styles.stepNumText, { color: pool.accent }]}>{s.n}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepTitle}>{s.t}</Text>
                  <Text style={styles.stepDesc}>{s.d}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Recent Entrants */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recent Entrants</Text>
            {FAKE_ENTRANTS.map((name, i) => (
              <View key={i} style={styles.entrantRow}>
                <View style={[styles.entrantAvatar, { backgroundColor: pool.accentBg }]}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: pool.accent }}>{name[0].toUpperCase()}</Text>
                </View>
                <Text style={styles.entrantName}>{name}</Text>
                <Text style={styles.entrantTime}>{(i + 1) * 3} min ago</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaBar}>
        <TouchableOpacity style={[styles.ctaBtn, { backgroundColor: pool.accent }]}
          onPress={() => router.push(`/competition/${pool.id}/skill-gate`)}>
          <Text style={styles.ctaBtnText}>Enter for ${pool.price} →</Text>
        </TouchableOpacity>
        <Text style={styles.ctaNote}>🔒 Secure · RANDOM.ORG verified draw</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  navBar: { paddingTop: 50, paddingHorizontal: 16, paddingBottom: 8, backgroundColor: Colors.bg },
  backBtn: { alignSelf: 'flex-start' },
  backText: { fontSize: 15, fontWeight: '600', color: Colors.primary },
  heroSection: { padding: 24, alignItems: 'center', paddingBottom: 30 },
  tierBadge: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 10 },
  tierText: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, color: 'white' },
  prizeTitle: { fontSize: 26, fontWeight: '800', color: Colors.text, textAlign: 'center', letterSpacing: -0.5, marginBottom: 8 },
  prizeDesc: { fontSize: 14, color: Colors.textSec, textAlign: 'center', lineHeight: 20 },
  statsGrid: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, flexDirection: 'row', marginBottom: 14 },
  statItem: { flex: 1, padding: 14, alignItems: 'center' },
  statDivider: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: Colors.border },
  statValue: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 2 },
  statLabel: { fontSize: 11, color: Colors.textSec, fontWeight: '600' },
  progressCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 14, marginBottom: 14 },
  progressLabel: { fontSize: 12, color: Colors.textSec, fontWeight: '500' },
  progressBg: { height: 8, backgroundColor: '#F0EBFF', borderRadius: 999 },
  progressFill: { height: '100%', borderRadius: 999 },
  urgentNote: { marginTop: 10, backgroundColor: '#FFF7ED', borderRadius: 8, padding: 8 },
  urgentText: { fontSize: 12, color: '#EA580C', fontWeight: '600' },
  card: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 16, marginBottom: 14 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: Colors.text, marginBottom: 14 },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
  stepNum: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  stepNumText: { fontSize: 13, fontWeight: '800' },
  stepTitle: { fontSize: 13, fontWeight: '700', color: Colors.text },
  stepDesc: { fontSize: 12, color: Colors.textSec, marginTop: 2, lineHeight: 17 },
  entrantRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  entrantAvatar: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  entrantName: { flex: 1, fontSize: 13, fontWeight: '600', color: Colors.text },
  entrantTime: { fontSize: 11, color: Colors.muted },
  ctaBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.card, borderTopWidth: 1, borderTopColor: Colors.border, padding: 16, paddingBottom: 30 },
  ctaBtn: { borderRadius: 999, padding: 16, alignItems: 'center', marginBottom: 8 },
  ctaBtnText: { fontSize: 16, fontWeight: '700', color: 'white' },
  ctaNote: { textAlign: 'center', fontSize: 11, color: Colors.muted },
})
