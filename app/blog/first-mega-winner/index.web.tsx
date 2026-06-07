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
          <View style={styles.tag}><Text style={styles.tagText}>Winners</Text></View>
          <Text style={styles.date}>June 2026 · 3 min read</Text>
        </View>
        <Text style={styles.title}>Our First MEGA Draw Winner: $1,000 Voucher Claimed in 12 Hours</Text>
        <Text style={styles.lead}>Last week we completed our first MEGA tier competition. The pool filled in under 3 days and the winner was notified and paid within 12 hours.</Text>

        <Text style={styles.h2}>The Competition</Text>
        <Text style={styles.p}>Our first MEGA $1,000 competition launched with 300 tickets at $5 each. We weren't sure how quickly it would fill — MEGA tier is our biggest pool size — but the response was incredible. All 300 tickets sold within 72 hours of launch.</Text>

        <Text style={styles.h2}>The Draw</Text>
        <Text style={styles.p}>The moment ticket #300 was sold, our automated draw system triggered immediately. A request was sent to RANDOM.ORG's API, which returned a certified random number between 1 and 300. The result: ticket #187.</Text>
        <Text style={styles.p}>The entire draw took less than 2 seconds from ticket sale to winner selection. No human involvement whatsoever.</Text>

        <Text style={styles.h2}>The Winner</Text>
        <Text style={styles.p}>The winner received an automated email notification within 60 seconds of the draw. They responded within 4 hours with their delivery details, and the $1,000 voucher was sent within 12 hours of them claiming the prize.</Text>
        <Text style={styles.p}>"I honestly didn't believe I'd won at first," the winner told us. "The email came so fast after I'd entered. I checked the Winners page and there was my ticket number. Incredible."</Text>

        <Text style={styles.h2}>What This Proves</Text>
        <Text style={styles.p}>Our fully automated pipeline — from ticket sale to draw to winner notification to prize delivery — works exactly as designed. Fast, fair, and transparent.</Text>
        <Text style={styles.p}>You can verify every draw result on our public Winners page. The winning ticket number, total entries, and draw timestamp are all publicly visible.</Text>

        <View style={styles.winnerBox}>
          <Text style={styles.winnerLabel}>🏆 First MEGA Winner</Text>
          <Text style={styles.winnerDetail}>Prize: $1,000 Voucher</Text>
          <Text style={styles.winnerDetail}>Tickets: 300 sold</Text>
          <Text style={styles.winnerDetail}>Winning Ticket: #187</Text>
          <Text style={styles.winnerDetail}>Prize Delivered: Within 12 hours</Text>
        </View>

        <View style={styles.ctaBox}>
          <Text style={styles.ctaTitle}>Enter Our Next MEGA Draw</Text>
          <Text style={styles.ctaSub}>$5 per ticket. Fully automated. 100% fair.</Text>
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
  winnerBox: { backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0', borderRadius: 16, padding: 24, marginTop: 32, gap: 8 },
  winnerLabel: { fontSize: 16, fontWeight: '800', color: '#15803D', marginBottom: 4 },
  winnerDetail: { fontSize: 14, color: '#166534' },
  ctaBox: { backgroundColor: Colors.primaryLight, borderRadius: 16, padding: 32, alignItems: 'center', marginTop: 40 },
  ctaTitle: { fontSize: 20, fontWeight: '900', color: Colors.text, marginBottom: 6 },
  ctaSub: { fontSize: 14, color: Colors.textSec, marginBottom: 20 },
  ctaBtn: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 28 },
  ctaBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  footer: { backgroundColor: '#1A0A2E', paddingVertical: 32, alignItems: 'center' },
  footerText: { fontSize: 13, color: 'rgba(255,255,255,0.4)' },
  footerLink: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
})
