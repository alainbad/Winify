import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import { useState } from 'react'
import { Colors } from '@/constants/theme'
import { POOLS } from '@/lib/data'
import { ThumbnailCard } from '@/components/ThumbnailCard'

type Filter = 'All' | 'MICRO' | 'VOLUME' | 'MEGA'

export default function BrowseScreen() {
  const [filter, setFilter] = useState<Filter>('All')
  const [query, setQuery] = useState('')
  const tabs: Filter[] = ['All', 'MICRO', 'VOLUME', 'MEGA']

  const filtered = POOLS.filter(p => {
    if (filter !== 'All' && p.tier !== filter) return false
    if (query && !p.prize.toLowerCase().includes(query.toLowerCase()) && !p.brand.toLowerCase().includes(query.toLowerCase())) return false
    return true
  })

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ width: 32, height: 32, borderRadius: 9, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 16 }}>⭐</Text>
          </View>
          <Text style={styles.title}><Text style={{ color: Colors.primary }}>Tick</Text><Text style={{ color: '#F59E0B' }}>Pick</Text></Text>
        </View>
      </View>
      <View style={styles.searchBar}>
        <Text style={{ fontSize: 16, color: Colors.muted }}>🔍</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search competitions..."
          placeholderTextColor={Colors.muted}
          style={styles.searchInput}
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 16, marginBottom: 12, maxHeight: 44 }} contentContainerStyle={{ gap: 8, alignItems: 'center' }}>
        {tabs.map(t => (
          <TouchableOpacity key={t} onPress={() => setFilter(t)} style={[styles.filterTab, filter === t && styles.filterTabActive]}>
            <Text style={[styles.filterTabText, filter === t && styles.filterTabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <Text style={styles.count}>{filtered.length} Results</Text>
        <View style={styles.grid}>
          {filtered.map(p => (
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
  header: { paddingHorizontal: 16, paddingTop: 56, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '800', color: Colors.text },
  searchBar: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 14, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text },
  filterTab: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 7 },
  filterTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterTabText: { fontSize: 13, fontWeight: '600', color: Colors.textSec },
  filterTabTextActive: { color: 'white' },
  count: { fontSize: 13, fontWeight: '600', color: Colors.textSec, paddingHorizontal: 16, marginBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
  gridItem: { width: '50%', padding: 4 },
})
