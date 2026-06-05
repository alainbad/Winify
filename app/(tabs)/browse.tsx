import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import { useState } from 'react'
import { router } from 'expo-router'
import { Colors } from '@/constants/theme'
import { POOLS, Pool } from '@/lib/data'

type Filter = 'All' | 'MICRO' | 'VOLUME' | 'MEGA'

function CompactCard({ pool }: { pool: Pool }) {
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
          {pool.hot && <View style={styles.hotBadge}><Text style={styles.hotText}>HOT 🔥</Text></View>}
        </View>
        <Text style={styles.compactTitle} numberOfLines={1}>{pool.prize}</Text>
        <View style={styles.compactProgressBg}>
          <View style={[styles.compactProgressFill, { width: `${pool.pct}%` as any, backgroundColor: pool.pct > 70 ? Colors.red : pool.accent }]} />
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

export default function BrowseScreen() {
  const [filter, setFilter] = useState<Filter>('All')
  const filtered = filter === 'All' ? POOLS : POOLS.filter(p => p.tier === filter)
  const tabs: Filter[] = ['All', 'MICRO', 'VOLUME', 'MEGA']

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <View style={styles.header}>
        <Text style={styles.title}>Browse</Text>
      </View>
      <View style={styles.searchBar}>
        <Text style={{ fontSize: 16, color: Colors.muted }}>🔍</Text>
        <TextInput placeholder="Search competitions..." placeholderTextColor={Colors.muted}
          style={styles.searchInput} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 16, marginBottom: 12, maxHeight: 44 }} contentContainerStyle={{ gap: 8, alignItems: 'center' }}>
        {tabs.map(t => (
          <TouchableOpacity key={t} onPress={() => setFilter(t)} style={[styles.filterTab, filter === t && styles.filterTabActive]}>
            <Text style={[styles.filterTabText, filter === t && styles.filterTabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 20 }}>
        {filtered.map(p => <CompactCard key={p.id} pool={p} />)}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingTop: 56, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '800', color: Colors.text },
  searchBar: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 14, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text },
  filterTab: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 7 },
  filterTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterTabText: { fontSize: 13, fontWeight: '600', color: Colors.textSec },
  filterTabTextActive: { color: 'white' },
  compactCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 12 },
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
})
