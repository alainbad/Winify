import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { Colors } from '@/constants/theme'

const TIPS = [
  { n: '1', title: 'Enter Smaller Pools for Better Odds', body: 'MICRO competitions have fewer tickets (15–25) compared to MEGA (150–300). If your goal is maximising your chance of winning — not maximising prize size — MICRO pools give you the best odds per $5 spent.' },
  { n: '2', title: 'Buy Multiple Tickets in One Competition', body: 'Each additional ticket linearly increases your odds. In a 25-ticket MICRO pool, one ticket gives you a 4% chance. Two tickets gives you 8%. Three gives you 12%. Concentrating entries in fewer competitions often beats spreading thin across many.' },
  { n: '3', title: 'Enter New Competitions Early', body: 'Pools that just launched have the fewest tickets sold, which means if you enter early, you lock in your odds before other buyers arrive. Check the Browse page regularly for newly listed competitions.' },
  { n: '4', title: 'Track Which Pools Are Close to Filling', body: 'A pool that\'s 90% full is days — sometimes hours — from the draw. Entering a nearly-full competition means you\'ll find out if you won very soon. This is also great if you want the excitement of watching the final tickets sell.' },
  { n: '5', title: 'Check the Winners Page for Patterns', body: 'Our Winners page shows every past draw. You can see how quickly different pool sizes fill, what time of day draws tend to happen, and which tier has been running most frequently. This helps you plan when to enter.' },
]

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
          <View style={styles.tag}><Text style={styles.tagText}>Tips</Text></View>
          <Text style={styles.date}>May 2026 · 5 min read</Text>
        </View>
        <Text style={styles.title}>5 Tips to Maximise Your Chances on Tick Pick</Text>
        <Text style={styles.lead}>While every draw is random, there are smart strategies to get more value from your entries. Here's what our most active users do differently.</Text>

        <Text style={styles.p}>Every Tick Pick draw is 100% random — your ticket has exactly the same chance as every other ticket in the pool. But that doesn't mean all entry strategies are equal. Here are five tips to make your $5 entries work harder.</Text>

        {TIPS.map(tip => (
          <View key={tip.n} style={styles.tipCard}>
            <View style={styles.tipNum}><Text style={styles.tipNumText}>{tip.n}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipBody}>{tip.body}</Text>
            </View>
          </View>
        ))}

        <Text style={styles.h2}>The Bottom Line</Text>
        <Text style={styles.p}>No strategy can guarantee a win — that's the nature of a fair random draw. But you can absolutely make smarter decisions about where and when to enter. The tips above are based on simple probability, not luck.</Text>
        <Text style={styles.p}>Happy entering — and good luck!</Text>

        <View style={styles.ctaBox}>
          <Text style={styles.ctaTitle}>Start Entering Now</Text>
          <Text style={styles.ctaSub}>Browse live competitions · $5 per ticket</Text>
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
  tipCard: { flexDirection: 'row', gap: 20, backgroundColor: Colors.card, borderRadius: 16, padding: 24, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  tipNum: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  tipNumText: { fontSize: 18, fontWeight: '900', color: '#fff' },
  tipTitle: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 8 },
  tipBody: { fontSize: 14, color: Colors.textSec, lineHeight: 22 },
  ctaBox: { backgroundColor: Colors.primaryLight, borderRadius: 16, padding: 32, alignItems: 'center', marginTop: 40 },
  ctaTitle: { fontSize: 20, fontWeight: '900', color: Colors.text, marginBottom: 6 },
  ctaSub: { fontSize: 14, color: Colors.textSec, marginBottom: 20 },
  ctaBtn: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 28 },
  ctaBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  footer: { backgroundColor: '#1A0A2E', paddingVertical: 32, alignItems: 'center' },
  footerText: { fontSize: 13, color: 'rgba(255,255,255,0.4)' },
  footerLink: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
})
