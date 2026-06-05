'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const CONFETTI_COLORS = ['#6D28D9', '#F59E0B', '#059669', '#EF4444', '#2563EB', '#C026D3']

interface Confetti {
  id: number
  color: string
  left: string
  delay: string
  size: number
}

function generateConfetti(): Confetti[] {
  return Array.from({ length: 30 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: `${Math.random() * 100}%`,
    delay: `${(Math.random() * 2).toFixed(2)}s`,
    size: Math.floor(Math.random() * 8) + 6,
  }))
}

export default function WinnerRevealPage() {
  const [confetti] = useState<Confetti[]>(generateConfetti)
  const [animate, setAnimate] = useState(false)
  const now = new Date()
  const utcStr = now.toUTCString()

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), 200)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px 30px' }}>
      {/* Confetti */}
      {confetti.map(c => (
        <div key={c.id} style={{
          position: 'absolute', top: -20, left: c.left,
          width: c.size, height: c.size,
          background: c.color, borderRadius: 2,
          animation: `confettiFall 3s ease-in forwards`,
          animationDelay: c.delay,
          zIndex: 0,
        }} />
      ))}

      <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Trophy */}
        <div style={{
          fontSize: 72, marginBottom: 16,
          animation: animate ? 'bounceIn 0.6s ease forwards' : 'none',
          transform: animate ? undefined : 'scale(0)', opacity: animate ? undefined : 0
        }}>
          🏆
        </div>

        <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', textAlign: 'center', marginBottom: 6, letterSpacing: '-0.02em' }}>
          We have a winner!
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-sec)', textAlign: 'center', marginBottom: 28 }}>
          Congratulations to our latest winner
        </div>

        {/* Winner card */}
        <div style={{ width: '100%', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: '24px 20px', marginBottom: 16, textAlign: 'center', boxShadow: '0 8px 32px rgba(109,40,217,0.12)' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #6D28D9, #C026D3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 24, fontWeight: 800, color: 'white' }}>
            J
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 4 }}>j***n</div>
          <div style={{ fontSize: 14, color: 'var(--text-sec)', marginBottom: 16 }}>won</div>
          <div style={{ background: 'linear-gradient(135deg, #6D28D9, #9333EA)', borderRadius: 12, padding: '14px', marginBottom: 12 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>$500 Amazon Voucher</div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-sec)', fontWeight: 500 }}>Ticket #37 of 750</div>
        </div>

        {/* Verification card */}
        <div style={{ width: '100%', background: '#ECFDF5', border: '2px solid #A7F3D0', borderRadius: 16, padding: '16px', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10" stroke="#059669"/></svg>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#065F46' }}>Verified Draw</span>
          </div>
          {[
            { label: 'Provider', value: 'RANDOM.ORG' },
            { label: 'Timestamp', value: utcStr },
            { label: 'Signature', value: '7f3a9c2e4b1d...' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 4 }}>
              <span style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>{item.label}</span>
              <span style={{ fontSize: 11, color: '#065F46', fontWeight: 500, maxWidth: 200, textAlign: 'right', wordBreak: 'break-all' }}>{item.value}</span>
            </div>
          ))}
          <button style={{ width: '100%', background: 'transparent', border: '1px solid #059669', color: '#059669', borderRadius: 9999, padding: '9px', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginTop: 8 }}>
            Verify on Public Ledger →
          </button>
        </div>

        {/* CTA */}
        <Link href="/" style={{ textDecoration: 'none', display: 'block', width: '100%' }}>
          <button style={{
            width: '100%', background: 'linear-gradient(135deg, #6D28D9, #9333EA)',
            color: 'white', border: 'none', borderRadius: 9999, padding: '16px',
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(109,40,217,0.3)'
          }}>
            Enter Next Competition →
          </button>
        </Link>
      </div>
    </div>
  )
}
