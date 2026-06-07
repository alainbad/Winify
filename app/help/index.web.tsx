import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { Colors } from '@/constants/theme'

const FAQS = [
  { cat: 'Getting Started', items: [
    { q: 'How do I enter a competition?', a: 'Browse competitions, pick one you like, and click "Enter Now". Pay the $5 flat fee and you\'re in. You\'ll receive a confirmation email with your ticket number.' },
    { q: 'How much does it cost to enter?', a: 'Every ticket costs $5 flat. No hidden fees, no subscriptions.' },
    { q: 'Do I need an account?', a: 'Yes, you\'ll need to create a free account to enter. This lets us contact you if you win and keep track of your entries.' },
  ]},
  { cat: 'The Draw', items: [
    { q: 'How is the winner chosen?', a: 'Winners are selected using RANDOM.ORG — a certified true random number generator. The draw happens automatically the moment all tickets sell out.' },
    { q: 'When does the draw happen?', a: 'Automatically when all tickets for a competition are sold. There is no manual trigger — it\'s fully automated.' },
    { q: 'Can I see past winners?', a: 'Yes! Visit our Winners page to see all past draw results, including ticket numbers and draw dates.' },
  ]},
  { cat: 'Prizes & Delivery', items: [
    { q: 'When do I receive my prize?', a: 'Digital prizes (gift cards, vouchers) are sent within 24 hours of winning. Physical prizes take 3–7 business days.' },
    { q: 'How will I know if I won?', a: 'You\'ll receive an email immediately after the draw. The winner is also displayed publicly on our Winners page.' },
    { q: 'What if I don\'t claim my prize?', a: 'You have 7 days to respond to the winner notification email. After that, the prize may be redrawn.' },
  ]},
  { cat: 'Account & Payments', items: [
    { q: 'Are tickets refundable?', a: 'Tickets are non-refundable once purchased. If a competition is cancelled by us, you\'ll receive a full automatic refund.' },
    { q: 'How do I delete my account?', a: 'Go to Account → scroll to the bottom → Delete Account. Your data will be removed within 30 days.' },
    { q: 'Is my payment information safe?', a: 'Yes. We never store card details. All payments are processed securely by our payment provider.' },
  ]},
]

export default function HelpPage() {
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
        <Text style={styles.heroTitle}>Help Centre</Text>
        <Text style={styles.heroSub}>Find answers to common questions below, or contact us directly.</Text>
      </View>

      <View style={styles.content}>
        {FAQS.map(cat => (
          <View key={cat.cat} style={styles.catSection}>
            <Text style={styles.catTitle}>{cat.cat}</Text>
            {cat.items.map(f => (
              <View key={f.q} style={styles.faq}>
                <Text style={styles.faqQ}>{f.q}</Text>
                <Text style={styles.faqA}>{f.a}</Text>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.contactBox}>
          <Text style={styles.contactTitle}>Still need help?</Text>
          <Text style={styles.contactSub}>Our support team responds within 24 hours.</Text>
          <a href="/contact" style={{ textDecoration: 'none' }}>
            <View style={styles.contactBtn}>
              <Text style={styles.contactBtnText}>Contact Support →</Text>
            </View>
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
  hero: { backgroundColor: Colors.primary, paddingVertical: 56, paddingHorizontal: 32, alignItems: 'center' },
  heroTitle: { fontSize: 36, fontWeight: '900', color: '#fff', marginBottom: 10 },
  heroSub: { fontSize: 16, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  content: { maxWidth: 720, alignSelf: 'center', width: '100%', paddingHorizontal: 32, paddingVertical: 56 },
  catSection: { marginBottom: 40 },
  catTitle: { fontSize: 20, fontWeight: '900', color: Colors.primary, marginBottom: 16 },
  faq: { borderBottomWidth: 1, borderBottomColor: Colors.border, paddingVertical: 18 },
  faqQ: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 6 },
  faqA: { fontSize: 14, color: Colors.textSec, lineHeight: 22 },
  contactBox: { backgroundColor: Colors.primaryLight, borderRadius: 16, padding: 32, alignItems: 'center', marginTop: 16 },
  contactTitle: { fontSize: 20, fontWeight: '900', color: Colors.text, marginBottom: 6 },
  contactSub: { fontSize: 14, color: Colors.textSec, marginBottom: 20 },
  contactBtn: { backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 28 },
  contactBtnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  footer: { backgroundColor: '#1A0A2E', paddingVertical: 32, alignItems: 'center' },
  footerText: { fontSize: 13, color: 'rgba(255,255,255,0.4)' },
  footerLink: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
})
