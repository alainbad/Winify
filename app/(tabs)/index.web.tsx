import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, StyleSheet, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/theme'
import { POOLS, RECENT_WINNERS, Pool } from '@/lib/data'

type CardTheme = {
  bg1: string; bg2: string; textColor: string;
  icon?: { lib: 'fa5' | 'mci' | 'svg'; name: string; size?: number; svgUrl?: string }
}

// svg = use simpleicons CDN via CSS backgroundImage (for brands not in FA5/MCI)
const CARD_THEMES: Record<string, CardTheme> = {
  'Amazon':      { bg1: '#FF9900', bg2: '#E47911', textColor: '#FFFFFF', icon: { lib: 'fa5', name: 'amazon', size: 72 } },
  'Xbox':        { bg1: '#107C10', bg2: '#0A5A0A', textColor: '#FFFFFF', icon: { lib: 'fa5', name: 'xbox', size: 72 } },
  'Netflix':     { bg1: '#141414', bg2: '#1A0000', textColor: '#E50914', icon: { lib: 'svg', name: 'netflix', svgUrl: 'https://cdn.simpleicons.org/netflix/E50914' } },
  'Steam':       { bg1: '#1B2838', bg2: '#2A475E', textColor: '#FFFFFF', icon: { lib: 'fa5', name: 'steam', size: 72 } },
  'Spotify':     { bg1: '#191414', bg2: '#121212', textColor: '#1DB954', icon: { lib: 'fa5', name: 'spotify', size: 72 } },
  'Roblox':      { bg1: '#FFFFFF', bg2: '#F0F0F0', textColor: '#E2231A', icon: { lib: 'svg', name: 'roblox', svgUrl: 'https://cdn.simpleicons.org/roblox/E2231A' } },
  'Google Play': { bg1: '#FFFFFF', bg2: '#F5F5F5', textColor: '#34A853', icon: { lib: 'svg', name: 'googleplay', svgUrl: 'https://cdn.simpleicons.org/googleplay/34A853' } },
  'Apple':       { bg1: '#1A1A1A', bg2: '#2D2D2D', textColor: '#FFFFFF', icon: { lib: 'fa5', name: 'apple', size: 72 } },
  'Uber Eats':   { bg1: '#142328', bg2: '#06C167', textColor: '#FFFFFF', icon: { lib: 'svg', name: 'ubereats', svgUrl: 'https://cdn.simpleicons.org/ubereats/FFFFFF' } },
  'Starbucks':   { bg1: '#00704A', bg2: '#005F3E', textColor: '#FFFFFF', icon: { lib: 'svg', name: 'starbucks', svgUrl: 'https://cdn.simpleicons.org/starbucks/FFFFFF' } },
  'PlayStation': { bg1: '#003791', bg2: '#00287A', textColor: '#FFFFFF', icon: { lib: 'fa5', name: 'playstation', size: 72 } },
  'Microsoft':   { bg1: '#0078D4', bg2: '#005BA1', textColor: '#FFFFFF', icon: { lib: 'fa5', name: 'microsoft', size: 72 } },
  'Booking.com': { bg1: '#003580', bg2: '#002B6B', textColor: '#FFFFFF', icon: { lib: 'svg', name: 'bookingcom', svgUrl: 'https://cdn.simpleicons.org/bookingcom/FFFFFF' } },
  'Airbnb':      { bg1: '#FF5A5F', bg2: '#E0474C', textColor: '#FFFFFF', icon: { lib: 'fa5', name: 'airbnb', size: 72 } },
  'Nintendo':    { bg1: '#E60012', bg2: '#C4000F', textColor: '#FFFFFF', icon: { lib: 'mci', name: 'nintendo-switch', size: 72 } },
  'Disney+':     { bg1: '#0F1F5C', bg2: '#1A3080', textColor: '#FFFFFF', icon: { lib: 'svg', name: 'disneyplus', svgUrl: 'https://cdn.simpleicons.org/disneyplus/FFFFFF' } },
  'Expedia':     { bg1: '#00355F', bg2: '#00243F', textColor: '#FFC72C', icon: { lib: 'svg', name: 'expedia', svgUrl: 'https://cdn.simpleicons.org/expedia/FFC72C' } },
}

