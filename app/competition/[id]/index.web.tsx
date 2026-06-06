import React, { useState, useEffect, useMemo, useRef } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
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

function HeroGiftCard({ pool, size }: { pool: Pool; size: number }) {
  const theme = CARD_THEMES[pool.brand] ?? { bg1: pool.bgColor, bg2: pool.bgColor, textColor: '#FFFFFF' }
  const ic = theme.icon
  const svgBg = ic?.lib === 'svg' && ic.svgUrl ? {
    backgroundImage: `url(${ic.svgUrl})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundSize: '70% 70%',
  } as any : {}
  return (
    <View style={{
      width: size, height: size, borderRadius: 20, overflow: 'hidden',
      backgroundColor: theme.bg1, position: 'relative',
      alignItems: 'center', justifyContent: 'center',
      shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 30, shadowOffset: { width: 0, height: 12 },
    }}>
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: theme.bg2, opacity: 0.45 }]} />
      <View style={{ position: 'absolute', width: size * 0.7, height: size * 0.7, borderRadius: size * 0.35, backgroundColor: 'rgba(255,255,255,0.08)', top: -size * 0.15, right: -size * 0.15 }} />
      <View style={{ position: 'absolute', width: size * 0.5, height: size * 0.5, borderRadius: size * 0.25, backgroundColor: 'rgba(255,255,255,0.05)', bottom: -size * 0.12, left: -size * 0.12 }} />
      {ic?.lib === 'svg'
        ? <View style={[{ width: '60%', height: '60%' }, svgBg]} />
        : (
          <View style={{ marginBottom: 16 }}>
            {ic?.lib === 'fa5' && <FontAwesome5 name={ic.name as any} size={Math.round(size * 0.32)} color={theme.textColor} brand />}
            {ic?.lib === 'mci' && <MaterialCommunityIcons name={ic.name as any} size={Math.round(size * 0.32)} color={theme.textColor} />}
          </View>
        )
      }
      <Text style={{ position: 'absolute', bottom: 28, left: 28, color: theme.textColor, fontSize: 22, fontWeight: '900', letterSpacing: 0.5 }}>{pool.brand}</Text>
      <View style={{ position: 'absolute', bottom: 28, right: 28, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 5 }}>
        <Text style={{ fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.95)', letterSpacing: 2 }}>GIFT CARD</Text>
      </View>
    </View>
  )
}

function parseTimeToSeconds(t: string): number {
  // "18h 42m", "12m", "6d 12h"
  let total = 0
  const d = t.match(/(\d+)d/); if (d) total += parseInt(d[1]) * 86400
  const h = t.match(/(\d+)h/); if (h) total += parseInt(h[1]) * 3600
  const m = t.match(/(\d+)m/); if (m) total += parseInt(m[1]) * 60
  const s = t.match(/(\d+)s/); if (s) total += parseInt(s[1])
  return total || 86400
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <View style={s.countdownBox}>
      <Text style={s.countdownValue}>{String(value).padStart(2, '0')}</Text>
      <Text style={s.countdownLabel}>{label}</Text>
    </View>
  )
}

export default function CompetitionDetailWeb() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const pool = POOLS.find(p => p.id === Number(id))

  const [bundle, setBundle] = useState<number | null>(null)
  const [tickets, setTickets] = useState(1)
  const [secondsLeft, setSecondsLeft] = useState(() => pool ? parseTimeToSeconds(pool.time) : 86400)

  useEffect(() => {
    const t = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [])

  if (!pool) {
    return (
      <View style={s.notFound}>
        <Text style={{ fontSize: 15, color: Colors.textSec }}>Competition not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12 }}>
          <Text style={{ color: Colors.primary, fontWeight: '700' }}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const bundles = useMemo(() => {
    const maxPerUser = Math.min(pool.total, 50)
    return [
      { count: 1, label: '1' },
      { count: 5, label: '5', tag: 'Most Popular' },
      { count: 10, label: '10' },
    ].filter(b => b.count <= maxPerUser)
  }, [pool.total])

  const totalPrice = (tickets * pool.price).toFixed(2)
  const days = Math.floor(secondsLeft / 86400)
  const hours = Math.floor((secondsLeft % 86400) / 3600)
  const mins = Math.floor((secondsLeft % 3600) / 60)
  const secs = secondsLeft % 60

  const maxTickets = Math.min(pool.total - pool.entries, 50)
  const sliderPct = (tickets / maxTickets) * 100

  function pickBundle(count: number) {
    setBundle(count)
    setTickets(count)
  }

  function changeTickets(n: number) {
    const clamped = Math.max(1, Math.min(maxTickets, n))
    setTickets(clamped)
    setBundle(null)
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Top nav */}
      <View style={s.topNav}>
        <View style={s.topNavInner}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ color: Colors.primary, fontSize: 18, fontWeight: '900' }}>●</Text>
            <Text style={s.brandName}>Tick Pick</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 28 }}>
            <TouchableOpacity onPress={() => router.push('/')}><Text style={s.navItem}>Instant Wins</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/browse')}><Text style={s.navItem}>Browse</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/winners')}><Text style={s.navItem}>Winners</Text></TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        <View style={s.page}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>

          {/* Two-column */}
          <View style={s.grid}>
            {/* LEFT: Image */}
            <View style={s.left}>
              <HeroGiftCard pool={pool} size={520} />
            </View>

            {/* RIGHT: Purchase */}
            <View style={s.right}>
              <View style={s.pillsRow}>
                <View style={s.pillPrimary}><Text style={s.pillPrimaryText}>${pool.price.toFixed(2)} per ticket</Text></View>
                <View style={s.pillOutline}><Text style={s.pillOutlineText}>{pool.total.toLocaleString()} Pool Size</Text></View>
              </View>

              <Text style={s.title}>{pool.prize}</Text>

              <Text style={s.sectionLabel}>Bundle Options</Text>
              <View style={s.bundleRow}>
                {bundles.map(b => {
                  const active = bundle === b.count
                  return (
                    <TouchableOpacity key={b.count} onPress={() => pickBundle(b.count)} style={[s.bundleBtn, active && s.bundleBtnActive]}>
                      <Text style={[s.bundleNum, active && { color: Colors.primary }]}>{b.label}</Text>
                      <FontAwesome5 name="ticket-alt" size={11} color={active ? Colors.primary : Colors.textSec} />
                      {b.tag && (
                        <View style={s.bundleTag}><Text style={s.bundleTagText}>{b.tag}</Text></View>
                      )}
                    </TouchableOpacity>
                  )
                })}
              </View>

              <TouchableOpacity><Text style={s.freeEntry}>Free Postal Entry*</Text></TouchableOpacity>

              <View style={s.ticketCounter}>
                <FontAwesome5 name="ticket-alt" size={14} color={Colors.primary} />
                <Text style={s.ticketCounterText}>{tickets} Ticket{tickets > 1 ? 's' : ''}</Text>
              </View>

              <View style={s.sliderRow}>
                <TouchableOpacity onPress={() => changeTickets(tickets - 1)} style={s.stepperBtn}>
                  <Text style={s.stepperText}>−</Text>
                </TouchableOpacity>
                <input
                  type="range"
                  min={1}
                  max={maxTickets}
                  value={tickets}
                  onChange={(e: any) => changeTickets(parseInt(e.target.value))}
                  style={{
                    flex: 1,
                    height: 6,
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    background: `linear-gradient(to right, ${Colors.primary} 0%, ${Colors.primary} ${sliderPct}%, #E5E7EB ${sliderPct}%, #E5E7EB 100%)`,
                    borderRadius: 999,
                    outline: 'none',
                    cursor: 'pointer',
                  } as any}
                  className="tickpick-slider"
                />
                <TouchableOpacity onPress={() => changeTickets(tickets + 1)} style={s.stepperBtn}>
                  <Text style={s.stepperText}>+</Text>
                </TouchableOpacity>
              </View>
              {/* @ts-ignore */}
              <style>{`
                .tickpick-slider::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  background: #FFFFFF;
                  border: 3px solid ${Colors.primary};
                  cursor: pointer;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                }
                .tickpick-slider::-moz-range-thumb {
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  background: #FFFFFF;
                  border: 3px solid ${Colors.primary};
                  cursor: pointer;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                }
              `}</style>

              <TouchableOpacity
                style={s.cta}
                onPress={() => router.push(`/competition/${pool.id}/skill-gate`)}
              >
                <Text style={s.ctaText}>Add to Cart  ${totalPrice}</Text>
              </TouchableOpacity>

              <View style={s.payIcons}>
                <FontAwesome5 name="apple-pay" size={34} color="#000000" brand />
                <FontAwesome5 name="google-pay" size={34} color="#5F6368" brand />
                <FontAwesome5 name="cc-visa" size={34} color="#1A1F71" brand />
              </View>

              {/* Countdown */}
              <View style={s.countdownRow}>
                <CountdownBox value={days} label="Days" />
                <CountdownBox value={hours} label="Hours" />
                <CountdownBox value={mins} label="Mins" />
                <CountdownBox value={secs} label="Secs" />
              </View>

              {/* Progress */}
              <View style={s.progressWrap}>
                <Text style={s.progressCount}>{pool.entries.toLocaleString()} / {pool.total.toLocaleString()}</Text>
                <View style={s.progressBg}>
                  <View style={[s.progressFill, { width: `${pool.pct}%` as any }]} />
                  <View style={[s.progressBadge, { left: `${pool.pct}%` as any }]}>
                    <Text style={s.progressBadgeText}>{pool.pct}%{'\n'}SOLD</Text>
                  </View>
                </View>
              </View>

              {/* Info boxes */}
              <View style={s.infoBoxes}>
                <View style={s.infoBox}>
                  <FontAwesome5 name="users" size={16} color={Colors.primary} />
                  <Text style={s.infoBoxValue}>{Math.min(50, pool.total)}</Text>
                  <Text style={s.infoBoxLabel}>max tickets pp</Text>
                </View>
                <View style={s.infoBox}>
                  <FontAwesome5 name="calendar-alt" size={16} color={Colors.primary} />
                  <Text style={s.infoBoxValue}>Draw date</Text>
                  <Text style={s.infoBoxLabel}>{pool.time}</Text>
                </View>
                <View style={s.infoBox}>
                  <FontAwesome5 name="ticket-alt" size={16} color={Colors.primary} />
                  <Text style={s.infoBoxValue}>{pool.total.toLocaleString()}</Text>
                  <Text style={s.infoBoxLabel}>total tickets</Text>
                </View>
              </View>

              {/* Bonus Draw */}
              <View style={s.bonusCard}>
                <View style={s.bonusBadge}><Text style={s.bonusBadgeText}>BONUS DRAW</Text></View>
                <View style={s.bonusRow}>
                  <View style={s.bonusPrize}>
                    <Text style={s.bonusPrizeAmount}>$100</Text>
                    <Text style={s.bonusPrizeLabel}>BONUS CASH</Text>
                  </View>
                  <Text style={s.bonusDesc}>
                    Every ticket purchased into this competition is also an entry into the bonus draw to win $100 Bonus Cash at the end of the raffle!
                  </Text>
                </View>
                <View style={s.bonusTimer}>
                  <FontAwesome5 name="clock" size={11} color={Colors.primary} />
                  <Text style={s.bonusTimerText}>{days}d : {String(hours).padStart(2,'0')}h : {String(mins).padStart(2,'0')}m : {String(secs).padStart(2,'0')}s</Text>
                </View>
              </View>

              {/* Description */}
              <View style={s.descCard}>
                <Text style={s.descTitle}>Description</Text>
                <Text style={s.descBody}>{pool.desc}</Text>
                <Text style={[s.descBody, { marginTop: 12 }]}>
                  Enter for just ${pool.price.toFixed(2)} per ticket for a chance to win {pool.prize}. The draw is fully automated and verified by RANDOM.ORG — tamper-proof and independently audited. With only {pool.total.toLocaleString()} tickets total, your odds are far better than any traditional lottery, and every entry instantly counts toward both the main prize and the bonus cash draw.
                </Text>
                <Text style={[s.descBody, { marginTop: 12 }]}>
                  You must be 18 or over to enter. Skill question must be answered correctly to confirm entry. Winners are notified by email within 24 hours of the draw closing. Full terms apply.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA' },
  topNav: { backgroundColor: Colors.primary },
  topNavInner: { maxWidth: 1280, width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 32, paddingVertical: 14 },
  brandName: { fontSize: 18, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.4 },
  navItem: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  page: { maxWidth: 1200, width: '100%', alignSelf: 'center', paddingHorizontal: 32, paddingTop: 24 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  backArrow: { fontSize: 18, color: Colors.primary, fontWeight: '700' },
  grid: { flexDirection: 'row', gap: 60, alignItems: 'flex-start' },
  left: { width: 520, alignItems: 'center' },
  right: { flex: 1, maxWidth: 520 },
  pillsRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  pillPrimary: { backgroundColor: Colors.primaryLight, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6 },
  pillPrimaryText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  pillOutline: { borderWidth: 1, borderColor: Colors.border, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6 },
  pillOutlineText: { fontSize: 12, fontWeight: '700', color: Colors.text },
  title: { fontSize: 30, fontWeight: '900', color: Colors.text, letterSpacing: -0.8, lineHeight: 36, marginBottom: 22 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: Colors.textSec, textAlign: 'center', marginBottom: 10, letterSpacing: 0.3 },
  bundleRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  bundleBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1.5, borderColor: Colors.border, borderRadius: 10, paddingVertical: 14, position: 'relative', cursor: 'pointer' as any },
  bundleBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  bundleNum: { fontSize: 16, fontWeight: '800', color: Colors.text },
  bundleTag: { position: 'absolute', bottom: -8, alignSelf: 'center', backgroundColor: Colors.primary, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  bundleTagText: { fontSize: 9, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.3 },
  freeEntry: { fontSize: 12, color: Colors.primary, textAlign: 'center', textDecorationLine: 'underline', marginBottom: 22, fontWeight: '600' },
  ticketCounter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 14 },
  ticketCounterText: { fontSize: 16, fontWeight: '800', color: Colors.primary },
  sliderRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 22 },
  stepperBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', cursor: 'pointer' as any },
  stepperText: { fontSize: 22, fontWeight: '800', color: Colors.primary, lineHeight: 22 },
  sliderTrack: { flex: 1, height: 6, backgroundColor: '#E5E7EB', borderRadius: 999, position: 'relative' },
  sliderFill: { position: 'absolute', left: 0, top: 0, height: 6, borderRadius: 999, backgroundColor: Colors.primary },
  sliderThumb: { position: 'absolute', top: -7, marginLeft: -10, width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFFFFF', borderWidth: 3, borderColor: Colors.primary },
  cta: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 18 },
  ctaText: { fontSize: 15, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.2 },
  payIcons: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 28 },
  countdownRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 18 },
  countdownBox: { width: 56, alignItems: 'center', backgroundColor: Colors.primaryLight, borderRadius: 10, paddingVertical: 8 },
  countdownValue: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  countdownLabel: { fontSize: 10, fontWeight: '600', color: Colors.primary, marginTop: 2 },
  progressWrap: { marginBottom: 30, position: 'relative' },
  progressCount: { fontSize: 13, color: Colors.text, textAlign: 'center', fontWeight: '600', marginBottom: 8 },
  progressBg: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 999, position: 'relative' },
  progressFill: { height: '100%', borderRadius: 999, backgroundColor: Colors.primary },
  progressBadge: { position: 'absolute', top: 12, marginLeft: -22, backgroundColor: '#FBBF24', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3, minWidth: 44, alignItems: 'center' },
  progressBadgeText: { fontSize: 9, fontWeight: '900', color: '#7C2D12', textAlign: 'center', lineHeight: 11 },
  infoBoxes: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  infoBox: { flex: 1, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingVertical: 14, alignItems: 'center', gap: 4 },
  infoBoxValue: { fontSize: 12, fontWeight: '800', color: Colors.text, marginTop: 4 },
  infoBoxLabel: { fontSize: 10, color: Colors.textSec, textAlign: 'center', fontWeight: '600' },
  bonusCard: { borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 14, padding: 16, marginBottom: 20, position: 'relative' },
  bonusBadge: { position: 'absolute', top: -10, alignSelf: 'center', backgroundColor: Colors.primary, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 3 },
  bonusBadgeText: { fontSize: 10, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1 },
  bonusRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 6 },
  bonusPrize: { backgroundColor: Colors.primary, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, alignItems: 'center' },
  bonusPrizeAmount: { fontSize: 22, fontWeight: '900', color: '#FBBF24' },
  bonusPrizeLabel: { fontSize: 8, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.5, marginTop: 2 },
  bonusDesc: { flex: 1, fontSize: 11, color: Colors.text, lineHeight: 16 },
  bonusTimer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 12 },
  bonusTimerText: { fontSize: 11, color: Colors.primary, fontWeight: '700' },
  descCard: { borderWidth: 1, borderColor: Colors.border, borderRadius: 14, padding: 20 },
  descTitle: { fontSize: 16, fontWeight: '900', color: Colors.text, marginBottom: 12 },
  descBody: { fontSize: 13, color: Colors.text, lineHeight: 20 },
})
