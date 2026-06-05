'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { POOLS } from '@/lib/data'

export default function SuccessPage() {
  const params = useParams()
  const id = params.id as string
  const pool = POOLS.find(p => p.id === Number(id)) ?? POOLS[0]
  const [animate, setAnimate] = useState(false)
  const entryNum = String(Math.floor(Math.random() * 9000) + 1000)

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px 30px' }}>
      {/* Checkmark */}
      <div style={{
        width: 90, height: 90, borderRadius: '50%', background: '#ECFDF5', border: '3px solid #A7F3D0',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
        animation: animate ? 'bounceIn 0.6s ease forwards' : 'none',
        transform: animate ? undefined : 'scale(0)', opacity: animate ? undefined : 0
      }}>
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <polyline points="8 22 18 32 36 12" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', textAlign: 'center', marginBottom: 8, letterSpacing: '-0.02em' }}>
        You&apos;re in! 🎉
      </div>
      <div style={{ fontSize: 14, color: 'var(--text-sec)', textAlign: 'center', marginBottom: 28, fontWeight: 500 }}>
        Your entry has been confirmed
      </div>

      {/* Entry details card */}
      <div style={{ width: '100%', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 18, padding: '20px', marginBottom: 16 }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 36 }}>{pool.emoji}</span>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginTop: 6 }}>{pool.prize}</div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Entry #', value: `#${entryNum}` },
            { label: 'Closes', value: pool.time },
            { label: 'Odds', value: `1 in ${pool.total}` },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: 'var(--text-sec)', fontWeight: 500 }}>{item.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Verification note */}
      <div style={{ width: '100%', background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '12px 16px', marginBottom: 28, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" style={{ flexShrink: 0, marginTop: 1 }}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <span style={{ fontSize: 12, color: '#065F46', lineHeight: 1.5 }}>
          Draw result will be verified and published on our public ledger via RANDOM.ORG signed API.
        </span>
      </div>

      {/* Buttons */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Link href="/entries" style={{ textDecoration: 'none', display: 'block' }}>
          <button style={{
            width: '100%', background: 'transparent', color: 'var(--primary)',
            border: '2px solid var(--primary)', borderRadius: 9999, padding: '15px',
            fontSize: 15, fontWeight: 700, cursor: 'pointer'
          }}>
            Watch Progress →
          </button>
        </Link>
        <Link href="/" style={{ textDecoration: 'none', display: 'block' }}>
          <button style={{
            width: '100%', background: 'linear-gradient(135deg, #6D28D9, #9333EA)',
            color: 'white', border: 'none', borderRadius: 9999, padding: '15px',
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(109,40,217,0.3)'
          }}>
            Enter Another Competition
          </button>
        </Link>
      </div>
    </div>
  )
}
