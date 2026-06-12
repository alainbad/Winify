import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { API } from "@/src/api";
import { useAuth } from "@/src/auth";
import { COLORS, SPACING, RADIUS, FONT } from "@/src/theme";

export default function Admin() {
  const router = useRouter();
  const { user } = useAuth();
  const [data, setData] = useState<any | null>(null);
  const [pools, setPools] = useState<any[]>([]);
  const [draws, setDraws] = useState<any[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [o, p, d] = await Promise.all([API.adminOverview(), API.pools(), API.draws()]);
      setData(o); setPools(p); setDraws(d);
    } catch (e: any) {
      setMsg(e.message);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (!user) return <View style={styles.center}><Text style={styles.muted}>Please sign in.</Text></View>;
  if (!user.is_admin) return (
    <View style={styles.center}>
      <Ionicons name="lock-closed" size={28} color={COLORS.textMuted} />
      <Text style={styles.muted}>Admin access required.</Text>
    </View>
  );
  if (!data) return <View style={styles.center}><ActivityIndicator color={COLORS.brand} /></View>;

  const drawByPool = new Map(draws.map((d) => [d.competition_id, d]));

  const runDraw = async (pid: string) => {
    setBusy(pid); setMsg(null);
    try {
      const r = await API.runDraw(pid);
      setMsg(`Winner picked: ticket #${r.winning_ticket} — ${r.winner_email || "no email"}`);
      await load();
    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} tintColor={COLORS.brand} />}
        contentContainerStyle={{ paddingBottom: SPACING.xxl }}
      >
        <SafeAreaView edges={["top"]} style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn}><Ionicons name="arrow-back" size={18} color={COLORS.text} /></Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.eyebrow}>ADMIN</Text>
            <Text style={styles.h1}>Dashboard</Text>
          </View>
        </SafeAreaView>

        {msg && <View style={styles.msg}><Text style={styles.msgText}>{msg}</Text></View>}

        <View style={styles.statsRow}>
          <Stat label="POOLS" value={`${data.totals.pools_active}/${data.totals.pools}`} icon="layers" />
          <Stat label="DRAWN" value={String(data.totals.pools_drawn)} icon="checkmark-circle" />
          <Stat label="TICKETS" value={String(data.totals.tickets)} icon="ticket" />
          <Stat label="REVENUE" value={`$${data.totals.revenue}`} icon="trending-up" />
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>Draw control</Text>
          <Text style={styles.sub}>Each draw picks one ticket cryptographically and closes the pool.</Text>
          <View style={{ gap: SPACING.sm, marginTop: SPACING.md }}>
            {pools.map((p) => {
              const drawn = drawByPool.get(p.id);
              const noEntries = p.tickets_sold === 0;
              return (
                <View key={p.id} style={styles.poolRow} testID={`admin-pool-${p.id}`}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.poolTitle} numberOfLines={1}>{p.title}</Text>
                    <Text style={styles.poolMeta}>{p.brand} · {p.tickets_sold}/{p.tickets_total}</Text>
                  </View>
                  <Pressable
                    testID={`run-draw-${p.id}`}
                    disabled={!!drawn || noEntries || busy === p.id}
                    onPress={() => runDraw(p.id)}
                    style={[styles.runBtn, (drawn || noEntries) && styles.runBtnDisabled]}
                  >
                    {busy === p.id ? <ActivityIndicator color="#fff" size="small" /> : (
                      <Text style={styles.runText}>{drawn ? "DRAWN" : noEntries ? "—" : "RUN"}</Text>
                    )}
                  </Pressable>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>Recent entries</Text>
          <View style={{ gap: SPACING.sm, marginTop: SPACING.md }}>
            {data.recent_entries.length === 0 ? (
              <Text style={styles.muted}>No entries yet.</Text>
            ) : data.recent_entries.map((e: any) => (
              <View key={e.id} style={styles.entryRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.entryEmail}>{e.email}</Text>
                  <Text style={styles.entryMeta}>{e.brand} · {e.qty} × ticket</Text>
                </View>
                <Text style={styles.entryTotal}>${e.total}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: any }) {
  return (
    <View style={styles.statBox}>
      <Ionicons name={icon} size={14} color={COLORS.brand} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.surface, gap: SPACING.sm },
  muted: { color: COLORS.textMuted, fontSize: 13, fontWeight: "500" },
  header: { flexDirection: "row", alignItems: "center", gap: SPACING.md, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md, backgroundColor: COLORS.surface2, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, alignItems: "center", justifyContent: "center" },
  eyebrow: { color: COLORS.brand, fontSize: 9, letterSpacing: 1.4, fontWeight: "500" },
  h1: { fontFamily: FONT.display, fontSize: 22, fontWeight: "500", color: COLORS.text },
  msg: { padding: SPACING.md, backgroundColor: COLORS.surface3, borderRadius: RADIUS.sm, marginHorizontal: SPACING.lg, marginTop: SPACING.md },
  msgText: { color: COLORS.brand, fontSize: 12, fontWeight: "500" },
  statsRow: { flexDirection: "row", gap: SPACING.sm, paddingHorizontal: SPACING.lg, marginTop: SPACING.lg },
  statBox: { flex: 1, backgroundColor: COLORS.surface2, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.sm, gap: 2 },
  statValue: { fontFamily: FONT.display, fontSize: 16, fontWeight: "500", color: COLORS.text, marginTop: 4 },
  statLabel: { fontSize: 8, color: COLORS.textMuted, letterSpacing: 1, fontWeight: "500" },
  section: { paddingHorizontal: SPACING.lg, marginTop: SPACING.xl },
  h2: { fontFamily: FONT.display, fontSize: 18, fontWeight: "500", color: COLORS.text },
  sub: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  poolRow: { flexDirection: "row", alignItems: "center", gap: SPACING.md, padding: SPACING.md, backgroundColor: COLORS.surface2, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  poolTitle: { fontFamily: FONT.display, fontSize: 13, fontWeight: "500", color: COLORS.text },
  poolMeta: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  runBtn: { backgroundColor: COLORS.brand, paddingHorizontal: SPACING.md, paddingVertical: 8, borderRadius: RADIUS.pill, minWidth: 70, alignItems: "center" },
  runBtnDisabled: { backgroundColor: COLORS.surface3 },
  runText: { color: "#fff", fontSize: 11, letterSpacing: 1, fontWeight: "500" },
  entryRow: { flexDirection: "row", padding: SPACING.md, backgroundColor: COLORS.surface2, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, alignItems: "center" },
  entryEmail: { fontSize: 13, fontWeight: "500", color: COLORS.text },
  entryMeta: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  entryTotal: { fontFamily: FONT.display, fontSize: 14, fontWeight: "500", color: COLORS.text },
});
