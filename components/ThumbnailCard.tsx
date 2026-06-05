import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { Colors } from '@/constants/theme'
import { Pool } from '@/lib/data'

function isLight(hex: string) {
  const c = hex.replace('#', '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 170
}

export function ThumbnailCard({ pool }: { pool: Pool }) {
  const sold = pool.pct
  const isUrgent = sold > 70
  const onLight = isLight(pool.bgColor)
  const fg = onLight ? '#1A1A1A' : '#FFFFFF'

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push(`/competition/${pool.id}`)}
      style={styles.card}
    >
      <View style={[styles.thumb, { backgroundColor: pool.bgColor, borderBottomWidth: onLight ? 1 : 0, borderBottomColor: Colors.border }]}>
        <Text style={styles.emoji}>{pool.emoji}</Text>
        <Text style={[styles.brand, { color: fg }]} numberOfLines={1}>{pool.brand}</Text>
        <View style={styles.timePill}>
          <Text style={styles.timePillText}>⏱ {pool.time}</Text>
        </View>
        {pool.hot && (
          <View style={styles.hotPill}>
            <Text style={styles.hotPillText}>HOT 🔥</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>{pool.prize}</Text>

        <View style={styles.pricePill}>
          <Text style={styles.pricePillText}>${pool.price.toFixed(2)}</Text>
        </View>

        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${sold}%` as any, backgroundColor: isUrgent ? Colors.red : Colors.primary }]} />
        </View>
        <Text style={styles.sold}>{sold}% sold</Text>

        <TouchableOpacity
          style={styles.playBtn}
          onPress={() => router.push(`/competition/${pool.id}`)}
        >
          <Text style={styles.playBtnText}>Play Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  thumb: {
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    gap: 6,
  },
  emoji: { fontSize: 56 },
  brand: { fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  timePill: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  timePillText: { color: 'white', fontSize: 10, fontWeight: '700' },
  hotPill: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFF7ED',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  hotPillText: { color: '#EA580C', fontSize: 10, fontWeight: '800' },
  body: { padding: 12, gap: 8 },
  title: { fontSize: 13, fontWeight: '700', color: Colors.text, lineHeight: 17, minHeight: 34 },
  pricePill: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  pricePillText: { color: Colors.primary, fontSize: 12, fontWeight: '800' },
  progressBg: { height: 4, backgroundColor: '#F0EBFF', borderRadius: 999, marginTop: 2 },
  progressFill: { height: '100%', borderRadius: 999 },
  sold: { fontSize: 11, color: Colors.primary, fontWeight: '700' },
  playBtn: {
    marginTop: 4,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 999,
    paddingVertical: 8,
    alignItems: 'center',
  },
  playBtnText: { color: Colors.primary, fontSize: 13, fontWeight: '700' },
})
