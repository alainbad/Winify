import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { COLORS, RADIUS, SPACING, FONT, BRAND_IMAGES } from "./theme";

export function TierBadge({ tier }: { tier: string }) {
  const map: Record<string, { bg: string; fg: string }> = {
    MICRO: { bg: COLORS.tier_micro_bg, fg: COLORS.tier_micro },
    VOLUME: { bg: COLORS.tier_volume_bg, fg: COLORS.tier_volume },
    MEGA: { bg: COLORS.tier_mega_bg, fg: COLORS.tier_mega },
  };
  const s = map[tier] ?? map.VOLUME;
  return (
    <View style={[styles.tier, { backgroundColor: s.bg }]} testID={`tier-${tier}`}>
      <Text style={[styles.tierText, { color: s.fg }]}>{tier}</Text>
    </View>
  );
}

export function ProgressBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <View style={styles.bar}>
      <View style={[styles.barFill, { width: `${pct}%` }]} />
    </View>
  );
}

export function CompetitionCard({ pool }: { pool: any }) {
  const router = useRouter();
  const pct = (pool.tickets_sold / pool.tickets_total) * 100;
  const left = pool.tickets_total - pool.tickets_sold;
  const img = BRAND_IMAGES[pool.image_key] ?? BRAND_IMAGES.amazon;
  const ending = pct >= 80;
  return (
    <Pressable
      testID={`pool-card-${pool.id}`}
      onPress={() => router.push(`/competition/${pool.id}`)}
      style={styles.card}
    >
      <LinearGradient colors={[`${pool.accent}55`, `${pool.accent}1A`, COLORS.surface3]} style={styles.cardImg}>
        <Image source={img} style={styles.cardImgInner} contentFit="contain" />
        <View style={styles.cardBadgesLeft}>
          <TierBadge tier={pool.tier} />
        </View>
        <View style={styles.cardBadgesRight}>
          {pool.hot ? (
            <View style={styles.hotPill}><Ionicons name="flame" size={10} color="#FFB454" /><Text style={styles.hotText}>HOT</Text></View>
          ) : null}
          {ending ? (
            <View style={styles.endingPill}><Text style={styles.endingText}>ENDING</Text></View>
          ) : null}
        </View>
        <View style={styles.prizeChip}>
          <Text style={styles.prizeLabel}>WIN</Text>
          <Text style={styles.prizeAmt}>${pool.prize.toLocaleString()}</Text>
        </View>
      </LinearGradient>
      <View style={styles.cardBody}>
        <Text style={styles.cardBrand}>{pool.brand.toUpperCase()}</Text>
        <Text style={styles.cardTitle} numberOfLines={1}>{pool.title}</Text>
        <ProgressBar value={pct} />
        <View style={styles.cardFoot}>
          <Text style={styles.cardLeft}>{left} of {pool.tickets_total} left</Text>
          <View style={styles.priceChip}>
            <Ionicons name="ticket-outline" size={10} color={COLORS.brand} />
            <Text style={styles.priceText}>${pool.ticket_price}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tier: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.pill, alignSelf: "flex-start" },
  tierText: { fontSize: 9, fontWeight: "500", letterSpacing: 1.2, fontFamily: FONT.display },
  bar: { height: 6, backgroundColor: COLORS.surface3, borderRadius: RADIUS.pill, overflow: "hidden" },
  barFill: { height: "100%", backgroundColor: COLORS.brand, borderRadius: RADIUS.pill },
  card: { backgroundColor: COLORS.surface2, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, overflow: "hidden", shadowColor: "#1A0A2E", shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  cardImg: { aspectRatio: 4 / 3, position: "relative", overflow: "hidden", alignItems: "center", justifyContent: "center" },
  cardImgInner: { width: "78%", height: "78%", transform: [{ rotate: "-6deg" }] },
  cardBadgesLeft: { position: "absolute", top: 10, left: 10, flexDirection: "row", gap: 4 },
  cardBadgesRight: { position: "absolute", top: 10, right: 10, flexDirection: "row", gap: 4 },
  hotPill: { flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "rgba(0,0,0,0.55)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.pill },
  hotText: { color: "#FFB454", fontSize: 9, fontWeight: "500", letterSpacing: 1 },
  endingPill: { backgroundColor: COLORS.error, paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.pill },
  endingText: { color: "#fff", fontSize: 9, fontWeight: "500", letterSpacing: 1 },
  prizeChip: { position: "absolute", bottom: 10, left: 10, backgroundColor: "rgba(255,255,255,0.95)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: RADIUS.md },
  prizeLabel: { fontSize: 8, color: COLORS.textMuted, fontWeight: "500", letterSpacing: 1 },
  prizeAmt: { fontSize: 16, color: COLORS.text, fontFamily: FONT.display, fontWeight: "500" },
  cardBody: { padding: SPACING.md, gap: SPACING.sm },
  cardBrand: { fontSize: 9, color: COLORS.textMuted, letterSpacing: 1, fontWeight: "500" },
  cardTitle: { fontSize: 14, color: COLORS.text, fontFamily: FONT.display, fontWeight: "500" },
  cardFoot: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardLeft: { fontSize: 11, color: COLORS.textMuted, fontWeight: "500" },
  priceChip: { flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: COLORS.surface3, paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.pill },
  priceText: { fontSize: 11, color: COLORS.brand, fontWeight: "500" },
});
