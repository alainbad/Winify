import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { Colors } from '@/constants/theme'

const POSTS = [
  { date: 'June 2026', tag: 'How It Works', href: '/blog/random-org-fairness', title: 'How RANDOM.ORG Ensures Every Tick Pick Draw Is 100% Fair', excerpt: 'We use certified true random numbers generated from atmospheric noise — not computer algorithms — to pick every winner. Here\'s why that matters.' },
  { date: 'June 2026', tag: 'Winners', href: '/blog/first-mega-winner', title: 'Our First MEGA Draw Winner: $1,000 Voucher Claimed in 12 Hours', excerpt: 'Last week we completed our first MEGA tier competition. The pool filled in under 3 days and the winner was notified and paid within 12 hours.' },
  { date: 'May 2026', tag: 'Platform', href: '/blog/volume-tier', title: 'Introducing VOLUME Tier: More Prizes, More Draws', excerpt: 'Following strong demand for mid-range competitions, we\'ve launched our VOLUME tier with $150, $200, and $300 prize pools.' },
  { date: 'May 2026', tag: 'Tips', href: '/blog/5-tips', title: '5 Tips to Maximise Your Chances on Tick Pick', excerpt: 'While every draw is random, there are smart strategies to get more value from your entries. Here\'s what our most active users do differently.' },
]

export default function BlogPage() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.nav}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}><Text style={{ fontSize: 18 }}>⭐</Text></View>
            <Text style={styles.logoText}><Text style={{ color: Colors.primary }}>Tick</Text><Text style={{ color: '#F59E0B' }}>Pick</Text></Text>
          </View>
        </a>
        <a href="/browse" style={{ textDecoration: 'none' }}><Text style={styles.navLink}>Browse Competitions</Text></a>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Tick Pick Blog</Text>
        <Text style={styles.heroSub}>News, winner stories, and platform updates.</Text>
      </View>

      <View style={styles.content}>
        {POSTS.map(p => (
          <View key={p.title} style={styles.post}>
            <View style={styles.postMeta}>
              <View style={styles.tag}><Text style={styles.tagText}>{p.tag}</Text></View>
              <Text style={styles.date}>{p.date}</Text>
            </View>
            <a href={p.href} style={{ textDecoration: 'none' }}>
              <Text style={styles.postTitle}>{p.title}</Text>
            </a>
            <Text style={styles.postExcerpt}>{p.excerpt}</Text>
            <a href={p.href} style={{ textDecoration: 'none' }}>
              <Text style={styles.readMore}>Read more →</Text>
            </a>
          </View>
        ))}
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
  hero: { backgroundColor: Colors.primary, paddingVertical: 56, paddingHorizontal: 32, alignItems: 'center' },
  heroTitle: { fontSize: 36, fontWeight: '900', color: '#fff', marginBottom: 10 },
  heroSub: { fontSize: 16, color: 'rgba(255,255,255,0.8)' },
  content: { maxWidth: 720, alignSelf: 'center', width: '100%', paddingHorizontal: 32, paddingVertical: 56, gap: 32 },
  post: { borderBottomWidth: 1, borderBottomColor: Colors.border, paddingBottom: 32 },
  postMeta: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  tag: { backgroundColor: Colors.primaryLight, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3 },
  tagText: { fontSize: 11, fontWeight: '700', color: Colors.primary },
  date: { fontSize: 12, color: Colors.muted },
  postTitle: { fontSize: 20, fontWeight: '800', color: Colors.text, marginBottom: 10, lineHeight: 28 },
  postExcerpt: { fontSize: 14, color: Colors.textSec, lineHeight: 22, marginBottom: 12 },
  readMore: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  footer: { backgroundColor: '#1A0A2E', paddingVertical: 32, alignItems: 'center' },
  footerText: { fontSize: 13, color: 'rgba(255,255,255,0.4)' },
  footerLink: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
})
