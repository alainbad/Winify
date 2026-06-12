import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, Linking, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { useLocalSearchParams, useRouter } from "expo-router";
import { API } from "@/src/api";
import { useAuth } from "@/src/auth";
import { COLORS, SPACING, RADIUS, FONT, BRAND_IMAGES } from "@/src/theme";
import { TierBadge } from "@/src/components";

export default function Checkout() {
  const { id, qty: qtyParam } = useLocalSearchParams<{ id: string; qty?: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [pool, setPool] = useState<any | null>(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState<any | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const qty = Math.max(1, Math.min(10, Number(qtyParam ?? "1")));

  useEffect(() => { if (id) API.pool(id).then(setPool).catch(() => setPool(null)); }, [id]);

  if (authLoading || !pool) return <View style={styles.center}><ActivityIndicator color={COLORS.brand} /></View>;

  if (!user) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.surface }}>
        <SafeAreaView style={styles.guestWrap} edges={["top"]}>
          <Pressable onPress={() => router.back()} style={styles.back}><Ionicons name="arrow-back" size={18} color={COLORS.textMuted} /><Text style={styles.backText}>Back</Text></Pressable>
          <View style={styles.guestCard}>
            <LinearGradient colors={[COLORS.brand, COLORS.brandDark]} style={styles.guestIcon}>
              <Ionicons name="lock-closed" size={22} color="#fff" />
            </LinearGradient>
            <Text style={styles.guestTitle}>Sign in to buy tickets</Text>
            <Text style={styles.guestSub}>Your entries are tied to your account so you never lose a ticket.</Text>
            <Pressable testID="guest-signin-btn" style={styles.guestBtn} onPress={() => router.push({ pathname: "/auth", params: { redirect: `/checkout/${id}?qty=${qty}` } })}>
              <Text style={styles.guestBtnText}>Sign in to continue</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const subtotal = qty * pool.ticket_price;
  const fee = +(subtotal * 0.029).toFixed(2);
  const total = +(subtotal + fee).toFixed(2);

  const confirmAndPay = async () => {
    setErr(null); setProcessing(true);
    try {
      const entry = await API.createEntry(pool.id, qty);
      setDone(entry);
    } catch (e: any) {
      setErr(e.message || "Failed to create entry");
    } finally {
      setProcessing(false);
    }
  };

  const openGumroad = async () => {
    const url = pool.gumroad_url || "https://badranalain.gumroad.com/l/spjrva";
    const sep = url.includes("?") ? "&" : "?";
    const final = `${url}${sep}wanted=true&quantity=${qty}`;
    try {
      if (Platform.OS === "web") {
        Linking.openURL(final);
      } else {
        await WebBrowser.openBrowserAsync(final);
      }
    } catch {
      Linking.openURL(final);
    }
  };

  if (done) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.surface }}>
        <SafeAreaView style={styles.successWrap} edges={["top"]}>
          <LinearGradient colors={[COLORS.brand, COLORS.brandDark]} style={styles.successIcon}>
            <Ionicons name="checkmark" size={32} color="#fff" />
          </LinearGradient>
          <Text style={styles.successTitle}>You're in! 🎉</Text>
          <Text style={styles.successSub}>{done.qty} ticket{done.qty > 1 ? "s" : ""} secured for {pool.brand}</Text>
          <View style={styles.ticketCard}>
            <Text style={styles.ticketLabel}>YOUR TICKET NUMBERS</Text>
            <Text style={styles.ticketNums}>{done.ticket_numbers.map((n: number) => `#${n}`).join("  ·  ")}</Text>
          </View>
          <Text style={styles.payNote}>Now complete your $5/ticket payment securely on Gumroad. Your entry stays held in your account.</Text>
          <Pressable testID="open-gumroad" style={styles.payBtn} onPress={openGumroad}>
            <Ionicons name="card" size={16} color="#fff" />
            <Text style={styles.payBtnText}>Pay ${total.toFixed(2)} on Gumroad</Text>
            <Ionicons name="open-outline" size={14} color="#fff" />
          </Pressable>
          <Pressable testID="goto-entries" style={styles.outlineBtn} onPress={() => router.replace("/(tabs)/account")}>
            <Text style={styles.outlineBtnText}>View my entries</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <ScrollView contentContainerStyle={{ paddingBottom: SPACING.xxl }}>
        <SafeAreaView edges={["top"]} style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.back}><Ionicons name="arrow-back" size={18} color={COLORS.textMuted} /><Text style={styles.backText}>Back to draw</Text></Pressable>
        </SafeAreaView>

        <View style={styles.body}>
          <Text style={styles.step}>STEP 2 OF 3 · SECURE CHECKOUT</Text>
          <Text style={styles.h1}>Confirm & pay</Text>

          {/* Pool summary card */}
          <View style={styles.summary}>
            <LinearGradient colors={[`${pool.accent}55`, `${pool.accent}15`, COLORS.surface3]} style={styles.summaryImg}>
              <Image source={BRAND_IMAGES[pool.image_key] ?? BRAND_IMAGES.amazon} style={styles.summaryImgInner} contentFit="contain" />
              <View style={{ position: "absolute", top: SPACING.sm, left: SPACING.sm }}><TierBadge tier={pool.tier} /></View>
            </LinearGradient>
            <View style={{ padding: SPACING.md }}>
              <Text style={styles.summaryBrand}>{pool.brand.toUpperCase()}</Text>
              <Text style={styles.summaryTitle}>{pool.title}</Text>
              <View style={styles.line}>
                <Text style={styles.lineLabel}>{qty} × ${pool.ticket_price} ticket{qty > 1 ? "s" : ""}</Text>
                <Text style={styles.lineValue}>${subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.line}>
                <Text style={styles.lineLabel}>Processing fee</Text>
                <Text style={styles.lineValue}>${fee.toFixed(2)}</Text>
              </View>
              <View style={[styles.line, styles.totalLine]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* Payment block */}
          <View style={styles.payBlock}>
            <View style={styles.payHead}>
              <Text style={styles.payTitle}>Payment</Text>
              <View style={styles.secPill}>
                <Ionicons name="lock-closed" size={10} color={COLORS.success} />
                <Text style={styles.secText}>SECURE · GUMROAD</Text>
              </View>
            </View>
            <Text style={styles.payCopy}>When you confirm, your entry is reserved on your account. You'll then be sent to Gumroad to pay securely with card or PayPal.</Text>
          </View>

          {err && <View style={styles.errorBox}><Text style={styles.errorText}>{err}</Text></View>}

          <Pressable testID="confirm-entry-btn" disabled={processing} onPress={confirmAndPay} style={[styles.cta, processing && { opacity: 0.7 }]}>
            {processing ? <ActivityIndicator color="#fff" /> : (
              <>
                <Ionicons name="ticket" size={16} color="#fff" />
                <Text style={styles.ctaText}>Confirm entry — ${total.toFixed(2)}</Text>
              </>
            )}
          </Pressable>

          <Text style={styles.terms}>By confirming you agree to Tick-Pick's terms & draw rules.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.surface },
  topBar: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm, paddingBottom: SPACING.sm },
  back: { flexDirection: "row", alignItems: "center", gap: 6 },
  backText: { color: COLORS.textMuted, fontSize: 13, fontWeight: "500" },
  body: { padding: SPACING.lg, gap: SPACING.lg },
  step: { fontSize: 10, color: COLORS.brand, letterSpacing: 1.4, fontWeight: "500" },
  h1: { fontFamily: FONT.display, fontSize: 28, fontWeight: "500", color: COLORS.text, letterSpacing: -0.5 },
  summary: { backgroundColor: COLORS.surface2, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, overflow: "hidden" },
  summaryImg: { aspectRatio: 16 / 10, position: "relative", alignItems: "center", justifyContent: "center" },
  summaryImgInner: { width: "60%", height: "76%", transform: [{ rotate: "-3deg" }] },
  summaryBrand: { fontSize: 10, color: COLORS.brand, letterSpacing: 1.2, fontWeight: "500" },
  summaryTitle: { fontFamily: FONT.display, fontSize: 16, fontWeight: "500", color: COLORS.text, marginTop: 4 },
  line: { flexDirection: "row", justifyContent: "space-between", marginTop: SPACING.sm },
  lineLabel: { color: COLORS.textMuted, fontSize: 13 },
  lineValue: { color: COLORS.text, fontWeight: "500", fontSize: 13 },
  totalLine: { marginTop: SPACING.md, paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.border },
  totalLabel: { fontFamily: FONT.display, fontSize: 14, fontWeight: "500", color: COLORS.text },
  totalValue: { fontFamily: FONT.display, fontSize: 22, fontWeight: "500", color: COLORS.text },
  payBlock: { backgroundColor: COLORS.surface2, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.md, gap: SPACING.sm },
  payHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  payTitle: { fontFamily: FONT.display, fontSize: 16, fontWeight: "500", color: COLORS.text },
  secPill: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(16,185,129,0.1)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.pill },
  secText: { color: COLORS.success, fontSize: 9, letterSpacing: 1, fontWeight: "500" },
  payCopy: { color: COLORS.textMuted, fontSize: 13, lineHeight: 18 },
  errorBox: { padding: SPACING.sm, backgroundColor: "rgba(239,68,68,0.1)", borderRadius: RADIUS.sm, borderWidth: 1, borderColor: "rgba(239,68,68,0.25)" },
  errorText: { color: COLORS.error, fontSize: 12, fontWeight: "500" },
  cta: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: COLORS.text, paddingVertical: 16, borderRadius: RADIUS.pill },
  ctaText: { color: "#fff", fontWeight: "500", fontSize: 14 },
  terms: { textAlign: "center", color: COLORS.textMuted, fontSize: 11, fontWeight: "500" },
  guestWrap: { padding: SPACING.lg, gap: SPACING.lg },
  guestCard: { backgroundColor: COLORS.surface2, borderRadius: RADIUS.lg, padding: SPACING.xl, alignItems: "center", borderWidth: 1, borderColor: COLORS.border, gap: SPACING.sm },
  guestIcon: { width: 56, height: 56, borderRadius: RADIUS.md, alignItems: "center", justifyContent: "center" },
  guestTitle: { fontFamily: FONT.display, fontSize: 20, fontWeight: "500", color: COLORS.text, marginTop: SPACING.sm },
  guestSub: { color: COLORS.textMuted, fontSize: 13, textAlign: "center" },
  guestBtn: { backgroundColor: COLORS.text, paddingHorizontal: SPACING.lg, paddingVertical: 12, borderRadius: RADIUS.pill, marginTop: SPACING.sm },
  guestBtnText: { color: "#fff", fontWeight: "500", fontSize: 13 },
  successWrap: { flex: 1, padding: SPACING.lg, alignItems: "center", justifyContent: "center", gap: SPACING.md },
  successIcon: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center" },
  successTitle: { fontFamily: FONT.display, fontSize: 28, fontWeight: "500", color: COLORS.text, marginTop: SPACING.md },
  successSub: { color: COLORS.textMuted, fontSize: 14 },
  ticketCard: { backgroundColor: COLORS.surface2, borderRadius: RADIUS.lg, padding: SPACING.md, borderWidth: 1, borderColor: COLORS.border, width: "100%", alignItems: "center", marginTop: SPACING.md, gap: SPACING.sm },
  ticketLabel: { fontSize: 9, color: COLORS.brand, letterSpacing: 1.4, fontWeight: "500" },
  ticketNums: { fontFamily: FONT.display, fontSize: 18, fontWeight: "500", color: COLORS.text },
  payNote: { color: COLORS.textMuted, fontSize: 12, textAlign: "center", marginTop: SPACING.sm, lineHeight: 18 },
  payBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: COLORS.brand, paddingHorizontal: SPACING.lg, paddingVertical: 14, borderRadius: RADIUS.pill, width: "100%", marginTop: SPACING.sm },
  payBtnText: { color: "#fff", fontWeight: "500", fontSize: 14 },
  outlineBtn: { paddingVertical: 12, paddingHorizontal: SPACING.lg, borderRadius: RADIUS.pill, borderWidth: 1, borderColor: COLORS.border, alignItems: "center", justifyContent: "center", marginTop: 4 },
  outlineBtnText: { color: COLORS.text, fontWeight: "500", fontSize: 13 },
});
