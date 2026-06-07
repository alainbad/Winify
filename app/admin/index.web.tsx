import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Colors } from '@/constants/theme'
import { POOLS } from '@/lib/data'
import { getSessionAsync, dbQuery } from '@/lib/auth'

const SUPABASE_URL = 'https://dwjghqslnrkcjhaoaneq.supabase.co'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3amdocXNsbnJrY2poYW9hbmVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NDM1NTgsImV4cCI6MjA5NjMxOTU1OH0.Q-q70ee0ViQpcPSTgRIe_-T6GorXrEo4uuc2dvb5UJE'
const ADMIN_EMAIL = 'badranalain87@gmail.com'

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [entryCounts, setEntryCounts] = useState<Record<number, number>>({})
  const [winners, setWinners] = useState<Record<number, any>>({})
  const [drawing, setDrawing] = useState<number | null>(null)
  const [results, setResults] = useState<Record<number, { ok: boolean; msg: string }>>({})

  useEffect(() => {
    getSessionAsync().then(s => {
      if (!s) return
      setToken(s.access_token)
      setUserEmail(s.user.email)
      loadData(s.access_token)
    })
  }, [])

  async function loadData(tok: string) {
    // Load entry counts per pool
    const counts: Record<number, number> = {}
    await Promise.all(POOLS.map(async p => {
      const data = await dbQuery(`entries?pool_id=eq.${p.id}&select=id`, tok)
      counts[p.id] = Array.isArray(data) ? data.length : 0
    }))
    setEntryCounts(counts)

    // Load existing winners
    const res = await fetch(`${SUPABASE_URL}/rest/v1/winners?select=*`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${tok}` },
    })
    const w = await res.json()
    const winMap: Record<number, any> = {}
    if (Array.isArray(w)) w.forEach((winner: any) => { winMap[winner.pool_id] = winner })
    setWinners(winMap)
  }

  async function triggerDraw(poolId: number) {
    if (!token) return
    setDrawing(poolId)
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/draw-winner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          apikey: ANON_KEY,
        },
        body: JSON.stringify({ pool_id: poolId }),
      })
      const data = await res.json()
      if (data.success) {
        setResults(r => ({ ...r, [poolId]: { ok: true, msg: `Winner: ${data.winner.winner_name} (${data.winner.winner_email})` } }))
        setWinners(w => ({ ...w, [poolId]: data.winner }))
      } else {
        setResults(r => ({ ...r, [poolId]: { ok: false, msg: data.error || 'Draw failed' } }))
      }
    } catch (e) {
      setResults(r => ({ ...r, [poolId]: { ok: false, msg: String(e) } }))
    }
    setDrawing(null)
  }

  if (!userEmail) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bg }}>
        <ActivityIndicator color={Colors.primary} />
        <Text style={{ color: Colors.textSec, marginTop: 12 }}>Checking auth…</Text>
      </View>
    )
  }

  if (userEmail !== ADMIN_EMAIL) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.bg }}>
        <Text style={{ fontSize: 24 }}>🚫</Text>
        <Text style={{ fontSize: 18, fontWeight: '700', color: Colors.text, marginTop: 12 }}>Access Denied</Text>
        <Text style={{ color: Colors.textSec, marginTop: 8 }}>Admin only.</Text>
      </View>
    )
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.bg }}>
      {/* Header */}
      <View style={{ backgroundColor: Colors.primary, paddingHorizontal: 32, paddingTop: 48, paddingBottom: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="11" fill="white"/>
            <path d="M20 9l2.8 6.1 6.1.9-4.4 4.3 1.05 6.1L20 23.2l-5.55 3.2 1.05-6.1-4.4-4.3 6.1-.9z" fill="#7C3AED"/>
          </svg>
          <Text style={{ fontSize: 20, fontWeight: '900', color: '#fff', letterSpacing: -0.5 }}>Tick<Text style={{ color: '#F59E0B' }}>Pick</Text></Text>
        </View>
        <Text style={{ fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5, marginBottom: 4 }}>ADMIN PANEL</Text>
        <Text style={{ fontSize: 28, fontWeight: '900', color: '#fff' }}>Draw Manager</Text>
        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>Trigger RANDOM.ORG draws for completed pools</Text>
      </View>

      <View style={{ maxWidth: 900, alignSelf: 'center', width: '100%', padding: 32 }}>
        {POOLS.map(pool => {
          const count = entryCounts[pool.id] ?? 0
          const winner = winners[pool.id]
          const result = results[pool.id]
          const isDrawing = drawing === pool.id
          const isFull = count >= pool.total
          const hasWinner = !!winner

          return (
            <View key={pool.id} style={{ backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: Colors.border, padding: 20, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              {/* Pool info */}
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <View style={{ backgroundColor: Colors.primaryLight, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: Colors.primary }}>{pool.tier}</Text>
                  </View>
                  <Text style={{ fontSize: 10, color: Colors.muted }}>ID #{pool.id}</Text>
                </View>
                <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 4 }}>{pool.prize}</Text>
                <Text style={{ fontSize: 13, color: Colors.textSec }}>
                  {count}/{pool.total} entries · ${pool.price} each
                </Text>
                {hasWinner && (
                  <View style={{ marginTop: 8, backgroundColor: '#F0FDF4', borderRadius: 8, padding: 10, borderWidth: 1, borderColor: '#BBF7D0' }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#16A34A' }}>🏆 Winner drawn</Text>
                    <Text style={{ fontSize: 12, color: '#16A34A', marginTop: 2 }}>{winner.winner_name} · {winner.winner_email}</Text>
                    <Text style={{ fontSize: 11, color: '#4ADE80', marginTop: 2 }}>
                      Ticket #{winner.random_index + 1} of {winner.total_entries} · {new Date(winner.drawn_at).toLocaleDateString()}
                    </Text>
                  </View>
                )}
                {result && !hasWinner && (
                  <View style={{ marginTop: 8, backgroundColor: result.ok ? '#F0FDF4' : '#FEF2F2', borderRadius: 8, padding: 10, borderWidth: 1, borderColor: result.ok ? '#BBF7D0' : '#FECACA' }}>
                    <Text style={{ fontSize: 12, color: result.ok ? '#16A34A' : '#DC2626' }}>{result.msg}</Text>
                  </View>
                )}
              </View>

              {/* Progress bar */}
              <View style={{ width: 80, alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: '800', color: isFull ? Colors.green : Colors.text }}>{Math.round((count / pool.total) * 100)}%</Text>
                <Text style={{ fontSize: 10, color: Colors.muted }}>filled</Text>
              </View>

              {/* Draw button */}
              <TouchableOpacity
                onPress={() => triggerDraw(pool.id)}
                disabled={isDrawing || hasWinner || count === 0}
                style={{
                  backgroundColor: hasWinner ? Colors.border : count === 0 ? Colors.border : Colors.primary,
                  borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, minWidth: 120, alignItems: 'center',
                  opacity: (isDrawing || count === 0) && !hasWinner ? 0.6 : 1,
                }}
              >
                {isDrawing
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Text style={{ fontSize: 13, fontWeight: '700', color: hasWinner ? Colors.muted : '#fff' }}>
                      {hasWinner ? '✓ Drawn' : '🎲 Draw Now'}
                    </Text>
                }
              </TouchableOpacity>
            </View>
          )
        })}
      </View>
    </ScrollView>
  )
}
