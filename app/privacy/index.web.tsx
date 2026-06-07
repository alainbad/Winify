import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { Colors } from '@/constants/theme'

export default function PrivacyPage() {
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
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.updated}>Last updated: June 2026</Text>

        {[
          { h: '1. Introduction', p: 'Tick Pick ("we", "our", "us") is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform at tick-pick.com.' },
          { h: '2. Data We Collect', p: 'We collect the following information: your name and email address (when you register), payment information (processed securely by our payment provider — we never store card details), competition entry records, and usage data (pages visited, time on site).' },
          { h: '3. How We Use Your Data', p: 'Your data is used to: process competition entries, notify you if you win, send service-related emails (receipts, draw results), improve our platform, and comply with legal obligations. We do not sell your data to third parties.' },
          { h: '4. Winner Announcements', p: 'Winners\' first names and winning ticket numbers are displayed publicly on our Winners page. Full names and contact details are never shared publicly without explicit consent.' },
          { h: '5. Data Storage', p: 'Your data is stored securely using Supabase, hosted on servers within the EU. We retain your data for as long as your account is active and for up to 3 years after account closure for legal compliance.' },
          { h: '6. Third-Party Services', p: 'We use the following third-party services: Supabase (database and authentication), Resend (transactional email), RANDOM.ORG (certified random draws), and Stripe/payment processors (payment handling). Each has their own privacy policies.' },
          { h: '7. Cookies', p: 'We use essential cookies only — these are required for the platform to function (session management, authentication). We do not use tracking or advertising cookies.' },
          { h: '8. Your Rights', p: 'Under GDPR, you have the right to: access your personal data, correct inaccurate data, request deletion of your data, object to processing, and data portability. To exercise any of these rights, contact us at privacy@tick-pick.com.' },
          { h: '9. Data Deletion', p: 'You can delete your account at any time from the Account page. Upon deletion, your personal data will be removed within 30 days, except where we are required to retain it for legal purposes.' },
          { h: '10. Contact', p: 'For privacy-related enquiries, contact our Data Protection Officer at privacy@tick-pick.com or write to: Tick Pick, United Kingdom.' },
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
          {[['Terms', '/terms'], ['Contact', '/contact'], ['Browse', '/browse']].map(([l, h]) => (
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
