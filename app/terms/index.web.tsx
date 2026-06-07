import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { Colors } from '@/constants/theme'

export default function TermsPage() {
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

      <View style={styles.content}>
        <Text style={styles.title}>Terms & Conditions</Text>
        <Text style={styles.updated}>Last updated: June 2026</Text>

        {[
          { h: '1. Eligibility', p: 'Tick Pick competitions are open to users aged 18 and over. By entering any competition, you confirm that you are at least 18 years of age. We reserve the right to request proof of age at any time.' },
          { h: '2. Entry', p: 'Each competition ticket costs $5 (flat fee). There is no limit on the number of tickets a single user may purchase per competition. All entries are final and non-refundable once payment is processed.' },
          { h: '3. The Draw', p: 'Draws are conducted automatically using RANDOM.ORG — a certified true random number generator. The draw is triggered immediately when all tickets for a competition have been sold. No manual intervention is involved.' },
          { h: '4. Winners', p: 'Winners are selected at random. The winning ticket holder will be notified by email within 1 hour of the draw. Winners must respond within 7 days to claim their prize. Unclaimed prizes may be redrawn.' },
          { h: '5. Prizes', p: 'Prizes are as advertised. Tick Pick reserves the right to substitute a prize of equal or greater value in exceptional circumstances. Prizes are non-transferable and cannot be exchanged for cash.' },
          { h: '6. Prize Delivery', p: 'Prizes will be delivered within 24 hours of winner verification for digital prizes (gift cards, vouchers). Physical prizes may take 3–7 business days depending on the delivery method.' },
          { h: '7. Fairness', p: 'All competitions are run fairly and transparently. Results are published publicly on our Winners page. We do not manipulate draws or favour any participants.' },
          { h: '8. Prohibited Conduct', p: 'Users may not use automated tools, bots, or scripts to enter competitions. Any attempt to manipulate the outcome of a draw will result in immediate disqualification and account termination.' },
          { h: '9. Limitation of Liability', p: 'Tick Pick is not liable for any technical failures, payment processing errors, or force majeure events that may affect competition entry or prize delivery. Our liability is limited to the value of the ticket purchased.' },
          { h: '10. Changes to Terms', p: 'We reserve the right to update these terms at any time. Continued use of the platform constitutes acceptance of the updated terms. Material changes will be communicated by email.' },
          { h: '11. Governing Law', p: 'These terms are governed by the laws of the United Kingdom. Any disputes shall be subject to the exclusive jurisdiction of UK courts.' },
          { h: '12. Contact', p: 'For any questions regarding these terms, please contact us at support@tick-pick.com.' },
        ].map(s => (
          <View key={s.h} style={styles.section}>
            <Text style={styles.h2}>{s.h}</Text>
            <Text style={styles.p}>{s.p}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 Tick Pick. All rights reserved.</Text>
        <View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
          {[['Privacy', '/privacy'], ['Contact', '/contact'], ['Browse', '/browse']].map(([l, h]) => (
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
  title: { fontSize: 36, fontWeight: '900', color: Colors.text, marginBottom: 8 },
  updated: { fontSize: 13, color: Colors.muted, marginBottom: 40 },
  section: { marginBottom: 28 },
  h2: { fontSize: 17, fontWeight: '800', color: Colors.text, marginBottom: 8 },
  p: { fontSize: 15, color: Colors.textSec, lineHeight: 26 },
  footer: { backgroundColor: '#1A0A2E', paddingVertical: 32, alignItems: 'center' },
  footerText: { fontSize: 13, color: 'rgba(255,255,255,0.4)' },
  footerLink: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
})
