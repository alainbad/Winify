import React, { useState, useRef } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Animated, ActivityIndicator, TextInput } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/theme'
import { POOLS, Pool } from '@/lib/data'

type CardTheme = {
  bg1: string; bg2: string; textColor: string;
  icon?: { lib: 'fa5' | 'mci' | 'svg'; name: string; svgUrl?: string }
}

const CARD_THEMES: Record<string, CardTheme> = {
  'Amazon':      { bg1: '#FF9900', bg2: '#E47911', textColor: '#FFFFFF', icon: { lib: 'fa5', name: 'amazon' } },
  'Xbox':        { bg1: '#107C10', bg2: '#0A5A0A', textColor: '#FFFFFF', icon: { lib: 'fa5', name: 'xbox' } },
  'Netflix':     { bg1: '#141414', bg2: '#1A0000', textColor: '#E50914', icon: { lib: 'svg', name: 'netflix', svgUrl: 'https://cdn.simpleicons.org/netflix/E50914' } },
  'Steam':       { bg1: '#1B2838', bg2: '#2A475E', textColor: '#FFFFFF', icon: { lib: 'fa5', name: 'steam' } },
  'Spotify':     { bg1: '#191414', bg2: '#121212', textColor: '#1DB954', icon: { lib: 'fa5', name: 'spotify' } },
  'Roblox':      { bg1: '#FFFFFF', bg2: '#F0F0F0', textColor: '#E2231A', icon: { lib: 'svg', name: 'roblox', svgUrl: 'https://cdn.simpleicons.org/roblox/E2231A' } },
  'Google Play': { bg1: '#FFFFFF', bg2: '#F5F5F5', textColor: '#34A853', icon: { lib: 'svg', name: 'googleplay', svgUrl: 'https://cdn.simpleicons.org/googleplay/34A853' } },
  'Apple':       { bg1: '#1A1A1A', bg2: '#2D2D2D', textColor: '#FFFFFF', icon: { lib: 'fa5', name: 'apple' } },
  'Uber Eats':   { bg1: '#142328', bg2: '#06C167', textColor: '#FFFFFF', icon: { lib: 'svg', name: 'ubereats', svgUrl: 'https://cdn.simpleicons.org/ubereats/FFFFFF' } },
  'Starbucks':   { bg1: '#00704A', bg2: '#005F3E', textColor: '#FFFFFF', icon: { lib: 'svg', name: 'starbucks', svgUrl: 'https://cdn.simpleicons.org/starbucks/FFFFFF' } },
  'PlayStation': { bg1: '#003791', bg2: '#00287A', textColor: '#FFFFFF', icon: { lib: 'fa5', name: 'playstation' } },
  'Microsoft':   { bg1: '#0078D4', bg2: '#005BA1', textColor: '#FFFFFF', icon: { lib: 'fa5', name: 'microsoft' } },
  'Booking.com': { bg1: '#003580', bg2: '#002B6B', textColor: '#FFFFFF', icon: { lib: 'svg', name: 'bookingcom', svgUrl: 'https://cdn.simpleicons.org/bookingdotcom/FFFFFF' } },
  'Airbnb':      { bg1: '#FF5A5F', bg2: '#E0474C', textColor: '#FFFFFF', icon: { lib: 'fa5', name: 'airbnb' } },
  'Nintendo':    { bg1: '#E60012', bg2: '#C4000F', textColor: '#FFFFFF', icon: { lib: 'mci', name: 'nintendo-switch' } },
  'Disney+':     { bg1: '#0F1F5C', bg2: '#1A3080', textColor: '#FFFFFF', icon: { lib: 'svg', name: 'disneyplus', svgUrl: 'https://cdn.simpleicons.org/disneyplus/FFFFFF' } },
  'Expedia':     { bg1: '#00355F', bg2: '#00243F', textColor: '#FFC72C', icon: { lib: 'svg', name: 'expedia', svgUrl: 'https://cdn.simpleicons.org/expedia/FFC72C' } },
}

