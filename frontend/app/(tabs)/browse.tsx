import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { API } from "@/src/api";
import { COLORS, RADIUS, SPACING, FONT } from "@/src/theme";
import { CompetitionCard } from "@/src/components";

const CATS = ["All", "Gift Cards", "Gaming", "Entertainment", "Lifestyle", "Travel"];

export default function Browse() {
  const [pools, setPools] = useState<any[] | null>(null);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  useEffect(() => { API.pools().then(setPools).catch(() => setPools([])); }, []);

  const list = useMemo(() => {
    let r = (pools ?? []).slice();
    if (q.trim()) {
      const s = q.toLowerCase();
      r = r.filter((p) => p.title.toLowerCase().includes(s) || p.brand.toLowerCase().includes(s));
    }
    if (cat !== "All") r = r.filter((p) => p.category === cat);
    r.sort((a, b) => a.ends_at - b.ends_at);
    return r;
  }, [pools, q, cat]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <SafeAreaView edges={["top"]} style={styles.header}>
        <Text style={styles.h1}>Browse</Text>
        <Text style={styles.sub}>{pools?.length ?? 0} live pools · $5 a ticket</Text>
        <View style={styles.search}>
          <Ionicons name="search" size={16} color={COLORS.textMuted} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search brands or prizes…"
            placeholderTextColor={COLORS.textMuted}
            style={styles.searchInput}
            testID="search-input"
          />
        </View>
      </SafeAreaView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRowInner} style={styles.chipRow}>
        {CATS.map((c) => {
          const active = cat === c;
          return (
            <Pressable key={c} onPress={() => setCat(c)} testID={`cat-${c}`} style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{c}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {pools === null ? (
        <View style={{ paddingTop: 60, alignItems: "center" }}><ActivityIndicator color={COLORS.brand} /></View>
      ) : list.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="flash-outline" size={28} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>No draws match that</Text>
          <Text style={styles.emptySub}>Try clearing your search or category.</Text>
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: SPACING.md, paddingHorizontal: SPACING.lg }}
          contentContainerStyle={{ gap: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.xxl }}
          renderItem={({ item }) => <View style={{ flex: 1 }}><CompetitionCard pool={item} /></View>}
          testID="browse-list"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md, backgroundColor: COLORS.surface2, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  h1: { fontFamily: FONT.display, fontSize: 28, color: COLORS.text, fontWeight: "500", letterSpacing: -0.5 },
  sub: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  search: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.pill, paddingHorizontal: SPACING.md, height: 42, marginTop: SPACING.md },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.text, paddingVertical: 0 },
  chipRow: { backgroundColor: COLORS.surface2, borderBottomWidth: 1, borderBottomColor: COLORS.border, height: 56, flexGrow: 0 },
  chipRowInner: { paddingHorizontal: SPACING.lg, gap: SPACING.sm, alignItems: "center" },
  chip: { paddingHorizontal: 14, height: 36, borderRadius: RADIUS.pill, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  chipActive: { backgroundColor: COLORS.text, borderColor: COLORS.text },
  chipText: { color: COLORS.text, fontSize: 12, fontWeight: "500" },
  chipTextActive: { color: "#fff" },
  empty: { alignItems: "center", padding: SPACING.xxl, marginTop: SPACING.xxl },
  emptyTitle: { fontFamily: FONT.display, fontSize: 16, fontWeight: "500", color: COLORS.text, marginTop: SPACING.sm },
  emptySub: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
});
