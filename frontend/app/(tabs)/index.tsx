import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { API } from "@/src/api";
import { COLORS, SPACING, RADIUS, FONT, BRAND_IMAGES } from "@/src/theme";
import { CompetitionCard } from "@/src/components";
import { useAuth } from "@/src/auth";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [pools, setPools] = useState<any[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try { const p = await API.pools(); setPools(p); } catch {}
  };
  useEffect(() => { load(); }, []);

  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const featured = (pools ?? []).slice(0, 4);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.brand} />}
        contentContainerStyle={{ paddingBottom: SPACING.xxl }}
        testID="home-scroll"
      >
        {/* HERO */}
        <LinearGradient colors={[COLORS.inverse, COLORS.brandDark, COLORS.brand]} style={styles.hero}>
          <SafeAreaView edges={["top"]}>
            <View style={styles.heroHeader}>
              <Text style={styles.logo}>Tick<Text style={{ color: COLORS.gold }}>-Pick</Text></Text>
              <Pressable
                testID="header-avatar"
                onPress={() => router.push(user ? "/(tabs)/account" : "/auth")}
                style={styles.avatarBtn}
              >
                {user ? (
                  <Text style={styles.avatarLetter}>{(user.display_name || user.email)[0].toUpperCase()}</Text>
                ) : (
                  <Ionicons name="person-outline" size={18} color={COLORS.onInverse} />
                )}
              </Pressable>
            </View>

            <View style={styles.livePill}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>{pools?.length ?? 0} LIVE DRAWS</Text>
            </View>

            <Text style={styles.heroTitle}>Five bucks.{"\n"}<Text style={{ color: COLORS.gold }}>Real prizes.</Text></Text>
            <Text style={styles.heroSub}>Pick a pool. Grab a $5 ticket. Win premium gift cards — verified by RANDOM.ORG.</Text>

            <View style={styles.heroCTAs}>
              <Pressable testID="hero-cta-browse" style={styles.ctaPrimary} onPress={() => router.push("/(tabs)/browse")}>
                <Ionicons name="ticket" size={16} color={COLORS.inverse} />
                <Text style={styles.ctaPrimaryText}>Pick a draw</Text>
              </Pressable>
              <Pressable testID="hero-cta-how" style={styles.ctaGhost} onPress={() => router.push("/(tabs)/winners")}>
                <Text style={styles.ctaGhostText}>See winners</Text>
              </Pressable>
            </View>

            <View style={styles.stats}>
              <Stat value="3,418" label="Draws run" />
              <Stat value="$612k" label="Paid out" />
              <Stat value="<60s" label="Payout" />
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* FEATURED */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <View style={styles.eyebrowPill}><Text style={styles.eyebrowText}>LIVE NOW</Text></View>
            <Text style={styles.h2}>Pools filling fast</Text>
            <Pressable testID="see-all-link" onPress={() => router.push("/(tabs)/browse")}>
              <Text style={styles.linkText}>See all →</Text>
            </Pressable>
          </View>
          {pools === null ? (
            <ActivityIndicator color={COLORS.brand} />
          ) : (
            <View style={styles.grid}>
              {featured.map((p) => (
                <View key={p.id} style={styles.gridItem}><CompetitionCard pool={p} /></View>
              ))}
            </View>
          )}
        </View>

        {/* HOW IT WORKS */}
        <View style={[styles.section, { backgroundColor: COLORS.surface3, paddingVertical: SPACING.xxl }]}>
          <View style={styles.sectionHead}>
            <View style={styles.eyebrowPill}><Text style={styles.eyebrowText}>HOW IT WORKS</Text></View>
            <Text style={styles.h2}>Three steps. No catch.</Text>
          </View>
          <View style={{ gap: SPACING.md }}>
            {[
              { icon: "ticket", title: "Pick a pool", copy: "Browse live draws. Every pool shows the prize and tickets left." },
              { icon: "sparkles", title: "Grab a ticket", copy: "$5 a ticket. Buy as many as you like — locked in instantly." },
              { icon: "trophy", title: "Win in real time", copy: "When the pool fills, RANDOM.ORG picks the winner. Gift card hits your inbox." },
            ].map((s, i) => (
              <View key={s.title} style={styles.step} testID={`step-${i + 1}`}>
                <LinearGradient colors={[COLORS.brand, COLORS.brandDark]} style={styles.stepIcon}>
                  <Ionicons name={s.icon as any} size={18} color="#fff" />
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepTitle}>{s.title}</Text>
                  <Text style={styles.stepCopy}>{s.copy}</Text>
                </View>
                <Text style={styles.stepNum}>0{i + 1}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* TRUST */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <View style={[styles.eyebrowPill, { backgroundColor: COLORS.goldBg }]}><Text style={[styles.eyebrowText, { color: "#92400E" }]}>TRUST</Text></View>
            <Text style={styles.h2}>Boringly transparent.</Text>
          </View>
          <View style={{ gap: SPACING.sm }}>
            {[
              { icon: "shield-checkmark", t: "RANDOM.ORG verified", d: "Every draw uses third-party randomness. Auditable forever." },
              { icon: "flash", t: "Paid in under a minute", d: "Win, and your gift card hits your inbox before the page reloads." },
              { icon: "checkmark-circle", t: "Hard ticket cap", d: "Small pools mean real odds. No infinite tickets." },
            ].map((p) => (
              <View key={p.t} style={styles.pillar} testID={`pillar-${p.t}`}>
                <View style={styles.pillarIcon}><Ionicons name={p.icon as any} size={18} color={COLORS.brand} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.pillarTitle}>{p.t}</Text>
                  <Text style={styles.pillarCopy}>{p.d}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl },
  heroHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: SPACING.sm, marginBottom: SPACING.xl },
  logo: { color: "#fff", fontSize: 22, fontFamily: FONT.display, fontWeight: "500", letterSpacing: -0.5 },
  avatarBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" },
  avatarLetter: { color: COLORS.gold, fontWeight: "500", fontFamily: FONT.display, fontSize: 14 },
  livePill: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "rgba(255,255,255,0.12)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: RADIUS.pill, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.gold },
  liveText: { color: "#fff", fontSize: 10, fontWeight: "500", letterSpacing: 1.2 },
  heroTitle: { color: "#fff", fontSize: 44, fontFamily: FONT.display, fontWeight: "500", lineHeight: 46, marginTop: SPACING.lg, letterSpacing: -1 },
  heroSub: { color: "rgba(255,255,255,0.78)", fontSize: 14, marginTop: SPACING.md, lineHeight: 20 },
  heroCTAs: { flexDirection: "row", gap: SPACING.sm, marginTop: SPACING.xl },
  ctaPrimary: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#fff", paddingHorizontal: SPACING.lg, paddingVertical: 12, borderRadius: RADIUS.pill },
  ctaPrimaryText: { color: COLORS.inverse, fontWeight: "500", fontSize: 13 },
  ctaGhost: { paddingHorizontal: SPACING.lg, paddingVertical: 12, borderRadius: RADIUS.pill, borderWidth: 1, borderColor: "rgba(255,255,255,0.3)", backgroundColor: "rgba(255,255,255,0.05)" },
  ctaGhostText: { color: "#fff", fontWeight: "500", fontSize: 13 },
  stats: { flexDirection: "row", gap: SPACING.sm, marginTop: SPACING.xl },
  stat: { flex: 1, backgroundColor: "rgba(255,255,255,0.08)", padding: SPACING.md, borderRadius: RADIUS.md, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", alignItems: "center" },
  statValue: { color: "#fff", fontFamily: FONT.display, fontSize: 18, fontWeight: "500" },
  statLabel: { color: "rgba(255,255,255,0.6)", fontSize: 9, letterSpacing: 1.2, fontWeight: "500", marginTop: 4 },
  section: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.xxl },
  sectionHead: { marginBottom: SPACING.lg },
  eyebrowPill: { alignSelf: "flex-start", backgroundColor: COLORS.surface3, paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.pill },
  eyebrowText: { color: COLORS.brand, fontSize: 9, fontWeight: "500", letterSpacing: 1.5 },
  h2: { fontSize: 26, fontFamily: FONT.display, fontWeight: "500", color: COLORS.text, marginTop: SPACING.sm, letterSpacing: -0.5 },
  linkText: { color: COLORS.brand, fontWeight: "500", marginTop: SPACING.xs, fontSize: 13 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.md },
  gridItem: { width: "47%", flexGrow: 1 },
  step: { flexDirection: "row", alignItems: "center", gap: SPACING.md, padding: SPACING.lg, backgroundColor: COLORS.surface2, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border },
  stepIcon: { width: 44, height: 44, borderRadius: RADIUS.md, alignItems: "center", justifyContent: "center" },
  stepTitle: { fontFamily: FONT.display, fontSize: 16, fontWeight: "500", color: COLORS.text },
  stepCopy: { color: COLORS.textMuted, fontSize: 12, marginTop: 2, lineHeight: 16 },
  stepNum: { fontFamily: FONT.display, fontSize: 32, color: "rgba(109,40,217,0.12)", fontWeight: "500" },
  pillar: { flexDirection: "row", alignItems: "flex-start", gap: SPACING.md, padding: SPACING.md, backgroundColor: COLORS.surface2, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  pillarIcon: { width: 36, height: 36, borderRadius: RADIUS.sm, backgroundColor: COLORS.surface3, alignItems: "center", justifyContent: "center" },
  pillarTitle: { fontFamily: FONT.display, fontSize: 14, fontWeight: "500", color: COLORS.text },
  pillarCopy: { color: COLORS.textMuted, fontSize: 12, marginTop: 2, lineHeight: 16 },
});
