import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native'
import { useState } from 'react'
import { router } from 'expo-router'
import { Colors } from '@/constants/theme'
import { POOLS, Pool } from '@/lib/data'

// ─── Navbar ───────────────────────────────────────────────────────────────
function Navbar() {
  return (
    <View style={styles.navbar}>
      <View style={styles.navInner}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text style={styles.navLogo}>Winify</Text>
        </TouchableOpacity>
        <View style={styles.navLinks}>
          {['Home', 'Browse', 'How It Works', 'Winners'].map(link => (
            <TouchableOpacity key={link} style={styles.navLinkBtn}>
              <Text style={[styles.navLinkText, link === 'Browse' && styles.navLinkActive]}>{link}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.navActions}>
          <TouchableOpacity style={styles.loginBtn}>
            <Text style={styles.loginBtnText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signupBtn}>
            <Text style={styles.signupBtnText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

// ─── Competition Card ─────────────────────────────────────────────────────
function CompCard({ pool }: { pool: Pool }) {
  const isUrgent = pool.pct > 80
  return (
    <TouchableOpacity onPress={() => router.push(`/competition/${pool.id}`)} activeOpacity={0.88} style={styles.compCard}>
      <View style={[styles.compCardImage, { backgroundColor: pool.bgColor }]}>
        <View style={styles.timePill}>
          <View style={styles.liveDot} />
          <Text style={styles.timePillText}>{pool.time}</Text>
        </View>
        {pool.hot && (
          <View style={styles.hotPill}>
            <Text style={styles.hotPillText}>HOT 🔥</Text>
          </View>
        )}
        <Image source={{ uri: pool.logo }} style={styles.compCardLogo} resizeMode="contain" />
      </View>
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
        <Text style={styles.compCardDesc} numberOfLines={2}>{pool.desc}</Text>
        <View style={styles.progressWrap}>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, {
              width: `${pool.pct}%` as any,
              backgroundColor: isUrgent ? Colors.red : pool.accent,
            }]} />
          </View>
          <View style={styles.progressMeta}>
            <Text style={styles.progressText}>{pool.pct}% sold</Text>
            <Text style={styles.progressText}>{pool.entries}/{pool.total}</Text>
          </View>
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

// ─── Sidebar ──────────────────────────────────────────────────────────────
type Tier = 'All' | 'MICRO' | 'VOLUME' | 'MEGA'
type SortOpt = 'Ending Soon' | 'Most Popular' | 'Newest' | 'Price: Low'

function Sidebar({
  tier, onTier, sort, onSort, brands, activeBrands, onBrand,
}: {
  tier: Tier; onTier: (t: Tier) => void
  sort: SortOpt; onSort: (s: SortOpt) => void
  brands: string[]; activeBrands: string[]; onBrand: (b: string) => void
}) {
  const tiers: { label: string; value: Tier; count: number }[] = [
    { label: 'All Competitions', value: 'All', count: POOLS.length },
    { label: 'MICRO Draws', value: 'MICRO', count: POOLS.filter(p => p.tier === 'MICRO').length },
    { label: 'VOLUME Draws', value: 'VOLUME', count: POOLS.filter(p => p.tier === 'VOLUME').length },
    { label: 'MEGA Draws', value: 'MEGA', count: POOLS.filter(p => p.tier === 'MEGA').length },
  ]
  const sortOpts: SortOpt[] = ['Ending Soon', 'Most Popular', 'Newest', 'Price: Low']
  const tierColors: Record<Tier, string> = {
    All: Colors.primary,
    MICRO: Colors.green,
    VOLUME: Colors.blue,
    MEGA: Colors.gold,
  }

  return (
    <View style={styles.sidebar}>
      {/* Category */}
      <View style={styles.sideSection}>
        <Text style={styles.sideSectionTitle}>CATEGORY</Text>
        {tiers.map(t => (
          <TouchableOpacity key={t.value} onPress={() => onTier(t.value)}
            style={[styles.sideItem, tier === t.value && styles.sideItemActive]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={[styles.sideItemDot, { backgroundColor: tier === t.value ? tierColors[t.value] : Colors.border }]} />
              <Text style={[styles.sideItemText, tier === t.value && styles.sideItemTextActive]}>{t.label}</Text>
            </View>
            <View style={[styles.sideCount, tier === t.value && { backgroundColor: tierColors[t.value] }]}>
              <Text style={[styles.sideCountText, tier === t.value && { color: '#FFFFFF' }]}>{t.count}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sort */}
      <View style={styles.sideSection}>
        <Text style={styles.sideSectionTitle}>SORT BY</Text>
        {sortOpts.map(s => (
          <TouchableOpacity key={s} onPress={() => onSort(s)}
            style={[styles.sideItem, sort === s && styles.sideItemActive]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={[styles.sideItemDot, { backgroundColor: sort === s ? Colors.primary : Colors.border }]} />
              <Text style={[styles.sideItemText, sort === s && styles.sideItemTextActive]}>{s}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Brands */}
      <View style={styles.sideSection}>
        <Text style={styles.sideSectionTitle}>BRANDS</Text>
        {brands.map(b => {
          const active = activeBrands.includes(b)
          return (
            <TouchableOpacity key={b} onPress={() => onBrand(b)}
              style={[styles.sideItem, active && styles.sideItemActive]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={[styles.sideCheckbox, active && styles.sideCheckboxActive]}>
                  {active && <Text style={styles.sideCheckMark}>✓</Text>}
                </View>
                <Text style={[styles.sideItemText, active && styles.sideItemTextActive]}>{b}</Text>
              </View>
              <Text style={styles.sideCount2}>
                {POOLS.filter(p => p.brand === b).length}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      {/* Trust */}
      <View style={styles.sideTrust}>
        <Text style={styles.sideTrustTitle}>Why Winify?</Text>
        {['✓ RANDOM.ORG verified draws', '✓ Instant prize delivery', '✓ 12,400+ winners', '✓ £2 flat entry fee'].map(t => (
          <Text key={t} style={styles.sideTrustItem}>{t}</Text>
        ))}
      </View>
    </View>
  )
}

// ─── Main Browse Page ─────────────────────────────────────────────────────
export default function BrowseWebScreen() {
  const [tier, setTier] = useState<Tier>('All')
  const [sort, setSort] = useState<SortOpt>('Ending Soon')
  const [search, setSearch] = useState('')
  const [activeBrands, setActiveBrands] = useState<string[]>([])

  const allBrands = [...new Set(POOLS.map(p => p.brand))].sort()

  const toggleBrand = (b: string) => {
    setActiveBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b])
  }

  let pools = POOLS.filter(p => {
    const matchTier = tier === 'All' || p.tier === tier
    const matchSearch = search === '' || p.prize.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())
    const matchBrand = activeBrands.length === 0 || activeBrands.includes(p.brand)
    return matchTier && matchSearch && matchBrand
  })

  if (sort === 'Ending Soon') pools = [...pools].sort((a, b) => a.pct - b.pct)
  else if (sort === 'Most Popular') pools = [...pools].sort((a, b) => b.pct - a.pct)
  else if (sort === 'Newest') pools = [...pools].sort((a, b) => b.id - a.id)
  else if (sort === 'Price: Low') pools = [...pools].sort((a, b) => a.price - b.price)

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      <Navbar />

      {/* Page Header */}
      <View style={styles.pageHeader}>
        <View style={styles.pageHeaderInner}>
          <Text style={styles.pageTitle}>Browse Competitions</Text>
          <Text style={styles.pageSubtitle}>{POOLS.length} live draws — new competitions added daily</Text>
        </View>
      </View>

      {/* Main Layout */}
      <View style={styles.mainLayout}>
        <View style={styles.mainInner}>
          {/* Sidebar */}
          <Sidebar
            tier={tier} onTier={setTier}
            sort={sort} onSort={setSort}
            brands={allBrands} activeBrands={activeBrands} onBrand={toggleBrand}
          />

          {/* Content */}
          <View style={styles.content}>
            {/* Search + results count */}
            <View style={styles.contentHeader}>
              <View style={styles.searchBox}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search by prize or brand..."
                  placeholderTextColor={Colors.muted}
                  style={styles.searchInput}
                />
                {search !== '' && (
                  <TouchableOpacity onPress={() => setSearch('')}>
                    <Text style={styles.clearBtn}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.resultsCount}>{pools.length} competitions found</Text>
            </View>

            {/* Active filters */}
            {(tier !== 'All' || activeBrands.length > 0) && (
              <View style={styles.activeFilters}>
                {tier !== 'All' && (
                  <TouchableOpacity onPress={() => setTier('All')} style={styles.activeFilterChip}>
                    <Text style={styles.activeFilterText}>{tier}</Text>
                    <Text style={styles.activeFilterRemove}> ✕</Text>
                  </TouchableOpacity>
                )}
                {activeBrands.map(b => (
                  <TouchableOpacity key={b} onPress={() => toggleBrand(b)} style={styles.activeFilterChip}>
                    <Text style={styles.activeFilterText}>{b}</Text>
                    <Text style={styles.activeFilterRemove}> ✕</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity onPress={() => { setTier('All'); setActiveBrands([]) }} style={styles.clearAllBtn}>
                  <Text style={styles.clearAllText}>Clear all</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Grid */}
            {pools.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyTitle}>No competitions found</Text>
                <Text style={styles.emptyDesc}>Try adjusting your filters or search terms.</Text>
                <TouchableOpacity onPress={() => { setTier('All'); setSearch(''); setActiveBrands([]) }} style={styles.emptyBtn}>
                  <Text style={styles.emptyBtnText}>Clear Filters</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.grid}>
                {pools.map(p => (
                  <View key={p.id} style={styles.gridItem}>
                    <CompCard pool={p} />
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerInner}>
          <View style={styles.footerBottom}>
            <Text style={styles.footerLogo}>Winify</Text>
            <Text style={styles.footerCopy}>© 2026 Winify. All rights reserved. Competitions are open to users aged 18+.</Text>
          </View>
        </View>
      </View>
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
  navLinkActive: { color: Colors.primary, fontWeight: '700' },
  navActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  loginBtn: { paddingHorizontal: 18, paddingVertical: 9, borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 8 },
  loginBtnText: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  signupBtn: { paddingHorizontal: 20, paddingVertical: 9, backgroundColor: Colors.primary, borderRadius: 8 },
  signupBtnText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },

  // Page header
  pageHeader: { backgroundColor: Colors.primaryDark, paddingVertical: 48, paddingHorizontal: 20 },
  pageHeaderInner: { maxWidth: MAX, marginHorizontal: 'auto' as any },
  pageTitle: { fontSize: 40, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 17, color: 'rgba(255,255,255,0.65)', marginTop: 8 },

  // Layout
  mainLayout: { paddingVertical: 40, paddingHorizontal: 20 },
  mainInner: { maxWidth: MAX, marginHorizontal: 'auto' as any, flexDirection: 'row', gap: 32, alignItems: 'flex-start' },

  // Sidebar
  sidebar: { width: 260 },
  sideSection: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 16, marginBottom: 16 },
  sideSectionTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 1, color: Colors.textSec, marginBottom: 12 },
  sideItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 9, paddingHorizontal: 8, borderRadius: 8, marginBottom: 2 },
  sideItemActive: { backgroundColor: Colors.primaryLight },
  sideItemDot: { width: 8, height: 8, borderRadius: 4 },
  sideItemText: { fontSize: 14, color: Colors.textSec, fontWeight: '500' },
  sideItemTextActive: { color: Colors.primary, fontWeight: '600' },
  sideCount: { backgroundColor: Colors.bg, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  sideCountText: { fontSize: 11, fontWeight: '700', color: Colors.textSec },
  sideCount2: { fontSize: 12, color: Colors.muted, fontWeight: '600' },
  sideCheckbox: { width: 16, height: 16, borderRadius: 4, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  sideCheckboxActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  sideCheckMark: { fontSize: 10, color: '#FFFFFF', fontWeight: '800' },
  sideTrust: { backgroundColor: Colors.primaryLight, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: Colors.border },
  sideTrustTitle: { fontSize: 14, fontWeight: '700', color: Colors.primary, marginBottom: 10 },
  sideTrustItem: { fontSize: 13, color: Colors.primary, fontWeight: '500', marginBottom: 6 },

  // Content
  content: { flex: 1 },
  contentHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, flex: 1, marginRight: 16, gap: 8 },
  searchIcon: { fontSize: 15 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text, outlineWidth: 0 } as any,
  clearBtn: { fontSize: 13, color: Colors.textSec, paddingHorizontal: 4 },
  resultsCount: { fontSize: 14, color: Colors.textSec, fontWeight: '500', whiteSpace: 'nowrap' as any },

  // Active filters
  activeFilters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16, alignItems: 'center' },
  activeFilterChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primaryLight, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5 },
  activeFilterText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  activeFilterRemove: { fontSize: 11, color: Colors.primary },
  clearAllBtn: { paddingHorizontal: 10, paddingVertical: 5 },
  clearAllText: { fontSize: 13, color: Colors.textSec, textDecorationLine: 'underline' },

  // Grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8 },
  gridItem: { width: '25%', paddingHorizontal: 8, marginBottom: 20 },

  // Comp card
  compCard: { backgroundColor: '#FFFFFF', borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 16, shadowOffset: { width: 0, height: 4 } },
  compCardImage: { height: 150, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  timePill: { position: 'absolute', top: 10, left: 10, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4ADE80' },
  timePillText: { fontSize: 11, fontWeight: '600', color: '#FFFFFF' },
  hotPill: { position: 'absolute', top: 10, right: 10, backgroundColor: '#EA580C', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  hotPillText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
  compCardLogo: { width: 110, height: 55 },
  compCardBody: { padding: 14 },
  tierRow: { flexDirection: 'row', gap: 6, marginBottom: 8, alignItems: 'center' },
  tierChip: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  tierChipText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  urgentChip: { backgroundColor: Colors.redBg, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  urgentChipText: { fontSize: 10, fontWeight: '700', color: Colors.red, letterSpacing: 0.5 },
  compCardPrize: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 4, lineHeight: 19 },
  compCardDesc: { fontSize: 12, color: Colors.textSec, lineHeight: 17, marginBottom: 12 },
  progressWrap: { marginBottom: 12 },
  progressBg: { height: 5, backgroundColor: '#F0EBFF', borderRadius: 999, marginBottom: 4 },
  progressFill: { height: '100%', borderRadius: 999 },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { fontSize: 11, color: Colors.textSec, fontWeight: '500' },
  compCardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priceBadge: { backgroundColor: Colors.primaryLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  priceBadgeText: { fontSize: 13, fontWeight: '800', color: Colors.primary },
  playBtn: { borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  playBtnText: { fontSize: 12, fontWeight: '600', color: Colors.primary },

  // Empty state
  emptyState: { alignItems: 'center', paddingVertical: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  emptyDesc: { fontSize: 15, color: Colors.textSec, marginBottom: 24 },
  emptyBtn: { backgroundColor: Colors.primary, borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12 },
  emptyBtnText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },

  // Footer
  footer: { backgroundColor: '#1A0A2E', paddingVertical: 32, paddingHorizontal: 20 },
  footerInner: { maxWidth: MAX, marginHorizontal: 'auto' as any },
  footerBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  footerLogo: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  footerCopy: { fontSize: 13, color: 'rgba(255,255,255,0.35)' },
})
