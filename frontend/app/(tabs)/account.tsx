import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/auth";
import { API } from "@/src/api";
import { COLORS, SPACING, RADIUS, FONT } from "@/src/theme";

export default function Account() {
  const router = useRouter();
  const { user, signout, loading } = useAuth();
  const [entries, setEntries] = useState<any[] | null>(null);

  useEffect(() => {
    if (user) API.myEntries().then(setEntries).catch(() => setEntries([]));
  }, [user]);

  if (loading) return <View style={styles.center}><ActivityIndicator color={COLORS.brand} /></View>;

  if (!user) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.surface }}>
        <SafeAreaView edges={["top"]} style={styles.guestCenter}>
          <LinearGradient colors={[COLORS.brand, COLORS.brandDark]} style={styles.guestIcon}>
            <Ionicons name="ticket" size={28} color="#fff" />
          </LinearGradient>
          <Text style={styles.guestTitle}>Sign in to Tick-Pick</Text>
          <Text style={styles.guestSub}>See your entries, manage your tickets, and win.</Text>
          <Pressable testID="signin-cta" style={styles.guestBtn} onPress={() => router.push("/auth")}>
            <Text style={styles.guestBtnText}>Sign in or create account</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  const totalSpent = (entries ?? []).reduce((s, e) => s + Number(e.total), 0);
  const totalTickets = (entries ?? []).reduce((s, e) => s + e.qty, 0);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <ScrollView contentContainerStyle={{ paddingBottom: SPACING.xxl }}>
        <SafeAreaView edges={["top"]} style={styles.header}>
          <View style={styles.headerRow}>
            <LinearGradient colors={[COLORS.brand, COLORS.brandDark]} style={styles.avatar}>
              <Text style={styles.avatarText}>{(user.display_name || user.email)[0].toUpperCase()}</Text>
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{user.display_name}</Text>
              <Text style={styles.email}>{user.email}</Text>
            </View>
            <Pressable testID="signout-btn" onPress={async () => { await signout(); router.replace("/(tabs)"); }} style={styles.signOut}>
              <Ionicons name="log-out-outline" size={18} color={COLORS.text} />
            </Pressable>
          </View>
        </SafeAreaView>

        {user.is_admin && (
          <Pressable testID="admin-btn" onPress={() => router.push("/admin")} style={styles.adminCard}>
            <View style={styles.adminIcon}><Ionicons name="shield-checkmark" size={18} color="#fff" /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.adminTitle}>Admin dashboard</Text>
              <Text style={styles.adminSub}>Run draws, view revenue & entries</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </Pressable>
        )}

        <View style={styles.statsRow}>
          <StatCard icon="ticket" value={String(entries?.length ?? 0)} label="ENTRIES" />
          <StatCard icon="layers" value={String(totalTickets)} label="TICKETS" />
          <StatCard icon="cash" value={`$${totalSpent.toFixed(0)}`} label="SPENT" />
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>My entries</Text>
          {entries === null ? (
            <ActivityIndicator color={COLORS.brand} style={{ marginTop: SPACING.lg }} />
          ) : entries.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="ticket-outline" size={24} color={COLORS.brand} />
              <Text style={styles.emptyTitle}>No entries yet</Text>
              <Text style={styles.emptySub}>Pick a draw and your tickets will appear here.</Text>
              <Pressable style={styles.emptyBtn} onPress={() => router.push("/(tabs)/browse")} testID="browse-cta">
                <Text style={styles.emptyBtnText}>Browse live pools</Text>
              </Pressable>
            </View>
          ) : (
            <View style={{ gap: SPACING.sm }}>
              {entries.map((e) => (
                <Pressable key={e.id} style={styles.entryRow} onPress={() => router.push(`/competition/${e.competition_id}`)} testID={`entry-${e.id}`}>
                  <View style={styles.entryBadge}><Text style={styles.entryBadgeText}>{e.brand.slice(0, 2).toUpperCase()}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.entryBrand}>{e.brand.toUpperCase()}</Text>
                    <Text style={styles.entryTitle} numberOfLines={1}>{e.title}</Text>
                    <Text style={styles.entryMeta}>{new Date(e.created_at).toLocaleDateString()}</Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.entryQty}>{e.qty} ticket{e.qty > 1 ? "s" : ""}</Text>
                    <Text style={styles.entryTotal}>${Number(e.total).toFixed(2)}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function StatCard({ icon, value, label }: { icon: any; value: string; label: string }) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={14} color={COLORS.brand} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.surface },
  guestCenter: { flex: 1, alignItems: "center", justifyContent: "center", padding: SPACING.xl, gap: SPACING.md },
  guestIcon: { width: 72, height: 72, borderRadius: RADIUS.lg, alignItems: "center", justifyContent: "center" },
  guestTitle: { fontFamily: FONT.display, fontSize: 22, fontWeight: "500", color: COLORS.text, marginTop: SPACING.md },
  guestSub: { color: COLORS.textMuted, fontSize: 13, textAlign: "center", maxWidth: 280 },
  guestBtn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: COLORS.text, paddingHorizontal: SPACING.lg, paddingVertical: 14, borderRadius: RADIUS.pill, marginTop: SPACING.lg },
  guestBtnText: { color: "#fff", fontWeight: "500", fontSize: 13 },
  header: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg, backgroundColor: COLORS.surface2, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerRow: { flexDirection: "row", alignItems: "center", gap: SPACING.md, paddingTop: SPACING.sm },
  avatar: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#fff", fontFamily: FONT.display, fontWeight: "500", fontSize: 18 },
  name: { fontFamily: FONT.display, fontSize: 18, fontWeight: "500", color: COLORS.text },
  email: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  signOut: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, alignItems: "center", justifyContent: "center" },
  adminCard: { flexDirection: "row", alignItems: "center", gap: SPACING.md, marginHorizontal: SPACING.lg, marginTop: SPACING.lg, padding: SPACING.md, backgroundColor: COLORS.surface2, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  adminIcon: { width: 40, height: 40, borderRadius: RADIUS.sm, backgroundColor: COLORS.brand, alignItems: "center", justifyContent: "center" },
  adminTitle: { fontFamily: FONT.display, fontSize: 14, fontWeight: "500", color: COLORS.text },
  adminSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  statsRow: { flexDirection: "row", gap: SPACING.sm, paddingHorizontal: SPACING.lg, marginTop: SPACING.lg },
  statCard: { flex: 1, backgroundColor: COLORS.surface2, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: "flex-start", gap: 2 },
  statValue: { fontFamily: FONT.display, fontSize: 18, fontWeight: "500", color: COLORS.text, marginTop: 4 },
  statLabel: { fontSize: 9, color: COLORS.textMuted, letterSpacing: 1, fontWeight: "500" },
  section: { paddingHorizontal: SPACING.lg, marginTop: SPACING.xl },
  h2: { fontFamily: FONT.display, fontSize: 20, fontWeight: "500", color: COLORS.text, marginBottom: SPACING.md, letterSpacing: -0.3 },
  emptyCard: { alignItems: "center", padding: SPACING.xl, backgroundColor: COLORS.surface2, borderRadius: RADIUS.lg, borderStyle: "dashed", borderWidth: 1, borderColor: COLORS.border, gap: SPACING.sm },
  emptyTitle: { fontFamily: FONT.display, fontSize: 16, fontWeight: "500", color: COLORS.text },
  emptySub: { color: COLORS.textMuted, fontSize: 12, textAlign: "center" },
  emptyBtn: { backgroundColor: COLORS.text, paddingHorizontal: SPACING.lg, paddingVertical: 10, borderRadius: RADIUS.pill, marginTop: SPACING.sm },
  emptyBtnText: { color: "#fff", fontWeight: "500", fontSize: 12 },
  entryRow: { flexDirection: "row", alignItems: "center", gap: SPACING.md, padding: SPACING.md, backgroundColor: COLORS.surface2, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  entryBadge: { width: 44, height: 44, borderRadius: RADIUS.sm, backgroundColor: COLORS.surface3, alignItems: "center", justifyContent: "center" },
  entryBadgeText: { color: COLORS.brand, fontFamily: FONT.display, fontWeight: "500", fontSize: 13 },
  entryBrand: { fontSize: 9, color: COLORS.brand, letterSpacing: 1, fontWeight: "500" },
  entryTitle: { fontFamily: FONT.display, fontSize: 13, fontWeight: "500", color: COLORS.text, marginTop: 2 },
  entryMeta: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  entryQty: { fontFamily: FONT.display, fontSize: 14, fontWeight: "500", color: COLORS.text },
  entryTotal: { fontSize: 11, color: COLORS.textMuted, fontWeight: "500", marginTop: 2 },
});
