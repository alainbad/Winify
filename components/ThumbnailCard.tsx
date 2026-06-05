import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'
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

type BrandIconProps = { brand: string; color: string; size: number }

function BrandIcon({ brand, color, size }: BrandIconProps) {
  const fa5brands: Record<string, string> = {
    'Amazon': 'amazon',
    'Xbox': 'xbox',
    'Steam': 'steam',
    'Spotify': 'spotify',
    'PlayStation': 'playstation',
    'Microsoft': 'microsoft',
    'Apple': 'apple',
    'Google Play': 'google-play',
    'Airbnb': 'airbnb',
    'Uber Eats': 'uber',
    'Roblox': 'roblox',
  }
  const mci: Record<string, string> = {
    'Netflix': 'netflix',
    'Nintendo': 'nintendo-switch',
    'Disney+': 'disney-plus',
    'Starbucks': 'coffee-to-go',
    'Expedia': 'airplane',
    'Booking.com': 'bed',
  }
  if (fa5brands[brand]) {
    return <FontAwesome5 name={fa5brands[brand] as any} size={size} color={color} brand />
  }
  if (mci[brand]) {
    return <MaterialCommunityIcons name={mci[brand] as any} size={size} color={color} />
  }
  return <Text style={{ fontSize: size * 0.9, fontWeight: '900', color }}>{brand[0]}</Text>
}

export function ThumbnailCard({ pool }: { pool: Pool }) {
  const sold = pool.pct
  const isUrgent = sold > 70
  const light = isLight(pool.bgColor)
  const iconColor = light ? '#111111' : '#FFFFFF'

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push(`/competition/${pool.id}`)}
      style={styles.card}
    >
      <View style={[styles.thumb, { backgroundColor: pool.bgColor }]}>
        <BrandIcon brand={pool.brand} color={iconColor} size={64} />

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

        <TouchableOpacity style={styles.playBtn} onPress={() => router.push(`/competition/${pool.id}`)}>
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
  },
  timePill: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3,
  },
  timePillText: { color: 'white', fontSize: 10, fontWeight: '700' },
  hotPill: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: '#FFF7ED',
    borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3,
  },
  hotPillText: { color: '#EA580C', fontSize: 10, fontWeight: '800' },
  body: { padding: 12, gap: 8 },
  title: { fontSize: 13, fontWeight: '700', color: Colors.text, lineHeight: 17, minHeight: 34 },
  pricePill: {
    alignSelf: 'flex-start', backgroundColor: Colors.primaryLight,
    borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3,
  },
  pricePillText: { color: Colors.primary, fontSize: 12, fontWeight: '800' },
  progressBg: { height: 4, backgroundColor: '#F0EBFF', borderRadius: 999, marginTop: 2 },
  progressFill: { height: '100%', borderRadius: 999 },
  sold: { fontSize: 11, color: Colors.primary, fontWeight: '700' },
  playBtn: {
    marginTop: 4, borderWidth: 1.5, borderColor: Colors.primary,
    borderRadius: 999, paddingVertical: 8, alignItems: 'center',
  },
  playBtnText: { color: Colors.primary, fontSize: 13, fontWeight: '700' },
})
