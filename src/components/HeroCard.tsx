import Link from 'next/link'
import { Pool } from '@/lib/data'

export default function HeroCard({ pool }: { pool: Pool }) {
  return (
    <Link href={`/competition/${pool.id}`} style={{ textDecoration: 'none', display: 'block', margin: '0 16px 12px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #6D28D9, #9333EA, #C026D3)',
        borderRadius: 22, padding: '20px 20px 24px', position: 'relative', overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(109,40,217,0.28)'
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -30, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        {/* FEATURED badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, position: 'relative' }}>
          <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', padding: '4px 10px', borderRadius: 9999 }}>FEATURED POOL</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80', display: 'inline-block', animation: 'livepulse 1.8s ease-in-out infinite' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{pool.entries} entries</span>
          </div>
        </div>

        {/* Prize */}
        <div style={{ position: 'relative', marginBottom: 6 }}>
          <div style={{ fontSize: 42, marginBottom: 4 }}>{pool.emoji}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'white', letterSpacing: '-0.03em', lineHeight: 1.1 }}>{pool.prize}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 6, fontWeight: 500 }}>{pool.desc}</div>
        </div>

        {/* Countdown */}
        <div style={{ marginTop: 16, marginBottom: 12, position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Closes in {pool.time}</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{pool.entries}/{pool.total}</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 9999, height: 6 }}>
            <div style={{ background: 'linear-gradient(90deg, #F59E0B, #FDE68A)', height: '100%', width: `${pool.pct}%`, borderRadius: 9999 }} />
          </div>
        </div>

        {/* CTA */}
        <button style={{
          width: '100%', background: 'white', color: '#6D28D9', border: 'none', borderRadius: 9999,
          padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: '-0.01em'
        }}>
          Enter for ${pool.price} →
        </button>
      </div>
    </Link>
  )
}
