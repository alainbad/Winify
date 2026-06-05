import Link from 'next/link'
import { Pool } from '@/lib/data'

export default function CompactCard({ pool }: { pool: Pool }) {
  return (
    <Link href={`/competition/${pool.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16,
        padding: '13px 14px', display: 'flex', gap: 12, alignItems: 'center',
        boxShadow: '0 1px 8px rgba(0,0,0,0.05)'
      }}>
        {/* Emoji */}
        <div style={{ width: 52, height: 52, borderRadius: 14, background: pool.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
          {pool.emoji}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: pool.accent, background: pool.accentBg, padding: '2px 8px', borderRadius: 9999 }}>{pool.tier}</span>
            {pool.hot && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: '#EA580C', background: '#FFF7ED', padding: '2px 8px', borderRadius: 9999 }}>HOT 🔥</span>}
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pool.prize}</div>
          <div style={{ background: '#F0EBFF', borderRadius: 9999, height: 4, marginBottom: 4 }}>
            <div style={{ background: pool.pct > 70 ? 'linear-gradient(90deg, #6D28D9, #EF4444)' : pool.accent, height: '100%', width: `${pool.pct}%`, borderRadius: 9999 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: 'var(--text-sec)', fontWeight: 500 }}>{pool.entries}/{pool.total} entries</span>
            <span style={{ fontSize: 11, color: 'var(--text-sec)', fontWeight: 500 }}>{pool.time}</span>
          </div>
        </div>

        {/* Price button */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 700, fontSize: 13, padding: '8px 12px', borderRadius: 9999, whiteSpace: 'nowrap' }}>${pool.price}</div>
        </div>
      </div>
    </Link>
  )
}
