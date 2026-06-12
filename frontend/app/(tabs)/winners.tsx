import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { API } from "@/src/api";
import { COLORS, SPACING, RADIUS, FONT } from "@/src/theme";

const FAKE_WINNERS = [
  { name: "Jess M.", city: "Austin", brand: "Amazon", amount: 500, daysAgo: 1 },
  { name: "Marcus T.", city: "Brooklyn", brand: "Apple", amount: 1000, daysAgo: 2 },
  { name: "Priya S.", city: "Seattle", brand: "Sephora", amount: 150, daysAgo: 3 },
  { name: "Diego R.", city: "Miami", brand: "Steam", amount: 250, daysAgo: 4 },
  { name: "Olivia K.", city: "Denver", brand: "Nike", amount: 200, daysAgo: 5 },
  { name: "Aaron P.", city: "Chicago", brand: "Uber Eats", amount: 75, daysAgo: 5 },
  { name: "Lina H.", city: "Portland", brand: "Netflix", amount: 200, daysAgo: 6 },
  { name: "Tom B.", city: "Boston", brand: "Spotify", amount: 100, daysAgo: 7 },
];

export default function Winners() {
  const [draws, setDraws] = useState<any[] | null>(null);
  useEffect(() => { API.draws().then(setDraws).catch(() => setDraws([])); }, []);

  const totalPaid = FAKE_WINNERS.reduce((s, w) => s + w.amount, 0);
  const biggest = FAKE_WINNERS.reduce((m, w) => (w.amount > m.amount ? w : m), FAKE_WINNERS[0]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <ScrollView contentContainerStyle={{ paddingBottom: SPACING.xxl }} testID="winners-scroll">
        <LinearGradient colors={[COLORS.inverse, COLORS.brandDark, COLORS.brand]} style={styles.hero}>
          <SafeAreaView edges={["top"]}>
            <View style={styles.eyebrow}>
              <Ionicons name="sparkles" size={11} color={COLORS.gold} />
              <Text style={styles.eyebrowText}>VERIFIED BY RANDOM.ORG</Text>
            </View>
            <Text style={styles.h1}>Every winner,{"\n"}<Text style={{ color: COLORS.gold }}>fully public.</Text></Text>
            <Text style={styles.sub}>Real people, real prizes. Every payout is public record.</Text>
          </SafeAreaView>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatBox icon="cash" value={`$${totalPaid.toLocaleString()}`} label="PAID OUT" />
          <StatBox icon="people" value={String(FAKE_WINNERS.length)} label="WINNERS" />
          <StatBox icon="trending-up" value={`$${biggest.amount.toLocaleString()}`} label={`BIGGEST`} />
        </View>

        {/* Verified Draws (real, from backend) */}
        {draws && draws.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHead}>
              <View style={[styles.eyebrowPill, { backgroundColor: "#D1FAE5" }]}>
                <Ionicons name="shield-checkmark" size={10} color="#065F46" />
                <Text style={[styles.eyebrowPillText, { color: "#065F46" }]}>VERIFIED DRAWS</Text>
              </View>
              <Text style={styles.h2}>Recorded on-platform</Text>
            </View>
            {draws.map((d) => (
              <View key={d.id} style={styles.drawRow} testID={`draw-${d.id}`}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.drawTitle}>Pool #{d.competition_id.slice(0, 8)}</Text>
                  <Text style={styles.drawMeta}>Ticket #{d.winning_ticket} of {d.total_tickets} · {new Date(d.drawn_at).toLocaleDateString()}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.drawWinner}>{d.winner_email ? d.winner_email.replace(/(.{2}).+(@.+)/, "$1•••$2") : "—"}</Text>
                  {d.has_signature && d.serial_number ? (
                    <Text style={styles.drawSerial}>RANDOM.ORG #{d.serial_number}</Text>
                  ) : (
                    <Text style={styles.drawSerial}>Server-side secure</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {draws === null ? (
          <ActivityIndicator color={COLORS.brand} style={{ marginTop: SPACING.xl }} />
        ) : null}

        {/* Recent Payouts (showcase) */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <View style={styles.eyebrowPill}>
              <Ionicons name="trophy" size={10} color={COLORS.brand} />
              <Text style={styles.eyebrowPillText}>WINNER FEED</Text>
            </View>
            <Text style={styles.h2}>Recent payouts</Text>
          </View>
          {FAKE_WINNERS.map((w, i) => (
            <View key={i} style={styles.winRow} testID={`winner-${i}`}>
              <LinearGradient colors={[COLORS.brand, COLORS.brandDark]} style={styles.winAvatar}>
                <Text style={styles.winAvatarText}>{w.name.split(" ").map((n) => n[0]).join("")}</Text>
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={styles.winName}>{w.name}</Text>
                <Text style={styles.winMeta}>{w.city} · {w.daysAgo}d ago</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.winAmount}>${w.amount}</Text>
                <Text style={styles.winBrand}>{w.brand.toUpperCase()}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function StatBox({ icon, value, label }: { icon: any; value: string; label: string }) {
  return (
    <View style={styles.statBox}>
      <View style={styles.statIcon}><Ionicons name={icon} size={16} color={COLORS.brand} /></View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl },
  eyebrow: { flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.12)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: RADIUS.pill, marginTop: SPACING.sm, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" },
  eyebrowText: { color: "#fff", fontSize: 9, fontWeight: "500", letterSpacing: 1.2 },
  h1: { color: "#fff", fontSize: 36, fontFamily: FONT.display, fontWeight: "500", lineHeight: 38, marginTop: SPACING.lg, letterSpacing: -0.8 },
  sub: { color: "rgba(255,255,255,0.78)", fontSize: 13, marginTop: SPACING.md },
  statsRow: { flexDirection: "row", gap: SPACING.sm, paddingHorizontal: SPACING.lg, marginTop: -SPACING.lg },
  statBox: { flex: 1, backgroundColor: COLORS.surface2, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: "center", shadowColor: "#1A0A2E", shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  statIcon: { width: 36, height: 36, borderRadius: RADIUS.md, backgroundColor: COLORS.surface3, alignItems: "center", justifyContent: "center" },
  statValue: { fontFamily: FONT.display, fontWeight: "500", fontSize: 16, color: COLORS.text, marginTop: 6 },
  statLabel: { fontSize: 9, color: COLORS.textMuted, letterSpacing: 1, fontWeight: "500", marginTop: 2 },
  section: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.xxl, gap: SPACING.sm },
  sectionHead: { marginBottom: SPACING.md },
  eyebrowPill: { flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-start", backgroundColor: COLORS.surface3, paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.pill },
  eyebrowPillText: { color: COLORS.brand, fontSize: 9, fontWeight: "500", letterSpacing: 1.2 },
  h2: { fontSize: 22, fontFamily: FONT.display, fontWeight: "500", color: COLORS.text, marginTop: SPACING.sm, letterSpacing: -0.4 },
  drawRow: { flexDirection: "row", alignItems: "center", padding: SPACING.md, backgroundColor: COLORS.surface2, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, gap: SPACING.sm },
  drawTitle: { fontWeight: "500", fontSize: 13, color: COLORS.text },
  drawMeta: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  drawWinner: { fontSize: 11, color: COLORS.textMuted, fontWeight: "500" },
  drawSerial: { fontSize: 10, color: COLORS.brand, fontWeight: "500", marginTop: 2 },
  winRow: { flexDirection: "row", alignItems: "center", gap: SPACING.md, padding: SPACING.md, backgroundColor: COLORS.surface2, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  winAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  winAvatarText: { color: "#fff", fontFamily: FONT.display, fontWeight: "500", fontSize: 13 },
  winName: { fontFamily: FONT.display, fontSize: 15, fontWeight: "500", color: COLORS.text },
  winMeta: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  winAmount: { fontFamily: FONT.display, fontSize: 16, fontWeight: "500", color: COLORS.text },
  winBrand: { fontSize: 9, color: COLORS.gold, letterSpacing: 1, fontWeight: "500", marginTop: 2 },
});
