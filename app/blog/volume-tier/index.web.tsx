import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { Colors } from '@/constants/theme'

export default function BlogPost() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.nav}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}><Text style={{ fontSize: 18 }}>⭐</Text></View>
            <Text style={styles.logoText}><Text style={{ color: Colors.primary }}>Tick</Text><Text style={{ color: '#F59E0B' }}>Pick</Text></Text>
          </View>
        </a>
        <a href="/blog" style={{ textDecoration: 'none' }}><Text style={styles.navLink}>← Back to Blog</Text></a>
      </View>

      <View style={styles.content}>
        <View style={styles.meta}>
          <View style={styles.tag}><Text style={styles.tagText}>Platform</Text></View>
          <Text style={styles.date}>May 2026 · 3 min read</Text>
        </View>
        <Text style={styles.title}>Introducing VOLUME Tier: More Prizes, More Draws</Text>
        <Text style={styles.lead}>Following strong demand for mid-range competitions, we've launched our VOLUME tier with $150, $200, and $300 prize pools.</Text>

        <Text style={styles.h2}>Why We Built VOLUME Tier</Text>
        <Text style={styles.p}>When we launched Tick Pick, we offered MICRO competitions (up to $100) and MEGA competitions ($500+). Users loved both — but many asked for something in between: bigger prizes than MICRO, but pools that fill faster than MEGA.</Text>
        <Text style={styles.p}>VOLUME tier is the answer. Pools range from 45 to 90 tickets, with prizes of $150, $200, and $300. They fill faster than MEGA competitions and offer significantly bigger prizes than MICRO.</Text>

        <Text style={styles.h2}>The Three VOLUME Pools</Text>
        {[
          { prize: '$150', tickets: '45 tickets', cost: '$225 total pool value' },
          { prize: '$200', tickets: '60 tickets', cost: '$300 total pool value' },
          { prize: '$300', tickets: '90 tickets', cost: '$450 total pool value' },
        ].map(t => (
          <View key={t.prize} style={styles.tierRow}>
            <View style={styles.tierBadge}><Text style={styles.tierBadgeText}>{t.prize}</Text></View>
            <View>
              <Text style={styles.tierTitle}>{t.tickets}</Text>
              <Text style={styles.tierSub}>{t.cost}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.h2}>Same Rules, Same Fairness</Text>
        <Text style={styles.p}>VOLUME draws use the exact same automated system as all other Tick Pick competitions. When the last ticket sells, RANDOM.ORG selects the winner instantly. No delays, no manual intervention.</Text>
        <Text style={styles.p}>Every VOLUME result is published on our public Winners page, with the winning ticket number and draw timestamp for full transparency.</Text>

        <Text style={styles.h2}>How to Enter</Text>
        <Text style={styles.p}>Head to our Browse page and filter by "VOLUME" to see all current VOLUME competitions. Each ticket is $5. You can enter multiple tickets in a single competition to increase your chances.</Text>

        <View style={styles.ctaBox}>
          <Text style={styles.ctaTitle}>Browse VOLUME Competitions</Text>
          <Text style={styles.ctaSub}>$5 per ticket · Fair draw · Instant payout</Text>
          <a href="/browse" style={{ textDecoration: 'none' }}>
            <View style={styles.ctaBtn}><Text style={styles.ctaBtnText}>Browse Now →</Text></View>
          </a>
        </View>
      </View>

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
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 32, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 22, fontWeight: '800' },
  navLink: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  content: { maxWidth: 720, alignSelf: 'center', width: '100%', paddingHorizontal: 32, paddingVertical: 56 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  tag: { backgroundColor: Colors.primaryLight, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3 },
  tagText: { fontSize: 11, fontWeight: '700', color: Colors.primary },
  date: { fontSize: 12, color: Colors.muted },
  title: { fontSize: 32, fontWeight: '900', color: Colors.text, lineHeight: 42, marginBottom: 16 },
  lead: { fontSize: 17, color: Colors.textSec, lineHeight: 28, marginBottom: 32, borderLeftWidth: 3, borderLeftColor: Colors.primary, paddingLeft: 16 },
  h2: { fontSize: 20, fontWeight: '800', color: Colors.text, marginTop: 32, marginBottom: 10 },
  p: { fontSize: 15, color: Colors.textSec, lineHeight: 26, marginBottom: 14 },
  tierRow: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: Colors.card, borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: Colors.border },
  tierBadge: { backgroundColor: Colors.primary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  tierBadgeText: { fontSize: 16, fontWeight: '900', color: '#fff' },
  tierTitle: { fontSize: 14, fontWeight: '700', color: Colors.text },
  tierSub: { fontSize: 12, color: Colors.muted, marginTop: 2 },
  ctaBox: { backgroundColor: Colors.primaryLight, borderRadius: 16, padding: 32, alignItems: 'center', marginTop: 40 },
  ctaTitle: { fontSize: 20, fontWeight: '900', color: Colors.text, marginBottom: 6 },
  ctaSub: { fontSize: 14, color: Colors.textSec, marginBottom: 20 },
  ctaBtn: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 28 },
  ctaBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  footer: { backgroundColor: '#1A0A2E', paddingVertical: 32, alignItems: 'center' },
  footerText: { fontSize: 13, color: 'rgba(255,255,255,0.4)' },
  footerLink: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
})
