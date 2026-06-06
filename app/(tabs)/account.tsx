import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Colors } from '@/constants/theme'

function SettingsRow({ icon, label, danger }: { icon: string; label: string; danger?: boolean }) {
  return (
    <TouchableOpacity style={styles.settingsRow} activeOpacity={0.7}>
      <Text style={{ fontSize: 18, marginRight: 12 }}>{icon}</Text>
      <Text style={[styles.settingsLabel, danger && { color: Colors.red }]}>{label}</Text>
      {!danger && <Text style={{ marginLeft: 'auto', color: Colors.muted, fontSize: 16 }}>›</Text>}
    </TouchableOpacity>
  )
}

export default function AccountScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <View style={styles.header}>
        <Text style={styles.title}>Account</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={{ fontSize: 28, fontWeight: '800', color: 'white' }}>AJ</Text>
          </View>
          <Text style={styles.profileName}>Alex Johnson</Text>
          <Text style={styles.profileEmail}>a***@gmail.com</Text>
          <Text style={styles.profileMember}>Member since Jan 2026</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Entries</Text>
          </View>
          <View style={[styles.statItem, styles.statDivider]}>
            <Text style={[styles.statValue, { color: Colors.gold }]}>1</Text>
            <Text style={styles.statLabel}>Win 🏆</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.primary }]}>5</Text>
            <Text style={styles.statLabel}>Credits ⚡</Text>
          </View>
        </View>

        {/* How It Works */}
        <View style={styles.howCard}>
          <Text style={styles.howTitle}>How Tick Pick Works</Text>
          {[
            { n: '1', t: 'Browse competitions', d: 'Find a prize pool you like.' },
            { n: '2', t: 'Answer a skill question', d: 'Prove you\'re human — no bots!' },
            { n: '3', t: 'Pay $2 entry fee', d: 'Secure payment via Stripe.' },
            { n: '4', t: 'Wait for the draw', d: 'RANDOM.ORG picks the winner.' },
          ].map(s => (
            <View key={s.n} style={styles.howStep}>
              <View style={styles.howNum}><Text style={{ fontSize: 12, fontWeight: '800', color: Colors.primary }}>{s.n}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.howStepTitle}>{s.t}</Text>
                <Text style={styles.howStepDesc}>{s.d}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Settings */}
        <View style={styles.settingsCard}>
          <SettingsRow icon="🔔" label="Notifications" />
          <View style={styles.settingsDivider} />
          <SettingsRow icon="✉️" label="Free Entry by Post" />
          <View style={styles.settingsDivider} />
          <SettingsRow icon="📄" label="Terms & Conditions" />
          <View style={styles.settingsDivider} />
          <SettingsRow icon="🔒" label="Privacy Policy" />
          <View style={styles.settingsDivider} />
          <SettingsRow icon="🚪" label="Sign Out" danger />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingTop: 56, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '800', color: Colors.text },
  profileCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 20, alignItems: 'center', marginBottom: 14 },
  profileAvatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  profileName: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  profileEmail: { fontSize: 13, color: Colors.textSec, marginBottom: 4 },
  profileMember: { fontSize: 12, color: Colors.muted },
  statsGrid: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, flexDirection: 'row', marginBottom: 14 },
  statItem: { flex: 1, padding: 16, alignItems: 'center' },
  statDivider: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: Colors.border },
  statValue: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 2 },
  statLabel: { fontSize: 11, color: Colors.textSec, fontWeight: '600' },
  howCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 16, marginBottom: 14 },
  howTitle: { fontSize: 15, fontWeight: '800', color: Colors.text, marginBottom: 12 },
  howStep: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  howNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  howStepTitle: { fontSize: 13, fontWeight: '700', color: Colors.text },
  howStepDesc: { fontSize: 12, color: Colors.textSec, marginTop: 1 },
  settingsCard: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, overflow: 'hidden' },
  settingsRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  settingsLabel: { fontSize: 14, fontWeight: '600', color: Colors.text },
  settingsDivider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 16 },
})
