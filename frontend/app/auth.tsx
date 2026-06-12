import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/src/auth";
import { COLORS, SPACING, RADIUS, FONT } from "@/src/theme";

export default function Auth() {
  const router = useRouter();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const { signin, signup } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    setBusy(true);
    try {
      if (mode === "signup") await signup(email.trim().toLowerCase(), password, name || email.split("@")[0]);
      else await signin(email.trim().toLowerCase(), password);
      router.replace((redirect as any) || "/(tabs)");
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.surface3 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <SafeAreaView style={styles.wrap} edges={["top"]}>
          <Pressable onPress={() => router.back()} style={styles.back} testID="auth-back">
            <Ionicons name="arrow-back" size={18} color={COLORS.textMuted} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <Text style={styles.logo}>Tick<Text style={{ color: COLORS.gold }}>-Pick</Text></Text>

          <View style={styles.card}>
            <Text style={styles.title}>{mode === "signin" ? "Welcome back" : "Create your account"}</Text>
            <Text style={styles.sub}>{mode === "signin" ? "Sign in to see your entries." : "Join Tick-Pick — it takes 10 seconds."}</Text>

            {mode === "signup" && (
              <View style={styles.field}>
                <Ionicons name="person-outline" size={16} color={COLORS.textMuted} />
                <TextInput
                  testID="name-input" value={name} onChangeText={setName} placeholder="Display name"
                  placeholderTextColor={COLORS.textMuted} style={styles.input}
                />
              </View>
            )}
            <View style={styles.field}>
              <Ionicons name="mail-outline" size={16} color={COLORS.textMuted} />
              <TextInput
                testID="email-input" value={email} onChangeText={setEmail} placeholder="you@example.com"
                placeholderTextColor={COLORS.textMuted} style={styles.input}
                keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
              />
            </View>
            <View style={styles.field}>
              <Ionicons name="lock-closed-outline" size={16} color={COLORS.textMuted} />
              <TextInput
                testID="password-input" value={password} onChangeText={setPassword} placeholder="Password"
                placeholderTextColor={COLORS.textMuted} style={styles.input} secureTextEntry
              />
            </View>

            {error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}

            <Pressable testID="submit-btn" disabled={busy} onPress={submit} style={[styles.submit, busy && { opacity: 0.7 }]}>
              {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>{mode === "signin" ? "Sign in" : "Create account"}</Text>}
            </Pressable>

            <Pressable onPress={() => { setError(null); setMode(mode === "signin" ? "signup" : "signin"); }} testID="toggle-mode">
              <Text style={styles.toggle}>
                {mode === "signin" ? "New to Tick-Pick? " : "Already have an account? "}
                <Text style={{ color: COLORS.brand, fontWeight: "500" }}>{mode === "signin" ? "Create an account" : "Sign in"}</Text>
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: SPACING.lg, gap: SPACING.md },
  back: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start" },
  backText: { color: COLORS.textMuted, fontSize: 13, fontWeight: "500" },
  logo: { fontFamily: FONT.display, fontSize: 28, fontWeight: "500", color: COLORS.text, textAlign: "center", marginTop: SPACING.md },
  card: { backgroundColor: COLORS.surface2, padding: SPACING.xl, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, marginTop: SPACING.md, gap: SPACING.md },
  title: { fontFamily: FONT.display, fontSize: 22, fontWeight: "500", color: COLORS.text, letterSpacing: -0.3 },
  sub: { color: COLORS.textMuted, fontSize: 13 },
  field: { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, height: 48 },
  input: { flex: 1, fontSize: 14, color: COLORS.text, fontWeight: "500", paddingVertical: 0 },
  errorBox: { backgroundColor: "rgba(239,68,68,0.1)", borderRadius: RADIUS.sm, padding: SPACING.sm, borderWidth: 1, borderColor: "rgba(239,68,68,0.25)" },
  errorText: { color: COLORS.error, fontSize: 12, fontWeight: "500" },
  submit: { backgroundColor: COLORS.text, paddingVertical: 14, borderRadius: RADIUS.pill, alignItems: "center", justifyContent: "center", marginTop: SPACING.sm },
  submitText: { color: "#fff", fontWeight: "500", fontSize: 14 },
  toggle: { textAlign: "center", color: COLORS.textMuted, fontSize: 13, marginTop: SPACING.sm },
});
