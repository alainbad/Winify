import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import { router } from 'expo-router'
import { Colors } from '@/constants/theme'
import { POOLS } from '@/lib/data'

const SUPABASE_URL = 'https://dwjghqslnrkcjhaoaneq.supabase.co'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3amdocXNsbnJrY2poYW9hbmVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NDM1NTgsImV4cCI6MjA5NjMxOTU1OH0.Q-q70ee0ViQpcPSTgRIe_-T6GorXrEo4uuc2dvb5UJE'

const LOGO_DEV_TOKEN = 'pk_OfBoU3ocR7WzMrZfenk7Iw'
const BRAND_DOMAINS: Record<string, string> = {
  'Amazon': 'amazon.com', 'Xbox': 'xbox.com', 'Netflix': 'netflix.com',
  'Steam': 'steampowered.com', 'Spotify': 'spotify.com', 'Roblox': 'roblox.com',
  'Google Play': 'play.google.com', 'Apple': 'apple.com', 'Uber Eats': 'ubereats.com',
  'Starbucks': 'starbucks.com', 'PlayStation': 'playstation.com', 'Microsoft': 'microsoft.com',
  'Booking.com': 'booking.com', 'Airbnb': 'airbnb.com', 'Nintendo': 'nintendo.com',
  'Disney+': 'disneyplus.com', 'Expedia': 'expedia.com',
}

export default function WinnersPage() {
  const [winners, setWinners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/winners?select=*&order=drawn_at.desc`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
    })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setWinners(data) })
      .finally(() => setLoading(false))
  }, [])

  const poolMap = Object.fromEntries(POOLS.map(p => [p.id, p]))

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F6FA' }}>
      {/* Nav */}
      <View style={{ backgroundColor: Colors.primary }}>
        <View style={{ maxWidth: 1280, width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 32, paddingVertical: 14 }}>
          <TouchableOpacity onPress={() => router.push('/')} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="11" fill="white"/>
              <path d="M20 9l2.8 6.1 6.1.9-4.4 4.3 1.05 6.1L20 23.2l-5.55 3.2 1.05-6.1-4.4-4.3 6.1-.9z" fill="#7C3AED"/>
            </svg>
            <Text style={{ fontSize: 20, fontWeight: '900', color: '#fff', letterSpacing: -0.5 }}>Tick<Text style={{ color: '#F59E0B' }}>Pick</Text></Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 28 }}>
            <TouchableOpacity onPress={() => router.push('/browse')}><Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>Browse</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/winners')}><Text style={{ fontSize: 13, fontWeight: '800', color: '#FBBF24' }}>Winners</Text></TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Header */}
      <View style={{ backgroundColor: Colors.primary, paddingHorizontal: 32, paddingBottom: 40, paddingTop: 8 }}>
        <View style={{ maxWidth: 900, alignSelf: 'center', width: '100%' }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5, marginBottom: 6 }}>HALL OF WINNERS</Text>
          <Text style={{ fontSize: 36, fontWeight: '900', color: '#fff', letterSpacing: -1 }}>Our Winners 🏆</Text>
          <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>Every draw is verified by RANDOM.ORG — transparent, tamper-proof, and fair.</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={{ maxWidth: 900, alignSelf: 'center', width: '100%', paddingHorizontal: 32, paddingTop: 32 }}>
          {loading ? (
            <View style={{ alignItems: 'center', paddingTop: 60 }}>
              <ActivityIndicator color={Colors.primary} size="large" />
              <Text style={{ color: Colors.textSec, marginTop: 12 }}>Loading winners…</Text>
            </View>
          ) : winners.length === 0 ? (
            <View style={{ alignItems: 'center', paddingTop: 80 }}>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>🎲</Text>
              <Text style={{ fontSize: 20, fontWeight: '800', color: Colors.text, marginBottom: 8 }}>No draws yet</Text>
              <Text style={{ fontSize: 14, color: Colors.textSec, textAlign: 'center' }}>The first winner will appear here once a pool fills up.</Text>
              <TouchableOpacity onPress={() => router.push('/browse')} style={{ marginTop: 24, backgroundColor: Colors.primary, borderRadius: 10, paddingHorizontal: 24, paddingVertical: 12 }}>
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>Browse Competitions</Text>
              </TouchableOpacity>
            </View>
          ) : (
            winners.map((w, i) => {
              const pool = poolMap[w.pool_id]
              const domain = pool ? BRAND_DOMAINS[pool.brand] : null
              const drawnDate = new Date(w.drawn_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
              return (
                <View key={w.id} style={{ backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: Colors.border, padding: 24, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                  {/* Rank */}
                  <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: i === 0 ? '#FBBF24' : Colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: i === 0 ? 22 : 16, fontWeight: '900', color: i === 0 ? '#7C2D12' : Colors.primary }}>{i === 0 ? '🏆' : `#${i + 1}`}</Text>
                  </View>

                  {/* Logo */}
                  {domain ? (
                    <img
                      src={`https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}&size=64&format=png`}
                      width={48} height={48}
                      alt={pool?.brand ?? ''}
                      style={{ objectFit: 'contain', borderRadius: 8, border: '1px solid #E5E7EB' } as any}
                    />
                  ) : (
                    <View style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 20 }}>🎁</Text>
                    </View>
                  )}

                  {/* Info */}
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: 2 }}>{pool?.prize ?? `Pool #${w.pool_id}`}</Text>
                    <Text style={{ fontSize: 13, color: Colors.textSec, marginBottom: 4 }}>
                      Won by <Text style={{ fontWeight: '700', color: Colors.text }}>{w.winner_name || 'Anonymous'}</Text>
                    </Text>
                    <Text style={{ fontSize: 11, color: Colors.muted }}>
                      Ticket #{w.random_index + 1} of {w.total_entries} · {drawnDate}
                    </Text>
                  </View>

                  {/* Badge */}
                  <View style={{ backgroundColor: '#F0FDF4', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#BBF7D0' }}>
                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#16A34A' }}>✓ VERIFIED</Text>
                  </View>
                </View>
              )
            })
          )}
        </View>
      </ScrollView>
    </View>
  )
}