function GiftCardThumb({ pool, style, children }: { pool: Pool; style?: any; children?: React.ReactNode }) {
  const theme = CARD_THEMES[pool.brand] ?? { bg1: pool.bgColor, bg2: pool.bgColor, textColor: '#FFFFFF' }
  const ic = theme.icon
  const svgBg = ic?.lib === 'svg' && ic.svgUrl ? {
    backgroundImage: `url(${ic.svgUrl})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundSize: '72% 72%',
  } as any : {}

  return (
    <View style={[style, { backgroundColor: theme.bg1, position: 'relative', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }]}>
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: theme.bg2, opacity: 0.45 }]} />
      <View style={styles.giftCircle1} />
      <View style={styles.giftCircle2} />
      {ic?.lib === 'svg'
        ? <View style={[styles.giftSvgBox, svgBg]} />
        : (
          <View style={styles.giftIconWrap}>
            {ic?.lib === 'fa5' && <FontAwesome5 name={ic.name as any} size={ic.size ?? 72} color={theme.textColor} brand />}
            {ic?.lib === 'mci' && <MaterialCommunityIcons name={ic.name as any} size={ic.size ?? 72} color={theme.textColor} />}
          </View>
        )
      }
      <Text style={[styles.giftBrandName, { color: theme.textColor }]}>{pool.brand}</Text>
      <View style={styles.giftLabel}>
        <Text style={styles.giftLabelText}>GIFT CARD</Text>
      </View>
      {children}
    </View>
  )
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const { width } = useWindowDimensions()
  const isMobile = width < 768
  return (
    <View style={styles.navbar}>
      <View style={styles.navInner}>
        <Text style={styles.navLogo}>Tick Pick</Text>
        {!isMobile && (
          <View style={styles.navLinks}>
            {['Home', 'Browse', 'How It Works', 'Winners'].map(link => (
              <TouchableOpacity key={link} style={styles.navLinkBtn}>
                <Text style={styles.navLinkText}>{link}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={styles.navActions}>
          <TouchableOpacity style={styles.loginBtn}>
            <Text style={styles.loginBtnText}>Login</Text>
          </TouchableOpacity>
          {!isMobile && (
            <TouchableOpacity style={styles.signupBtn}>
              <Text style={styles.signupBtnText}>Sign Up</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}

// ─── Hero Featured Card ────────────────────────────────────────────────────
function HeroCompCard({ pool }: { pool: Pool }) {
  return (
    <TouchableOpacity onPress={() => router.push(`/competition/${pool.id}`)} activeOpacity={0.9} style={styles.heroCompCard}>
      <GiftCardThumb pool={pool} style={styles.heroCompImage}>
        <View style={styles.heroCompTimePill}>
          <View style={styles.liveDot} />
          <Text style={styles.heroCompTimeText}>{pool.time}</Text>
        </View>
        <View style={styles.hotPillRight}>
          <Text style={styles.hotPillText}>FEATURED ⭐</Text>
        </View>
      </GiftCardThumb>
      <View style={styles.heroCompBody}>
        <View style={styles.tierRow}>
          <View style={[styles.tierChip, { backgroundColor: pool.accentBg }]}>
            <Text style={[styles.tierChipText, { color: pool.accent }]}>{pool.tier}</Text>
          </View>
        </View>
        <Text style={styles.heroCompPrize}>{pool.prize}</Text>
        <Text style={styles.heroCompDesc} numberOfLines={2}>{pool.desc}</Text>
        <View style={styles.progressWrap}>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${pool.pct}%` as any, backgroundColor: pool.accent }]} />
          </View>
          <View style={styles.progressMeta}>
            <Text style={styles.progressText}>{pool.pct}% sold</Text>
            <Text style={styles.progressText}>{pool.entries}/{pool.total} entries</Text>
          </View>
        </View>
        <View style={styles.heroCompFooter}>
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>${pool.price}.00</Text>
          </View>
          <TouchableOpacity style={styles.playNowBtn} onPress={() => router.push(`/competition/${pool.id}`)}>
            <Text style={styles.playNowBtnText}>Enter Now →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}

