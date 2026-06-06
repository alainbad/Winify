import { View, Text, TouchableOpacity, StyleSheet, Animated, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useState, useRef, useEffect } from 'react'
import { Colors } from '@/constants/theme'
import { POOLS } from '@/lib/data'

type PayMethod = 'apple' | 'google' | 'card'
type State = 'idle' | 'loading' | 'done'

export default function PaymentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const pool = POOLS.find(p => p.id === Number(id))
  const [method, setMethod] = useState<PayMethod>('apple')
  const [agreed, setAgreed] = useState(false)
  const [state, setState] = useState<State>('idle')
  const spinnerOpacity = useRef(new Animated.Value(0)).current

  function handlePay() {
    if (!agreed) return
    setState('loading')
    Animated.timing(spinnerOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start()
    setTimeout(() => {
      router.push(`/competition/${id}/success`)
    }, 1800)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Complete Entry</Text>

      {/* Skill Gate Passed Badge */}
      <View style={styles.passedBadge}>
        <Text style={styles.passedText}>✓ Skill Gate Passed</Text>
      </View>

      {/* Order Summary */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Order Summary</Text>
        {pool && (
          <View style={styles.orderRow}>
            <Text style={{ fontSize: 24, marginRight: 10 }}>{pool.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.orderPrize} numberOfLines={1}>{pool.prize}</Text>
              <Text style={styles.orderMeta}>1 × entry · {pool.entries + 1}/{pool.total} entries</Text>
            </View>
            <Text style={styles.orderPrice}>$5.00</Text>
          </View>
        )}
        <View style={styles.orderDivider} />
        <View style={[styles.orderRow, { marginBottom: 0 }]}>
          <Text style={styles.orderTotal}>Total</Text>
          <Text style={[styles.orderPrice, { fontSize: 18, fontWeight: '800' }]}>$5.00</Text>
        </View>
      </View>

      {/* Payment Method */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Payment Method</Text>
        <View style={{ gap: 10 }}>
          <TouchableOpacity onPress={() => setMethod('apple')} style={[styles.methodBtn, method === 'apple' && styles.methodBtnActive]}>
            <Text style={{ fontSize: 20, marginRight: 10 }}>🍎</Text>
            <Text style={[styles.methodLabel, method === 'apple' && styles.methodLabelActive]}>Apple Pay</Text>
            {method === 'apple' && <View style={styles.methodCheck}><Text style={{ fontSize: 11, fontWeight: '800', color: Colors.primary }}>✓</Text></View>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMethod('google')} style={[styles.methodBtn, method === 'google' && styles.methodBtnActive]}>
            <Text style={{ fontSize: 20, marginRight: 10 }}>🇬</Text>
            <Text style={[styles.methodLabel, method === 'google' && styles.methodLabelActive]}>Google Pay</Text>
            {method === 'google' && <View style={styles.methodCheck}><Text style={{ fontSize: 11, fontWeight: '800', color: Colors.primary }}>✓</Text></View>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMethod('card')} style={[styles.methodBtn, method === 'card' && styles.methodBtnActive]}>
            <Text style={{ fontSize: 20, marginRight: 10 }}>💳</Text>
            <Text style={[styles.methodLabel, method === 'card' && styles.methodLabelActive]}>Credit / Debit Card</Text>
            {method === 'card' && <View style={styles.methodCheck}><Text style={{ fontSize: 11, fontWeight: '800', color: Colors.primary }}>✓</Text></View>}
          </TouchableOpacity>
        </View>
      </View>

      {/* Terms */}
      <TouchableOpacity onPress={() => setAgreed(a => !a)} style={styles.termsRow}>
        <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
          {agreed && <Text style={{ fontSize: 11, color: 'white', fontWeight: '800' }}>✓</Text>}
        </View>
        <Text style={styles.termsText}>I agree to the <Text style={{ color: Colors.primary, fontWeight: '700' }}>Terms & Conditions</Text> and am 18+</Text>
      </TouchableOpacity>

      {/* Pay Button */}
      <TouchableOpacity
        onPress={handlePay}
        style={[styles.payBtn, (!agreed || state === 'loading') && styles.payBtnDisabled]}
        disabled={!agreed || state === 'loading'}>
        {state === 'loading' ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={styles.payBtnText}>Confirm & Pay $5.00</Text>
        )}
      </TouchableOpacity>

      <View style={styles.sslNote}>
        <Text style={styles.sslText}>🔒 256-bit SSL encryption · Powered by Stripe</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, padding: 16, paddingTop: 60 },
  backBtn: { marginBottom: 12 },
  backText: { fontSize: 15, fontWeight: '600', color: Colors.primary },
  title: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 14 },
  passedBadge: { flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center', backgroundColor: Colors.greenBg, borderWidth: 1, borderColor: Colors.greenLight, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 16 },
  passedText: { fontSize: 13, fontWeight: '700', color: Colors.green },
  card: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 16, marginBottom: 14 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: Colors.text, marginBottom: 12 },
  orderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  orderPrize: { fontSize: 14, fontWeight: '700', color: Colors.text },
  orderMeta: { fontSize: 12, color: Colors.textSec, marginTop: 2 },
  orderPrice: { fontSize: 15, fontWeight: '700', color: Colors.text },
  orderDivider: { height: 1, backgroundColor: Colors.border, marginVertical: 10 },
  orderTotal: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.textSec },
  methodBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border, borderRadius: 12, padding: 14 },
  methodBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  methodLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.textSec },
  methodLabelActive: { color: Colors.primary },
  methodCheck: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  termsRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  termsText: { flex: 1, fontSize: 13, color: Colors.textSec, lineHeight: 18 },
  payBtn: { backgroundColor: Colors.primary, borderRadius: 999, padding: 16, alignItems: 'center', marginBottom: 12 },
  payBtnDisabled: { opacity: 0.5 },
  payBtnText: { fontSize: 16, fontWeight: '700', color: 'white' },
  sslNote: { alignItems: 'center' },
  sslText: { fontSize: 11, color: Colors.muted },
})
