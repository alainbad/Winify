import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { API } from "@/src/api";
import { COLORS, SPACING, RADIUS, FONT, BRAND_IMAGES } from "@/src/theme";
import { TierBadge, ProgressBar } from "@/src/components";

function useCountdown(endsAt: number) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return useMemo(() => {
    const diff = Math.max(0, endsAt - now);
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff / 3600000) % 24);
    const m = Math.floor((diff / 60000) % 60);
    const s = Math.floor((diff / 1000) % 60);
    return { d, h, m, s };
  }, [now, endsAt]);
}

export default function Detail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [pool, setPool] = useState<any | null>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => { if (id) API.pool(id).then(setPool).catch(() => setPool(null)); }, [id]);

  const cd = useCountdown(pool?.ends_at ?? Date.now());

  if (!pool) return <View style={styles.center}><ActivityIndicator color={COLORS.brand} /></View>;

  const pct = (pool.tickets_sold / pool.tickets_total) * 100;
  const left = pool.tickets_total - pool.tickets_sold;
  const maxBuy = Math.min(10, Math.max(1, left));
  const safeQty = Math.min(qty, maxBuy);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 160 }} testID="detail-scroll">
        <SafeAreaView edges={["top"]} style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn} testID="back-btn">
            <Ionicons name="arrow-back" size={18} color={COLORS.text} />
          </Pressable>
          <View style={{ flex: 1 }} />
        </SafeAreaView>

        {/* Hero card image */}
        <LinearGradient
          colors={[`${pool.accent}55`, `${pool.accent}15`, COLORS.surface3]}
          style={styles.heroImg}
        >
          <Image source={BRAND_IMAGES[pool.image_key] ?? BRAND_IMAGES.amazon} style={styles.heroImgInner} contentFit="contain" />
          <View style={styles.heroBadges}>
            <TierBadge tier={pool.tier} />
            <View style={styles.verifiedBadge}>
              <Ionicons name="shield-checkmark" size={10} color={COLORS.success} />
              <Text style={styles.verifiedText}>RANDOM.ORG</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          <Text style={styles.brandLine}>{pool.brand.toUpperCase()} · {pool.category.toUpperCase()}</Text>
          <Text style={styles.title}>{pool.title}</Text>
          <Text style={styles.prizeLine}>Win <Text style={styles.prizeStrong}>${pool.prize.toLocaleString()}</Text> redeemable instantly with {pool.brand}</Text>

          {/* Countdown */}
          <View style={styles.cdCard}>
            <Text style={styles.eyebrow}>DRAW ENDS IN</Text>
            <View style={styles.cdRow}>
              <CdBox v={cd.d} label="DAYS" />
              <CdBox v={cd.h} label="HRS" />
              <CdBox v={cd.m} label="MIN" />
              <CdBox v={cd.s} label="SEC" />
            </View>
          </View>

          {/* Progress */}
          <View style={styles.progressCard}>
            <View style={styles.progressTop}>
              <Text style={styles.progressLabel}>{pool.tickets_sold} / {pool.tickets_total} sold</Text>
              <Text style={styles.progressPct}>{Math.round(pct)}%</Text>
            </View>
            <ProgressBar value={pct} />
            <Text style={styles.progressFoot}>{left} tickets left — draw runs the moment it fills.</Text>
          </View>

          {/* Quantity */}
          <View style={styles.qtyCard}>
            <Text style={styles.eyebrow}>TICKETS</Text>
            <View style={styles.qtyRow}>
              <Pressable testID="qty-minus" onPress={() => setQty((q) => Math.max(1, q - 1))} disabled={safeQty <= 1} style={[styles.qtyBtn, safeQty <= 1 && { opacity: 0.4 }]}>
                <Ionicons name="remove" size={18} color={COLORS.text} />
              </Pressable>
              <Text style={styles.qtyValue} testID="qty-value">{safeQty}</Text>
              <Pressable testID="qty-plus" onPress={() => setQty((q) => Math.min(maxBuy, q + 1))} disabled={safeQty >= maxBuy} style={[styles.qtyBtn, safeQty >= maxBuy && { opacity: 0.4 }]}>
                <Ionicons name="add" size={18} color={COLORS.text} />
              </Pressable>
            </View>
            <View style={styles.presetRow}>
              {[1, 3, 5].filter((n) => n <= maxBuy).map((n) => (
                <Pressable key={n} testID={`preset-${n}`} onPress={() => setQty(n)} style={[styles.preset, safeQty === n && styles.presetActive]}>
                  <Text style={[styles.presetText, safeQty === n && styles.presetTextActive]}>{n} ticket{n > 1 ? "s" : ""}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Fallback notice */}
          <View style={styles.notice}>
            <Ionicons name="information-circle" size={16} color={COLORS.brand} />
            <Text style={styles.noticeText}>
              If the pool doesn't fill before time runs out, 80% of the cash pool goes into a lucky draw and one ticket holder wins the entire prize.
            </Text>
          </View>

          {/* Trust strip */}
          <View style={styles.trustRow}>
            {["RANDOM.ORG", "Paid <60s", "Hard cap"].map((t) => (
              <View key={t} style={styles.trustPill}>
                <Ionicons name="checkmark-circle" size={12} color={COLORS.success} />
                <Text style={styles.trustText}>{t}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky bottom CTA */}
      <View style={[styles.cta, { paddingBottom: insets.bottom + SPACING.sm }]}>
        <View>
          <Text style={styles.ctaLabel}>{safeQty} ticket{safeQty > 1 ? "s" : ""}</Text>
          <Text style={styles.ctaPrice}>${safeQty * pool.ticket_price}</Text>
        </View>
        <Pressable
          testID="enter-btn"
          onPress={() => router.push({ pathname: "/checkout/[id]", params: { id: pool.id, qty: String(safeQty) } })}
          style={styles.ctaBtn}
        >
          <Ionicons name="ticket" size={16} color="#fff" />
          <Text style={styles.ctaBtnText}>Enter draw</Text>
        </Pressable>
      </View>
    </View>
  );
}

function CdBox({ v, label }: { v: number; label: string }) {
  return (
    <View style={styles.cdBox}>
      <Text style={styles.cdValue}>{String(v).padStart(2, "0")}</Text>
      <Text style={styles.cdLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  topBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm, paddingBottom: SPACING.sm },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface2, borderWidth: 1, borderColor: COLORS.border, alignItems: "center", justifyContent: "center" },
  heroImg: { marginHorizontal: SPACING.lg, marginTop: SPACING.sm, aspectRatio: 1, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, overflow: "hidden", position: "relative", alignItems: "center", justifyContent: "center" },
  heroImgInner: { width: "78%", height: "78%", transform: [{ rotate: "-6deg" }] },
  heroBadges: { position: "absolute", top: SPACING.md, left: SPACING.md, flexDirection: "row", gap: 6 },
  verifiedBadge: { flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "rgba(16,185,129,0.12)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.pill },
  verifiedText: { color: COLORS.success, fontSize: 9, letterSpacing: 1, fontWeight: "500" },
  body: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg, gap: SPACING.lg },
  brandLine: { fontSize: 10, color: COLORS.brand, letterSpacing: 1.4, fontWeight: "500" },
  title: { fontFamily: FONT.display, fontSize: 28, fontWeight: "500", color: COLORS.text, letterSpacing: -0.5, lineHeight: 32 },
  prizeLine: { color: COLORS.textMuted, fontSize: 14 },
  prizeStrong: { color: COLORS.text, fontFamily: FONT.display, fontWeight: "500", fontSize: 18 },
  eyebrow: { fontSize: 9, color: COLORS.textMuted, letterSpacing: 1.4, fontWeight: "500" },
  cdCard: { backgroundColor: COLORS.surface2, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, gap: SPACING.sm },
  cdRow: { flexDirection: "row", gap: SPACING.sm },
  cdBox: { flex: 1, backgroundColor: COLORS.inverse, borderRadius: RADIUS.md, paddingVertical: SPACING.md, alignItems: "center" },
  cdValue: { color: "#fff", fontFamily: FONT.display, fontSize: 24, fontWeight: "500" },
  cdLabel: { color: COLORS.gold, fontSize: 9, letterSpacing: 1.2, fontWeight: "500", marginTop: 2 },
  progressCard: { backgroundColor: COLORS.surface2, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, gap: 8 },
  progressTop: { flexDirection: "row", justifyContent: "space-between" },
  progressLabel: { fontSize: 13, color: COLORS.text, fontWeight: "500" },
  progressPct: { fontSize: 13, color: COLORS.brand, fontWeight: "500" },
  progressFoot: { fontSize: 11, color: COLORS.textMuted, fontWeight: "500", marginTop: 2 },
  qtyCard: { backgroundColor: COLORS.surface2, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, gap: SPACING.md },
  qtyRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: SPACING.lg, marginTop: 4 },
  qtyBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, alignItems: "center", justifyContent: "center" },
  qtyValue: { fontFamily: FONT.display, fontSize: 32, fontWeight: "500", color: COLORS.text, minWidth: 50, textAlign: "center" },
  presetRow: { flexDirection: "row", gap: SPACING.sm },
  preset: { flex: 1, borderWidth: 1, borderColor: COLORS.border, paddingVertical: 10, borderRadius: RADIUS.sm, alignItems: "center", backgroundColor: COLORS.surface },
  presetActive: { backgroundColor: COLORS.brand, borderColor: COLORS.brand },
  presetText: { fontSize: 12, color: COLORS.text, fontWeight: "500" },
  presetTextActive: { color: "#fff" },
  notice: { flexDirection: "row", gap: 8, padding: SPACING.md, backgroundColor: COLORS.surface2, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, alignItems: "flex-start" },
  noticeText: { flex: 1, fontSize: 11, color: COLORS.text, lineHeight: 16, fontWeight: "500" },
  trustRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  trustPill: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: COLORS.surface2, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: COLORS.border },
  trustText: { fontSize: 11, color: COLORS.text, fontWeight: "500" },
  cta: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#FFFFFFF5", borderTopWidth: 1, borderTopColor: COLORS.border, paddingHorizontal: SPACING.lg, paddingTop: SPACING.md, flexDirection: "row", alignItems: "center", gap: SPACING.md },
  ctaLabel: { fontSize: 9, color: COLORS.textMuted, letterSpacing: 1, fontWeight: "500" },
  ctaPrice: { fontFamily: FONT.display, fontSize: 22, fontWeight: "500", color: COLORS.text },
  ctaBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: COLORS.text, paddingVertical: 14, borderRadius: RADIUS.pill },
  ctaBtnText: { color: "#fff", fontWeight: "500", fontSize: 14 },
});