function MiniGiftCard({ pool }: { pool: Pool }) {
  const theme = CARD_THEMES[pool.brand] ?? { bg1: pool.bgColor, bg2: pool.bgColor, textColor: '#FFFFFF' }
  const ic = theme.icon
  const svgBg = ic?.lib === 'svg' && ic.svgUrl ? {
    backgroundImage: `url(${ic.svgUrl})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundSize: '65% 65%',
  } as any : {}
  return (
    <View style={{
      width: 64, height: 44, borderRadius: 6, overflow: 'hidden',
      backgroundColor: theme.bg1, alignItems: 'center', justifyContent: 'center',
    }}>
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: theme.bg2, opacity: 0.4 }]} />
      {ic?.lib === 'svg'
        ? <View style={[{ width: '100%', height: '100%' }, svgBg]} />
        : ic?.lib === 'fa5'
          ? <FontAwesome5 name={ic.name as any} size={22} color={theme.textColor} brand />
          : ic?.lib === 'mci'
            ? <MaterialCommunityIcons name={ic.name as any} size={22} color={theme.textColor} />
            : <Text style={{ color: theme.textColor, fontWeight: '800' }}>{pool.brand[0]}</Text>
      }
    </View>
  )
}

type PayMethod = 'apple' | 'google' | 'card'

export default function PaymentWeb() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const pool = POOLS.find(p => p.id === Number(id))
  const [method, setMethod] = useState<PayMethod>('apple')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [card, setCard] = useState({ number: '', exp: '', cvc: '', name: '' })

  if (!pool) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA' }}>
        <Text style={{ color: Colors.textSec }}>Competition not found.</Text>
      </View>
    )
  }

  function handlePay() {
    if (!agreed || loading) return
    setLoading(true)
    setTimeout(() => router.push(`/competition/${id}/success`), 1500)
  }

  const fee = pool.price.toFixed(2)

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <View style={s.topNav}>
        <View style={s.topNavInner}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={s.backLink}>← Back</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ color: Colors.primary, fontSize: 14 }}>●</Text>
            <Text style={s.brandName}>Winify</Text>
          </View>
        </View>
      </View>

      <View style={s.page}>
        <View style={s.header}>
          <Text style={s.title}>Complete your entry</Text>
          <View style={s.passedBadge}>
            <Text style={s.passedText}>✓ Skill Gate Passed</Text>
          </View>
        </View>

        <View style={s.grid}>
          {/* LEFT: Payment form */}
          <View style={s.left}>
            <View style={s.card}>
              <Text style={s.cardTitle}>Payment Method</Text>
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 18 }}>
                <TouchableOpacity onPress={() => setMethod('apple')} style={[s.methodTab, method === 'apple' && s.methodTabActive]}>
                  <FontAwesome5 name="apple-pay" size={28} color={method === 'apple' ? Colors.primary : Colors.textSec} brand />
                  <Text style={[s.methodTabLabel, method === 'apple' && { color: Colors.primary }]}>Apple Pay</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMethod('google')} style={[s.methodTab, method === 'google' && s.methodTabActive]}>
                  <FontAwesome5 name="google-pay" size={28} color={method === 'google' ? Colors.primary : Colors.textSec} brand />
                  <Text style={[s.methodTabLabel, method === 'google' && { color: Colors.primary }]}>Google Pay</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setMethod('card')} style={[s.methodTab, method === 'card' && s.methodTabActive]}>
                  <FontAwesome5 name="credit-card" size={20} color={method === 'card' ? Colors.primary : Colors.textSec} />
                  <Text style={[s.methodTabLabel, method === 'card' && { color: Colors.primary }]}>Card</Text>
                </TouchableOpacity>
              </View>

              {method === 'card' ? (
                <View style={{ gap: 12 }}>
                  <View>
                    <Text style={s.label}>Card number</Text>
                    <TextInput
                      style={s.input}
                      placeholder="1234 5678 9012 3456"
                      placeholderTextColor={Colors.muted}
                      value={card.number}
                      onChangeText={v => setCard(c => ({ ...c, number: v }))}
                    />
                  </View>
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.label}>Expiry</Text>
                      <TextInput style={s.input} placeholder="MM / YY" placeholderTextColor={Colors.muted}
                        value={card.exp} onChangeText={v => setCard(c => ({ ...c, exp: v }))} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.label}>CVC</Text>
                      <TextInput style={s.input} placeholder="123" placeholderTextColor={Colors.muted}
                        value={card.cvc} onChangeText={v => setCard(c => ({ ...c, cvc: v }))} />
                    </View>
                  </View>
                  <View>
                    <Text style={s.label}>Cardholder name</Text>
                    <TextInput style={s.input} placeholder="Full name" placeholderTextColor={Colors.muted}
                      value={card.name} onChangeText={v => setCard(c => ({ ...c, name: v }))} />
                  </View>
                </View>
              ) : method === 'apple' ? (
                <View style={s.applePayBox}>
                  <FontAwesome5 name="apple-pay" size={48} color="#111111" brand />
                  <Text style={s.applePayText}>You'll be prompted to confirm with Touch ID / Face ID after clicking Pay.</Text>
                </View>
              ) : (
                <View style={s.applePayBox}>
                  <FontAwesome5 name="google-pay" size={48} color="#1A73E8" brand />
                  <Text style={s.applePayText}>You'll be redirected to Google Pay to confirm payment after clicking Pay.</Text>
                </View>
              )}
            </View>

            <View style={s.card}>
              <Text style={s.cardTitle}>Billing & Terms</Text>
              <TouchableOpacity onPress={() => setAgreed(a => !a)} style={s.termsRow}>
                <View style={[s.checkbox, agreed && s.checkboxActive]}>
                  {agreed && <Text style={{ fontSize: 11, color: '#FFFFFF', fontWeight: '800' }}>✓</Text>}
                </View>
                <Text style={s.termsText}>
                  I agree to the <Text style={{ color: Colors.primary, fontWeight: '700' }}>Terms & Conditions</Text>, confirm I am 18+, and understand entries are final.
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* RIGHT: Summary */}
          <View style={s.right}>
            <View style={s.summaryCard}>
              <Text style={s.cardTitle}>Order Summary</Text>

              <View style={s.summaryRow}>
                <MiniGiftCard pool={pool} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={s.summaryPrize} numberOfLines={2}>{pool.prize}</Text>
                  <Text style={s.summaryMeta}>1 × entry · {pool.entries + 1}/{pool.total}</Text>
                </View>
                <Text style={s.summaryPrice}>${fee}</Text>
              </View>

              <View style={s.divider} />

              <View style={s.subRow}>
                <Text style={s.subLabel}>Subtotal</Text>
                <Text style={s.subValue}>${fee}</Text>
              </View>
              <View style={s.subRow}>
                <Text style={s.subLabel}>Processing fee</Text>
                <Text style={s.subValue}>$0.00</Text>
              </View>

              <View style={s.divider} />

              <View style={s.subRow}>
                <Text style={s.totalLabel}>Total</Text>
                <Text style={s.totalValue}>${fee}</Text>
              </View>

              <TouchableOpacity
                onPress={handlePay}
                disabled={!agreed || loading}
                style={[s.payBtn, (!agreed || loading) && { opacity: 0.5 }]}
              >
                {loading
                  ? <ActivityIndicator color="#FFFFFF" size="small" />
                  : <Text style={s.payBtnText}>Confirm & Pay ${fee}</Text>
                }
              </TouchableOpacity>

              <View style={s.trustRow}>
                <Text style={s.trustText}>🔒 256-bit SSL · Powered by Stripe</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  topNav: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: Colors.border },
  topNavInner: { maxWidth: 1200, width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 14 },
  backLink: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  brandName: { fontSize: 14, fontWeight: '800', color: Colors.text, letterSpacing: -0.3 },
  page: { maxWidth: 1000, width: '100%', alignSelf: 'center', paddingHorizontal: 24, paddingTop: 32, paddingBottom: 60 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  passedBadge: { backgroundColor: Colors.greenBg, borderWidth: 1, borderColor: Colors.greenLight, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  passedText: { fontSize: 11, fontWeight: '700', color: Colors.green },
  grid: { flexDirection: 'row', gap: 24, alignItems: 'flex-start' },
  left: { flex: 1.4, gap: 16 },
  right: { flex: 1 },
  card: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 20 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: Colors.text, marginBottom: 14 },
  methodTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 14, borderWidth: 1.5, borderColor: Colors.border, borderRadius: 10, cursor: 'pointer' as any },
  methodTabActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  methodTabLabel: { fontSize: 13, fontWeight: '700', color: Colors.textSec },
  applePayBox: { alignItems: 'center', padding: 28, borderRadius: 10, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: Colors.border, gap: 12 },
  applePayText: { fontSize: 12, color: Colors.textSec, textAlign: 'center', lineHeight: 17, maxWidth: 320 },
  label: { fontSize: 11, fontWeight: '700', color: Colors.textSec, marginBottom: 6, letterSpacing: 0.3, textTransform: 'uppercase' },
  input: { borderWidth: 1, borderColor: Colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 11, fontSize: 14, color: Colors.text, backgroundColor: '#FAFAFA' },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, cursor: 'pointer' as any },
  checkbox: { width: 20, height: 20, borderRadius: 5, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  checkboxActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  termsText: { flex: 1, fontSize: 12, color: Colors.textSec, lineHeight: 17 },
  summaryCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 20, position: 'sticky' as any, top: 24 },
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  summaryPrize: { fontSize: 13, fontWeight: '700', color: Colors.text, lineHeight: 18 },
  summaryMeta: { fontSize: 11, color: Colors.textSec, marginTop: 2 },
  summaryPrice: { fontSize: 14, fontWeight: '800', color: Colors.text },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 14 },
  subRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  subLabel: { fontSize: 12, color: Colors.textSec },
  subValue: { fontSize: 12, fontWeight: '600', color: Colors.text },
  totalLabel: { fontSize: 14, fontWeight: '800', color: Colors.text },
  totalValue: { fontSize: 18, fontWeight: '800', color: Colors.text },
  payBtn: { backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 16 },
  payBtnText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.2 },
  trustRow: { alignItems: 'center', marginTop: 12 },
  trustText: { fontSize: 11, color: Colors.muted },
})
