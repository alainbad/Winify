import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { Colors } from '@/constants/theme'
import { POOLS } from '@/lib/data'

const MY_ENTRIES = [POOLS[3], POOLS[4], POOLS[1]]

function EntryCard({ pool }: { pool: typeof POOLS[0] }) {
  return (
    <View style={styles.entryCard}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <View style={[styles.emojiBox, { backgroundColor: pool.accentBg }]}>
          <Text style={{ fontSize: 24 }}>{pool.emoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.entryPrize} numberOfLines={1}>{pool.prize}</Text>
          <Text style={styles.entryMeta}>Entry #E-{1000 + pool.id} · ${pool.price} paid</Text>
        </View>
        <View style={styles.activeBadge}>
          <View style={styles.activeDot} />
          <Text style={styles.activeText}>Active</Text>
        </View>
      </View>
      <View style={{ marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
          <Text style={styles.progressLabel}>{pool.entries}/{pool.total} entries · closes in {pool.time}</Text>
          <Text style={styles.progressLabel}>{pool.pct}%</Text>
        </View>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${pool.pct}%` as any, backgroundColor: pool.pct > 70 ? Colors.red : pool.accent }]} />
        </View>
      </View>
      <View style={styles.randomNote}>
        <Text style={styles.randomNoteText}>🔒 Draw verified by RANDOM.ORG — tamper-proof</Text>
      </View>
      <TouchableOpacity style={styles.simulateBtn} onPress={() => router.push('/winner-reveal')}>
        <Text style={styles.simulateBtnText}>Simulate Draw →</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function EntriesScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <View style={styles.header}>
        <Text style={styles.title}>My Entries</Text>
        <Text style={styles.subtitle}>{MY_ENTRIES.length} active competitions</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}>
        <View style={{ gap: 12, marginBottom: 20 }}>
          {MY_ENTRIES.map(p => <EntryCard key={p.id} pool={p} />)}
        </View>

        {/* Postal Entry Card */}
        <View style={styles.postalCard}>
          <Text style={{ fontSize: 28, marginBottom: 8 }}>✉️</Text>
          <Text style={styles.postalTitle}>Free Postal Entry</Text>
          <Text style={styles.postalDesc}>
            You can enter any competition for free by post. Hand-write your name, address, and competition name on a postcard and send to:
          </Text>
          <View style={styles.postalAddress}>
            <Text style={styles.postalAddressText}>Winify Competitions Ltd</Text>
            <Text style={styles.postalAddressText}>PO Box 1234</Text>
            <Text style={styles.postalAddressText}>London, EC1A 1BB</Text>
            <Text style={styles.postalAddressText}>United Kingdom</Text>
          </View>
          <Text style={styles.postalNote}>One entry per envelope. Must arrive before draw date.</Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingTop: 56, paddingBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', color: Colors.text },
  subtitle: { fontSize: 13, color: Colors.textSec, marginTop: 2 },
  entryCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 14 },
  emojiBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  entryPrize: { fontSize: 14, fontWeight: '700', color: Colors.text },
  entryMeta: { fontSize: 12, color: Colors.textSec, marginTop: 2 },
  activeBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.greenBg, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.green },
  activeText: { fontSize: 11, fontWeight: '700', color: Colors.green },
  progressLabel: { fontSize: 11, color: Colors.textSec, fontWeight: '500' },
  progressBg: { height: 6, backgroundColor: '#F0EBFF', borderRadius: 999 },
  progressFill: { height: '100%', borderRadius: 999 },
  randomNote: { backgroundColor: Colors.primaryLight, borderRadius: 8, padding: 8, marginBottom: 10 },
  randomNoteText: { fontSize: 11, color: Colors.primary, fontWeight: '500' },
  simulateBtn: { backgroundColor: Colors.primary, borderRadius: 999, padding: 11, alignItems: 'center' },
  simulateBtnText: { fontSize: 13, fontWeight: '700', color: 'white' },
  postalCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 18, alignItems: 'center' },
  postalTitle: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 8 },
  postalDesc: { fontSize: 13, color: Colors.textSec, textAlign: 'center', lineHeight: 19, marginBottom: 12 },
  postalAddress: { backgroundColor: Colors.primaryLight, borderRadius: 10, padding: 12, width: '100%', marginBottom: 10 },
  postalAddressText: { fontSize: 13, color: Colors.primary, fontWeight: '600', textAlign: 'center', lineHeight: 22 },
  postalNote: { fontSize: 11, color: Colors.muted, textAlign: 'center' },
})
