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
          <View style={styles.tag}><Text style={styles.tagText}>How It Works</Text></View>
          <Text style={styles.date}>June 2026 · 4 min read</Text>
        </View>
        <Text style={styles.title}>How RANDOM.ORG Ensures Every Tick Pick Draw Is 100% Fair</Text>
        <Text style={styles.lead}>We use certified true random numbers generated from atmospheric noise — not computer algorithms — to pick every winner. Here's why that matters.</Text>

        <Text style={styles.h2}>The Problem with Computer Randomness</Text>
        <Text style={styles.p}>Most software uses what's called a pseudorandom number generator (PRNG) — an algorithm that produces numbers that look random but are actually determined by a starting value called a seed. If you know the seed, you can predict every number the algorithm will produce.</Text>
        <Text style={styles.p}>For prize competitions, this is a serious problem. Any system using PRNGs could — in theory — be manipulated or predicted. We wanted something better.</Text>

        <Text style={styles.h2}>Atmospheric Noise: True Randomness</Text>
        <Text style={styles.p}>RANDOM.ORG generates random numbers from atmospheric noise — radio static picked up from the air around us. Unlike computer algorithms, atmospheric noise is genuinely unpredictable. It cannot be seeded, predicted, or reproduced.</Text>
        <Text style={styles.p}>This is the same technology used by cryptographers, scientists, and lotteries around the world that need genuine randomness.</Text>

        <Text style={styles.h2}>How We Use It</Text>
        <Text style={styles.p}>When a Tick Pick competition sells its last ticket, our system automatically calls the RANDOM.ORG API and requests a single random integer between 1 and the total number of entries. That number corresponds to a ticket — and that ticket holder wins.</Text>
        <Text style={styles.p}>The entire process is automated. No human touches the draw. No one at Tick Pick can influence the outcome.</Text>

        <Text style={styles.h2}>Verifiable Results</Text>
        <Text style={styles.p}>Every draw result is published on our public Winners page immediately after it happens. You can see the winning ticket number, the total entries, and the draw date. We believe in full transparency — every result is visible to everyone, forever.</Text>

        <Text style={styles.h2}>Why This Matters to You</Text>
        <Text style={styles.p}>When you enter a Tick Pick competition, you deserve to know the draw is fair. We chose RANDOM.ORG specifically because it's independently audited, openly documented, and trusted by organisations worldwide. Your $5 gives you exactly the same chance as every other ticket holder — nothing more, nothing less.</Text>

        <View style={styles.ctaBox}>
          <Text style={styles.ctaTitle}>Ready to Enter?</Text>
          <Text style={styles.ctaSub}>Browse live competitions and enter for just $5.</Text>
          <a href="/browse" style={{ textDecoration: 'none' }}>
            <View style={styles.ctaBtn}><Text style={styles.ctaBtnText}>Browse Competitions →</Text></View>
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
  ctaBox: { backgroundColor: Colors.primaryLight, borderRadius: 16, padding: 32, alignItems: 'center', marginTop: 40 },
  ctaTitle: { fontSize: 20, fontWeight: '900', color: Colors.text, marginBottom: 6 },
  ctaSub: { fontSize: 14, color: Colors.textSec, marginBottom: 20 },
  ctaBtn: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 28 },
  ctaBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  footer: { backgroundColor: '#1A0A2E', paddingVertical: 32, alignItems: 'center' },
  footerText: { fontSize: 13, color: 'rgba(255,255,255,0.4)' },
  footerLink: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
})
