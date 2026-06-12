import React, { createContext, useContext, useEffect, useState } from "react";
import { API, getToken, setToken } from "./api";

type User = { id: string; email: string; display_name: string; is_admin: boolean; avatar_url?: string | null; created_at?: string };
type Ctx = {
  user: User | null;
  loading: boolean;
  signin: (e: string, p: string) => Promise<void>;
  signup: (e: string, p: string, n: string) => Promise<void>;
  signout: () => Promise<void>;
  refresh: () => Promise<void>;
};
const AuthCtx = createContext<Ctx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const t = await getToken();
        if (t) {
          const me = await API.me();
          setUser(me);
        }
      } catch {}
      setLoading(false);
    })();
  }, []);

  const signin = async (email: string, password: string) => {
    const r = await API.signin(email, password);
    await setToken(r.access_token);
    setUser(r.user);
  };
  const signup = async (email: string, password: string, name: string) => {
    const r = await API.signup(email, password, name);
    await setToken(r.access_token);
    setUser(r.user);
  };
  const signout = async () => { await setToken(null); setUser(null); };
  const refresh = async () => { try { const me = await API.me(); setUser(me); } catch {} };

  return <AuthCtx.Provider value={{ user, loading, signin, signup, signout, refresh }}>{children}</AuthCtx.Provider>;
}
export function useAuth() {
  const c = useContext(AuthCtx);
  if (!c) throw new Error("useAuth outside provider");
  return c;
}