// ─── Hero Section ─────────────────────────────────────────────────────────
function Hero({ featured }: { featured: Pool }) {
  const { width } = useWindowDimensions()
  const isMobile = width < 768
  return (
    <View style={styles.hero}>
      <View style={[styles.heroInner, isMobile && { flexDirection: 'column', gap: 32, alignItems: 'stretch' }]}>
        {/* Left */}
        <View style={styles.heroLeft}>
          <View style={styles.heroBadge}>
            <View style={styles.liveDotGreen} />
            <Text style={styles.heroBadgeText}>38 live competitions right now</Text>
          </View>
          <Text style={[styles.heroHeadline, isMobile && { fontSize: 42, lineHeight: 48 }]}>Win Big{'\n'}for Just $2</Text>
          <Text style={styles.heroSubtext}>
            Enter premium prize draws with a single ticket. Every draw is provably fair,
            powered by RANDOM.ORG. Winners paid instantly.
          </Text>
          <View style={styles.heroCtaRow}>
            <TouchableOpacity style={styles.heroCta} onPress={() => router.push('/browse')}>
              <Text style={styles.heroCtaText}>Browse Competitions →</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroCtaOutline}>
              <Text style={styles.heroCtaOutlineText}>How It Works</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.heroStats}>
            {[
              { val: '12,400+', label: 'Winners' },
              { val: '$2', label: 'Per Entry' },
              { val: '38', label: 'Live Now' },
            ].map(s => (
              <View key={s.label} style={styles.heroStat}>
                <Text style={styles.heroStatVal}>{s.val}</Text>
                <Text style={styles.heroStatLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* Right */}
        <View style={[styles.heroRight, isMobile && { width: '100%' }]}>
          <HeroCompCard pool={featured} />
        </View>
      </View>
    </View>
  )
}

// ─── Competition Card ────────────────────────────────────────────────────
function CompCard({ pool }: { pool: Pool }) {
  const isUrgent = pool.pct > 80
  return (
    <TouchableOpacity onPress={() => router.push(`/competition/${pool.id}`)} activeOpacity={0.88} style={styles.compCard}>
      <GiftCardThumb pool={pool} style={styles.compCardImage}>
        <View style={styles.timePill}>
          <View style={styles.liveDot} />
          <Text style={styles.timePillText}>{pool.time}</Text>
        </View>
        {pool.hot && (
          <View style={styles.hotPill}>
            <Text style={styles.hotPillText}>HOT 🔥</Text>
          </View>
        )}
      </GiftCardThumb>
      <View style={styles.compCardBody}>
        <View style={styles.tierRow}>
          <View style={[styles.tierChip, { backgroundColor: pool.accentBg }]}>
            <Text style={[styles.tierChipText, { color: pool.accent }]}>{pool.tier}</Text>
          </View>
          {isUrgent && (
            <View style={styles.urgentChip}>
              <Text style={styles.urgentChipText}>ENDING SOON</Text>
            </View>
          )}
        </View>
        <Text style={styles.compCardPrize} numberOfLines={2}>{pool.prize}</Text>
        <View style={styles.progressWrap}>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, {
              width: `${pool.pct}%` as any,
              backgroundColor: isUrgent ? Colors.red : pool.accent,
            }]} />
          </View>
          <Text style={styles.progressText}>{pool.pct}% sold · {pool.entries}/{pool.total}</Text>
        </View>
        <View style={styles.compCardFooter}>
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>${pool.price}.00</Text>
          </View>
          <TouchableOpacity style={styles.playBtn} onPress={() => router.push(`/competition/${pool.id}`)}>
            <Text style={styles.playBtnText}>Play Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}

// ─── Filter + Search Bar ─────────────────────────────────────────────────
type Filter = 'All' | 'MICRO' | 'VOLUME' | 'MEGA'

