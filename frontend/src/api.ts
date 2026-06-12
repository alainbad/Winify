import { API_BASE } from "./theme";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const KEY = "tp_token";

export async function getToken(): Promise<string | null> {
  if (Platform.OS === "web") return (typeof window !== "undefined" ? window.localStorage.getItem(KEY) : null);
  return await SecureStore.getItemAsync(KEY);
}
export async function setToken(t: string | null) {
  if (Platform.OS === "web") {
    if (typeof window === "undefined") return;
    if (t === null) window.localStorage.removeItem(KEY); else window.localStorage.setItem(KEY, t);
    return;
  }
  if (t === null) await SecureStore.deleteItemAsync(KEY); else await SecureStore.setItemAsync(KEY, t);
}

async function req<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json", ...(opts.headers as any) };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const r = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  if (!r.ok) {
    let detail = "Request failed";
    try { const j = await r.json(); detail = j.detail || detail; } catch {}
    throw new Error(detail);
  }
  return r.json();
}

export const API = {
  signup: (email: string, password: string, display_name: string) =>
    req<{ access_token: string; user: any }>("/auth/signup", { method: "POST", body: JSON.stringify({ email, password, display_name }) }),
  signin: (email: string, password: string) =>
    req<{ access_token: string; user: any }>("/auth/signin", { method: "POST", body: JSON.stringify({ email, password }) }),
  me: () => req<any>("/auth/me"),
  updateMe: (body: any) => req<any>("/auth/me", { method: "PATCH", body: JSON.stringify(body) }),
  pools: () => req<any[]>("/pools"),
  pool: (id: string) => req<any>(`/pools/${id}`),
  createEntry: (competition_id: string, qty: number) =>
    req<any>("/entries", { method: "POST", body: JSON.stringify({ competition_id, qty }) }),
  myEntries: () => req<any[]>("/entries/mine"),
  draws: () => req<any[]>("/draws"),
  adminOverview: () => req<any>("/admin/overview"),
  runDraw: (pid: string) => req<any>(`/admin/draws/${pid}`, { method: "POST" }),
};
