import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { Colors } from '@/constants/theme'

export default function ContactPage() {
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
        <Text style={styles.heroTitle}>Contact Us</Text>
        <Text style={styles.heroSub}>We're here to help — get in touch and we'll respond within 24 hours.</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.cards}>
          {[
            { icon: '📧', title: 'General Enquiries', detail: 'support@tick-pick.com', note: 'Response within 24 hours' },
            { icon: '🏆', title: 'Winner Support', detail: 'winners@tick-pick.com', note: 'Prize claims & delivery' },
            { icon: '🔒', title: 'Privacy & Data', detail: 'privacy@tick-pick.com', note: 'GDPR requests & data deletion' },
          ].map(c => (
            <View key={c.title} style={styles.card}>
              <Text style={styles.cardIcon}>{c.icon}</Text>
              <Text style={styles.cardTitle}>{c.title}</Text>
              <Text style={styles.cardDetail}>{c.detail}</Text>
              <Text style={styles.cardNote}>{c.note}</Text>
            </View>
          ))}
        </View>

        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          {[
            { q: 'When will I receive my prize?', a: 'Digital prizes (gift cards, vouchers) are delivered within 24 hours of winner verification. Physical prizes may take 3–7 business days.' },
            { q: 'How do I know the draw is fair?', a: 'Every draw uses RANDOM.ORG — a certified true random number generator. Results are published publicly on our Winners page immediately after each draw.' },
            { q: 'Can I get a refund on my ticket?', a: 'All tickets are non-refundable once purchased. If a competition is cancelled by Tick Pick, a full refund will be issued automatically.' },
            { q: 'How do I claim my prize?', a: 'You\'ll receive an email notification immediately after winning. Simply reply to the email with your delivery details and we\'ll process your prize within 24 hours.' },
            { q: 'Is there an age restriction?', a: 'Yes — competitions are only open to users aged 18 and over. We may request proof of age before releasing a prize.' },
          ].map(f => (
            <View key={f.q} style={styles.faq}>
              <Text style={styles.faqQ}>{f.q}</Text>
              <Text style={styles.faqA}>{f.a}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 Tick Pick. All rights reserved.</Text>
        <View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
          {[['Terms', '/terms'], ['Privacy', '/privacy'], ['Browse', '/browse']].map(([l, h]) => (
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
  heroSub: { fontSize: 16, color: 'rgba(255,255,255,0.8)', textAlign: 'center', maxWidth: 480 },
  content: { maxWidth: 800, alignSelf: 'center', width: '100%', paddingHorizontal: 32, paddingVertical: 56 },
  cards: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, marginBottom: 56 },
  card: { flex: 1, minWidth: 200, backgroundColor: Colors.card, borderRadius: 16, padding: 24, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  cardIcon: { fontSize: 32, marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: Colors.text, marginBottom: 6 },
  cardDetail: { fontSize: 14, color: Colors.primary, fontWeight: '600', marginBottom: 4 },
  cardNote: { fontSize: 12, color: Colors.muted, textAlign: 'center' },
  faqSection: { gap: 0 },
  faqTitle: { fontSize: 24, fontWeight: '900', color: Colors.text, marginBottom: 24 },
  faq: { borderBottomWidth: 1, borderBottomColor: Colors.border, paddingVertical: 20 },
  faqQ: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  faqA: { fontSize: 14, color: Colors.textSec, lineHeight: 22 },
  footer: { backgroundColor: '#1A0A2E', paddingVertical: 32, alignItems: 'center' },
  footerText: { fontSize: 13, color: 'rgba(255,255,255,0.4)' },
  footerLink: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
})