function FilterBar({ active, onSelect, search, onSearch }: {
  active: Filter; onSelect: (f: Filter) => void
  search: string; onSearch: (s: string) => void
}) {
  const tabs: Filter[] = ['All', 'MICRO', 'VOLUME', 'MEGA']
  return (
    <View style={styles.filterBar}>
      <View style={styles.filterBarInner}>
        <View style={styles.filterTabs}>
          {tabs.map(t => (
            <TouchableOpacity key={t} onPress={() => onSelect(t)}
              style={[styles.filterTab, active === t && styles.filterTabActive]}>
              <Text style={[styles.filterTabText, active === t && styles.filterTabTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={search}
            onChangeText={onSearch}
            placeholder="Search competitions..."
            placeholderTextColor={Colors.muted}
            style={styles.searchInput}
          />
        </View>
      </View>
    </View>
  )
}

// ─── Winners Ticker ──────────────────────────────────────────────────────
function WinnersTicker() {
  return (
    <View style={styles.tickerBar}>
      <View style={styles.tickerLabel}>
        <Text style={styles.tickerLabelText}>🏆 RECENT WINS</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tickerScroll}>
        {RECENT_WINNERS.map((w, i) => (
          <View key={i} style={styles.tickerItem}>
            <Text style={styles.tickerName}>{w.name}</Text>
            <Text style={styles.tickerWon}> won </Text>
            <Text style={styles.tickerPrize}>{w.prize}</Text>
            <Text style={styles.tickerTime}> · {w.timeAgo}</Text>
            {i < RECENT_WINNERS.length - 1 && <Text style={styles.tickerDivider}>  ·  </Text>}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

// ─── How It Works ────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { icon: '🎯', title: 'Pick a Competition', desc: 'Browse hundreds of live prize draws. From $10 gift cards to $1,000 vouchers.' },
    { icon: '🎟️', title: 'Enter for $2', desc: 'One flat price, no hidden fees. Every ticket gives you a fair shot at winning.' },
    { icon: '🎲', title: 'Fair Draw', desc: 'When tickets sell out, a winner is picked by RANDOM.ORG — provably fair every time.' },
    { icon: '🏆', title: 'Claim Your Prize', desc: 'Winners are notified instantly and prizes delivered within 24 hours.' },
  ]
  return (
    <View style={styles.howSection}>
      <View style={styles.sectionInner}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <Text style={styles.sectionSubtitle}>Four simple steps to your next win</Text>
        </View>
        <View style={styles.howGrid}>
          {steps.map((s, i) => (
            <View key={i} style={styles.howCard}>
              <View style={styles.howIconWrap}>
                <Text style={styles.howIcon}>{s.icon}</Text>
                <View style={styles.howStepNum}><Text style={styles.howStepNumText}>{i + 1}</Text></View>
              </View>
              <Text style={styles.howTitle}>{s.title}</Text>
              <Text style={styles.howDesc}>{s.desc}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────────
function Footer() {
  return (
    <View style={styles.footer}>
      <View style={styles.footerInner}>
        <View style={styles.footerTop}>
          <View style={styles.footerBrand}>
            <Text style={styles.footerLogo}>Tick Pick</Text>
            <Text style={styles.footerTagline}>Premium competitions for everyone.</Text>
            <View style={styles.trustBadges}>
              {['✓ RANDOM.ORG Verified', '✓ Instant Payouts', '✓ 12,400+ Winners'].map(b => (
                <Text key={b} style={styles.trustBadge}>{b}</Text>
              ))}
            </View>
          </View>
          <View style={styles.footerLinks}>
            {[
              { heading: 'Compete', links: ['Browse All', 'MICRO Draws', 'VOLUME Draws', 'MEGA Draws'] },
              { heading: 'Company', links: ['About Us', 'How It Works', 'Past Winners', 'Blog'] },
              { heading: 'Support', links: ['Help Centre', 'Contact Us', 'Terms', 'Privacy'] },
            ].map(col => (
              <View key={col.heading} style={styles.footerCol}>
                <Text style={styles.footerColHead}>{col.heading}</Text>
                {col.links.map(l => (
                  <TouchableOpacity key={l}><Text style={styles.footerLink}>{l}</Text></TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>
        <View style={styles.footerBottom}>
          <Text style={styles.footerCopy}>© 2026 Tick Pick. All rights reserved. Competitions are open to users aged 18+.</Text>
        </View>
      </View>
    </View>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────
export default function HomeWebScreen() {
  const [filter, setFilter] = useState<Filter>('All')
  const [search, setSearch] = useState('')

  const featured = POOLS.find(p => p.featured)!
  const pools = POOLS.filter(p => {
    const matchTier = filter === 'All' || p.tier === filter
    const matchSearch = search === '' || p.prize.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())
    return matchTier && matchSearch
  })

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      <Navbar />
      <Hero featured={featured} />
      <WinnersTicker />

      {/* Competitions Section */}
      <View style={styles.compSection}>
        <View style={styles.sectionInner}>
          <View style={styles.compSectionHeader}>
            <Text style={styles.sectionTitle}>Live Competitions</Text>
            <Text style={styles.sectionSubtitle}>{POOLS.length} draws live now — new ones added daily</Text>
          </View>
          <FilterBar active={filter} onSelect={setFilter} search={search} onSearch={setSearch} />
          <View style={styles.compGrid}>
            {pools.map(p => (
              <View key={p.id} style={styles.compGridItem}>
                <CompCard pool={p} />
              </View>
            ))}
          </View>
        </View>
      </View>

      <HowItWorks />
      <Footer />
    </ScrollView>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────
const MAX = 1280

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },

  // Navbar
  navbar: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: Colors.border, position: 'sticky' as any, top: 0, zIndex: 100 },
  navInner: { maxWidth: MAX, marginHorizontal: 'auto' as any, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 32, paddingVertical: 16 },
  navLogo: { fontSize: 26, fontWeight: '800', color: Colors.primary, letterSpacing: -0.5 },
  navLinks: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  navLinkBtn: { paddingHorizontal: 14, paddingVertical: 8 },
  navLinkText: { fontSize: 15, fontWeight: '500', color: Colors.text },
  navActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  loginBtn: { paddingHorizontal: 18, paddingVertical: 9, borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 8 },
  loginBtnText: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  signupBtn: { paddingHorizontal: 20, paddingVertical: 9, backgroundColor: Colors.primary, borderRadius: 8 },
  signupBtnText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },

  // Hero
  hero: { background: 'linear-gradient(135deg, #2D1B69 0%, #4C1D95 50%, #6D28D9 100%)' as any, backgroundColor: '#2D1B69', paddingVertical: 80, paddingHorizontal: 20 },
  heroInner: { maxWidth: MAX, marginHorizontal: 'auto' as any, flexDirection: 'row', alignItems: 'center', gap: 60 },
  heroLeft: { flex: 1 },
  heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7, alignSelf: 'flex-start', marginBottom: 24 },
  heroBadgeText: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },
  liveDotGreen: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4ADE80' },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4ADE80' },
  heroHeadline: { fontSize: 64, fontWeight: '900', color: '#FFFFFF', lineHeight: 68, letterSpacing: -2, marginBottom: 20 },
  heroSubtext: { fontSize: 18, lineHeight: 28, color: 'rgba(255,255,255,0.75)', fontWeight: '400', marginBottom: 36 },
  heroCtaRow: { flexDirection: 'row', gap: 14, marginBottom: 48 },
  heroCta: { backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 28, paddingVertical: 15 },
  heroCtaText: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  heroCtaOutline: { borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)', borderRadius: 10, paddingHorizontal: 28, paddingVertical: 15 },
  heroCtaOutlineText: { fontSize: 16, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },
  heroStats: { flexDirection: 'row', gap: 40 },
  heroStat: {},
  heroStatVal: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  heroStatLabel: { fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: '500', marginTop: 2 },
  heroRight: { width: 340 },

  // Hero comp card
  heroCompCard: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 40, shadowOffset: { width: 0, height: 20 } },
  heroCompImage: { height: 200, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  heroCompTimePill: { position: 'absolute', top: 12, left: 12, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  heroCompTimeText: { fontSize: 12, fontWeight: '600', color: '#FFFFFF' },
  hotPillRight: { position: 'absolute', top: 12, right: 12, backgroundColor: Colors.gold, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  hotPillText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
  heroCompLogo: { width: 160, height: 80 },
  heroCompBody: { padding: 18 },
  heroCompPrize: { fontSize: 20, fontWeight: '800', color: Colors.text, marginBottom: 6, marginTop: 6 },
  heroCompDesc: { fontSize: 13, color: Colors.textSec, lineHeight: 19, marginBottom: 14 },
  heroCompFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },

  // Competition card
  compSection: { paddingVertical: 64, paddingHorizontal: 20 },
  compSectionHeader: { marginBottom: 32 },
  sectionInner: { maxWidth: MAX, marginHorizontal: 'auto' as any },
  sectionHeader: { alignItems: 'center', marginBottom: 48 },
  sectionTitle: { fontSize: 36, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  sectionSubtitle: { fontSize: 16, color: Colors.textSec, marginTop: 8 },
  compGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8 },
  compGridItem: { width: '25%', paddingHorizontal: 8, marginBottom: 20 },
  compCard: { backgroundColor: '#FFFFFF', borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 16, shadowOffset: { width: 0, height: 4 } },
  compCardImage: { height: 160, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  timePill: { position: 'absolute', top: 10, left: 10, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  timePillText: { fontSize: 11, fontWeight: '600', color: '#FFFFFF' },
  hotPill: { position: 'absolute', top: 10, right: 10, backgroundColor: '#EA580C', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  giftCircle1: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.08)', top: -30, right: -30 },
  giftCircle2: { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.05)', bottom: -20, left: -20 },
  giftIconWrap: { alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  giftBrandName: { fontSize: 14, fontWeight: '800', letterSpacing: 0.5, textAlign: 'center' },
  giftSvgBox: { width: '72%', height: '72%' },
  giftLabel: { position: 'absolute', bottom: 10, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2 },
  giftLabelText: { fontSize: 9, fontWeight: '800', color: 'rgba(255,255,255,0.9)', letterSpacing: 1.5 },
  compCardLogo: { width: 120, height: 60 },
  compCardBody: { padding: 14 },
  tierRow: { flexDirection: 'row', gap: 6, marginBottom: 8, alignItems: 'center' },
  tierChip: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  tierChipText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  urgentChip: { backgroundColor: Colors.redBg, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  urgentChipText: { fontSize: 10, fontWeight: '700', color: Colors.red, letterSpacing: 0.5 },
  compCardPrize: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 12, lineHeight: 20 },
  progressWrap: { marginBottom: 12 },
  progressBg: { height: 5, backgroundColor: '#F0EBFF', borderRadius: 999, marginBottom: 4 },
  progressFill: { height: '100%', borderRadius: 999 },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { fontSize: 11, color: Colors.textSec, fontWeight: '500' },
  compCardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priceBadge: { backgroundColor: Colors.primaryLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  priceBadgeText: { fontSize: 14, fontWeight: '800', color: Colors.primary },
  playBtn: { borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6 },
  playBtnText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  playNowBtn: { backgroundColor: Colors.primary, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 9 },
  playNowBtnText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },

  // Filter bar
  filterBar: { marginBottom: 32 },
  filterBarInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  filterTabs: { flexDirection: 'row', gap: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: Colors.border, borderRadius: 10, padding: 4 },
  filterTab: { borderRadius: 7, paddingHorizontal: 20, paddingVertical: 9 },
  filterTabActive: { backgroundColor: Colors.primary },
  filterTabText: { fontSize: 14, fontWeight: '600', color: Colors.textSec },
  filterTabTextActive: { color: '#FFFFFF' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, width: 260, gap: 8 },
  searchIcon: { fontSize: 15 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text, outlineWidth: 0 } as any,

  // Ticker
  tickerBar: { backgroundColor: Colors.primaryDark, flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  tickerLabel: { backgroundColor: Colors.gold, paddingHorizontal: 16, paddingVertical: 10, marginRight: 16 },
  tickerLabelText: { fontSize: 11, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1 },
  tickerScroll: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 },
  tickerItem: { flexDirection: 'row', alignItems: 'center' },
  tickerName: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  tickerWon: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  tickerPrize: { fontSize: 13, fontWeight: '600', color: Colors.gold },
  tickerTime: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
  tickerDivider: { fontSize: 13, color: 'rgba(255,255,255,0.25)' },

  // How it works
  howSection: { backgroundColor: '#FFFFFF', paddingVertical: 80, paddingHorizontal: 20 },
  howGrid: { flexDirection: 'row', gap: 24 },
  howCard: { flex: 1, alignItems: 'center', padding: 28, backgroundColor: Colors.bg, borderRadius: 16, borderWidth: 1, borderColor: Colors.border },
  howIconWrap: { width: 64, height: 64, borderRadius: 20, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 18, position: 'relative' },
  howIcon: { fontSize: 30 },
  howStepNum: { position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  howStepNumText: { fontSize: 11, fontWeight: '800', color: '#FFFFFF' },
  howTitle: { fontSize: 17, fontWeight: '700', color: Colors.text, marginBottom: 10, textAlign: 'center' },
  howDesc: { fontSize: 14, color: Colors.textSec, textAlign: 'center', lineHeight: 21 },

  // Footer
  footer: { backgroundColor: '#1A0A2E', paddingVertical: 60, paddingHorizontal: 20 },
  footerInner: { maxWidth: MAX, marginHorizontal: 'auto' as any },
  footerTop: { flexDirection: 'row', gap: 60, marginBottom: 48 },
  footerBrand: { flex: 1 },
  footerLogo: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', marginBottom: 10 },
  footerTagline: { fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 20 },
  trustBadges: { gap: 8 },
  trustBadge: { fontSize: 13, color: Colors.green, fontWeight: '500' },
  footerLinks: { flexDirection: 'row', gap: 60 },
  footerCol: { gap: 12 },
  footerColHead: { fontSize: 13, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.5, marginBottom: 4 },
  footerLink: { fontSize: 14, color: 'rgba(255,255,255,0.5)' },
  footerBottom: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', paddingTop: 24 },
  footerCopy: { fontSize: 13, color: 'rgba(255,255,255,0.35)', textAlign: 'center' },
})
