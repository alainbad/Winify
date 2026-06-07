import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { Colors } from '@/constants/theme'

const NAV_LINKS = [
  { label: 'Browse', href: '/browse' },
  { label: 'Winners', href: '/winners' },
  { label: 'My Entries', href: '/entries' },
  { label: 'Account', href: '/account' },
]

export default function AboutPage() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} showsVerticalScrollIndicator={false}>
      {/* Navbar */}
      <View style={styles.nav}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <Text style={{ fontSize: 18 }}>⭐</Text>
            </View>
            <Text style={styles.logoText}><Text style={{ color: Colors.primary }}>Tick</Text><Text style={{ color: '#F59E0B' }}>Pick</Text></Text>
          </View>
        </a>
        <View style={styles.navLinks}>
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} style={{ textDecoration: 'none' }}>
              <Text style={styles.navLink}>{l.label}</Text>
            </a>
          ))}
        </View>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>About Tick Pick</Text>
        <Text style={styles.heroSub}>Fair, transparent prize competitions — built for everyone.</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.h2}>Who We Are</Text>
        <Text style={styles.p}>
          Tick Pick is a UK-based prize competition platform that gives everyone a fair shot at winning incredible prizes. From $50 gift cards to $1,000 vouchers, our competitions are designed to be affordable, transparent, and genuinely exciting.
        </Text>

        <Text style={styles.h2}>How We're Different</Text>
        <Text style={styles.p}>
          Every draw on Tick Pick uses RANDOM.ORG — a certified true random number generator — to pick winners. There are no algorithms, no favourites, and no hidden processes. When tickets sell out, the draw happens automatically. Every result is publicly displayed on our Winners page.
        </Text>

        <Text style={styles.h2}>Our Tiers</Text>
        <Text style={styles.p}>We offer three competition tiers to suit every budget:</Text>
        <View style={styles.tierList}>
          {[
            { tier: 'MICRO', desc: '$50 · $75 · $100 prizes — smaller pools, faster draws' },
            { tier: 'VOLUME', desc: '$150 · $200 · $300 prizes — great value, frequent wins' },
            { tier: 'MEGA', desc: '$500 · $750 · $1,000 prizes — our biggest competitions' },
          ].map(t => (
            <View key={t.tier} style={styles.tierRow}>
              <View style={styles.tierBadge}><Text style={styles.tierBadgeText}>{t.tier}</Text></View>
              <Text style={styles.tierDesc}>{t.desc}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.h2}>Our Mission</Text>
        <Text style={styles.p}>
          We believe prize competitions should be simple, affordable, and trustworthy. No subscriptions, no complicated rules — just enter for a flat $5, and let the draw decide. We're committed to paying out prizes within 24 hours of every draw.
        </Text>

        <a href="/browse" style={{ textDecoration: 'none' }}>
          <View style={styles.cta}>
            <Text style={styles.ctaText}>Browse Competitions →</Text>
          </View>
        </a>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 Tick Pick. All rights reserved.</Text>
        <View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
          {[['Terms', '/terms'], ['Privacy', '/privacy'], ['Contact', '/contact']].map(([l, h]) => (
            <a key={l} href={h} style={{ textDecoration: 'none' }}><Text style={styles.footerLink}>{l}</Text></a>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 32, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: '#fff' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 22, fontWeight: '800' },
  navLinks: { flexDirection: 'row', gap: 28 },
  navLink: { fontSize: 14, fontWeight: '600', color: Colors.textSec },
  hero: { backgroundColor: Colors.primary, paddingVertical: 64, paddingHorizontal: 32, alignItems: 'center' },
  heroTitle: { fontSize: 40, fontWeight: '900', color: '#fff', textAlign: 'center', marginBottom: 12 },
  heroSub: { fontSize: 18, color: 'rgba(255,255,255,0.8)', textAlign: 'center', maxWidth: 560 },
  content: { maxWidth: 720, alignSelf: 'center', width: '100%', paddingHorizontal: 32, paddingVertical: 56 },
  h2: { fontSize: 22, fontWeight: '800', color: Colors.text, marginTop: 36, marginBottom: 12 },
  p: { fontSize: 15, color: Colors.textSec, lineHeight: 26 },
  tierList: { gap: 12, marginTop: 16 },
  tierRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  tierBadge: { backgroundColor: Colors.primaryLight, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 },
  tierBadgeText: { fontSize: 12, fontWeight: '800', color: Colors.primary },
  tierDesc: { fontSize: 14, color: Colors.textSec },
  cta: { marginTop: 40, backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  ctaText: { fontSize: 16, fontWeight: '800', color: '#fff' },
  footer: { backgroundColor: '#1A0A2E', paddingVertical: 32, alignItems: 'center' },
  footerText: { fontSize: 13, color: 'rgba(255,255,255,0.4)' },
  footerLink: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
})
