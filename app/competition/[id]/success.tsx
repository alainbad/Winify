import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useEffect, useRef } from 'react'
import { Colors } from '@/constants/theme'
import { POOLS } from '@/lib/data'

export default function SuccessScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const pool = POOLS.find(p => p.id === Number(id))
  const scale = useRef(new Animated.Value(0)).current
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 70, friction: 5 }),
        Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
    ]).start()
  }, [])

  const entryNum = `E-${2000 + (pool?.id ?? 0)}`
  const closesDate = pool ? `Closes in ${pool.time}` : 'Soon'
  const odds = pool ? `1 in ${pool.total - pool.entries + 1}` : '1 in N'

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.checkWrap, { transform: [{ scale }], opacity }]}>
        <View style={styles.checkCircle}>
          <Text style={{ fontSize: 48 }}>✓</Text>
        </View>
      </Animated.View>

      <Text style={styles.heading}>You're in! 🎉</Text>
      <Text style={styles.sub}>Your entry has been confirmed and verified.</Text>

      {/* Entry Details */}
      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>Entry Details</Text>
        {pool && (
          <View style={styles.prizeRow}>
            <Text style={{ fontSize: 28, marginRight: 12 }}>{pool.emoji}</Text>
            <Text style={styles.prizeLabel}>{pool.prize}</Text>
          </View>
        )}
        <View style={{ gap: 10, marginTop: 12 }}>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Entry #</Text>
            <Text style={styles.detailVal}>{entryNum}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Draw closes</Text>
            <Text style={styles.detailVal}>{closesDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Your odds</Text>
            <Text style={[styles.detailVal, { color: Colors.primary }]}>{odds}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Amount paid</Text>
            <Text style={styles.detailVal}>$2.00</Text>
          </View>
        </View>
      </View>

      {/* Verification */}
      <View style={styles.verifyCard}>
        <Text style={{ fontSize: 20, marginRight: 10 }}>🔒</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.verifyTitle}>RANDOM.ORG Verified</Text>
          <Text style={styles.verifyDesc}>The winner will be picked using tamper-proof randomness. You'll be notified by email.</Text>
        </View>
      </View>

      {/* CTAs */}
      <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/(tabs)/entries')}>
        <Text style={styles.primaryBtnText}>Watch Progress →</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/(tabs)')}>
        <Text style={styles.secondaryBtnText}>Enter Another Competition</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, alignItems: 'center', padding: 24, paddingTop: 80 },
  checkWrap: { marginBottom: 20 },
  checkCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.greenBg, borderWidth: 3, borderColor: Colors.greenLight, alignItems: 'center', justifyContent: 'center' },
  heading: { fontSize: 28, fontWeight: '800', color: Colors.text, marginBottom: 6, textAlign: 'center' },
  sub: { fontSize: 14, color: Colors.textSec, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  detailsCard: { width: '100%', backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 16, marginBottom: 14 },
  detailsTitle: { fontSize: 14, fontWeight: '800', color: Colors.text, marginBottom: 12 },
  prizeRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primaryLight, borderRadius: 12, padding: 12 },
  prizeLabel: { flex: 1, fontSize: 15, fontWeight: '700', color: Colors.primary },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailKey: { fontSize: 13, color: Colors.textSec, fontWeight: '500' },
  detailVal: { fontSize: 13, fontWeight: '700', color: Colors.text },
  verifyCard: { width: '100%', backgroundColor: Colors.primaryLight, borderWidth: 1, borderColor: Colors.border, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24 },
  verifyTitle: { fontSize: 13, fontWeight: '700', color: Colors.primary, marginBottom: 3 },
  verifyDesc: { fontSize: 12, color: Colors.textSec, lineHeight: 17 },
  primaryBtn: { width: '100%', backgroundColor: Colors.primary, borderRadius: 999, padding: 16, alignItems: 'center', marginBottom: 12 },
  primaryBtnText: { fontSize: 15, fontWeight: '700', color: 'white' },
  secondaryBtn: { width: '100%', backgroundColor: Colors.card, borderWidth: 1.5, borderColor: Colors.border, borderRadius: 999, padding: 16, alignItems: 'center' },
  secondaryBtnText: { fontSize: 15, fontWeight: '600', color: Colors.textSec },
})
