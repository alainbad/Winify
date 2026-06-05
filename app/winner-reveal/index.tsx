import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native'
import { router } from 'expo-router'
import { useEffect, useRef } from 'react'
import { Colors } from '@/constants/theme'

const { width: SW, height: SH } = Dimensions.get('window')
const PIECE_COUNT = 30
const COLORS = ['#6D28D9', '#F59E0B', '#059669', '#EF4444', '#2563EB', '#FF5A5F', '#A78BFA', '#FDE68A']

function Confetti() {
  const pieces = useRef(
    Array.from({ length: PIECE_COUNT }, (_, i) => ({
      x: Math.random() * SW,
      y: new Animated.Value(-20 - Math.random() * 100),
      rotate: new Animated.Value(0),
      color: COLORS[i % COLORS.length],
      size: 6 + Math.random() * 6,
      delay: Math.random() * 800,
    }))
  ).current

  useEffect(() => {
    pieces.forEach(p => {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.delay(p.delay),
            Animated.timing(p.y, { toValue: SH + 20, duration: 2500 + Math.random() * 1500, useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.delay(p.delay),
            Animated.timing(p.rotate, { toValue: 360 * 3, duration: 2500, useNativeDriver: true }),
          ]),
        ])
      ).start()
    })
  }, [])

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pieces.map((p, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            left: p.x,
            width: p.size,
            height: p.size,
            borderRadius: p.size / 4,
            backgroundColor: p.color,
            transform: [
              { translateY: p.y },
              { rotate: p.rotate.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] }) },
            ],
          }}
        />
      ))}
    </View>
  )
}

export default function WinnerRevealScreen() {
  const trophyScale = useRef(new Animated.Value(0)).current
  const contentOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.sequence([
      Animated.delay(400),
      Animated.parallel([
        Animated.spring(trophyScale, { toValue: 1, tension: 60, friction: 5, useNativeDriver: true }),
        Animated.timing(contentOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
    ]).start()
  }, [])

  return (
    <View style={styles.container}>
      <Confetti />

      <Animated.View style={{ opacity: contentOpacity, alignItems: 'center', width: '100%' }}>
        <Text style={styles.liveLabel}>🔴 LIVE DRAW</Text>

        <Animated.View style={{ transform: [{ scale: trophyScale }] }}>
          <Text style={{ fontSize: 88 }}>🏆</Text>
        </Animated.View>

        <Text style={styles.heading}>We have a winner!</Text>
        <Text style={styles.sub}>RANDOM.ORG has spoken</Text>

        {/* Winner Card */}
        <View style={styles.winnerCard}>
          <View style={styles.winnerAvatar}>
            <Text style={{ fontSize: 28, fontWeight: '800', color: 'white' }}>j***n</Text>
          </View>
          <Text style={styles.winnerLabel}>j***n</Text>
          <Text style={styles.winnerPrize}>$50 Amazon Gift Card</Text>
          <View style={styles.entryBadge}>
            <Text style={styles.entryBadgeText}>Entry #E-2004 · 1 of 75</Text>
          </View>
        </View>

        {/* Verification */}
        <View style={styles.verifyCard}>
          <View style={styles.verifyRow}>
            <Text style={styles.verifyIcon}>✓</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.verifyTitle}>Verified by RANDOM.ORG</Text>
              <Text style={styles.verifyHash}>Seed: 0x4a2f...b7c1 · {new Date().toLocaleDateString()}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.nextBtn} onPress={() => router.push('/(tabs)')}>
          <Text style={styles.nextBtnText}>Enter Next Competition →</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 14 }}>
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Go back</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A0A2E', alignItems: 'center', justifyContent: 'center', padding: 24 },
  liveLabel: { fontSize: 12, fontWeight: '800', color: '#EF4444', letterSpacing: 2, marginBottom: 14 },
  heading: { fontSize: 28, fontWeight: '800', color: 'white', textAlign: 'center', marginTop: 10, marginBottom: 4 },
  sub: { fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 24 },
  winnerCard: { width: '100%', backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 18, padding: 24, alignItems: 'center', marginBottom: 14 },
  winnerAvatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  winnerLabel: { fontSize: 22, fontWeight: '800', color: 'white', marginBottom: 4 },
  winnerPrize: { fontSize: 16, color: Colors.gold, fontWeight: '700', marginBottom: 10 },
  entryBadge: { backgroundColor: 'rgba(109,40,217,0.3)', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 5 },
  entryBadgeText: { fontSize: 12, color: '#A78BFA', fontWeight: '600' },
  verifyCard: { width: '100%', backgroundColor: 'rgba(5,150,105,0.12)', borderWidth: 1, borderColor: 'rgba(5,150,105,0.3)', borderRadius: 14, padding: 14, marginBottom: 24 },
  verifyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  verifyIcon: { fontSize: 16, color: Colors.green, fontWeight: '800' },
  verifyTitle: { fontSize: 13, fontWeight: '700', color: Colors.green, marginBottom: 2 },
  verifyHash: { fontSize: 11, color: 'rgba(5,150,105,0.7)', fontFamily: 'monospace' },
  nextBtn: { width: '100%', backgroundColor: Colors.primary, borderRadius: 999, padding: 16, alignItems: 'center' },
  nextBtnText: { fontSize: 15, fontWeight: '700', color: 'white' },
})
