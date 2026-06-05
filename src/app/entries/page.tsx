import Link from 'next/link'
import StatusBar from '@/components/StatusBar'
import BottomNav from '@/components/BottomNav'
import { POOLS } from '@/lib/data'

const ACTIVE_ENTRIES = [
  { pool: POOLS[0], entryNum: '#0234', entryDate: 'Jun 3, 2026' },
  { pool: POOLS[4], entryNum: '#0062', entryDate: 'Jun 4, 2026' },
  { pool: POOLS[2], entryNum: '#0009', entryDate: 'Jun 5, 2026' },
]

export default function EntriesPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg)' }}>
      <StatusBar />

      <div style={{ padding: '12px 16px 16px' }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>My Entries</span>
      </div>

      {/* Active entries */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sec)', marginBottom: 2 }}>Active ({ACTIVE_ENTRIES.length})</div>

        {ACTIVE_ENTRIES.map(({ pool, entryNum, entryDate }) => (
          <div key={pool.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '14px', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
            {/* Header */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 13, background: pool.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                {pool.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{pool.prize}</div>
                <div style={{ fontSize: 11, color: 'var(--text-sec)', marginTop: 2 }}>Entry {entryNum} · Entered {entryDate}</div>
              </div>
              <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 8, padding: '4px 10px' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#059669' }}>ACTIVE</span>
              </div>
            </div>

            {/* Progress */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: 'var(--text-sec)' }}>{pool.entries}/{pool.total} entries</span>
                <span style={{ fontSize: 11, color: 'var(--text-sec)' }}>Closes in {pool.time}</span>
              </div>
              <div style={{ background: '#F0EBFF', borderRadius: 9999, height: 5 }}>
                <div style={{ background: pool.pct > 70 ? 'linear-gradient(90deg, #6D28D9, #EF4444)' : pool.accent, height: '100%', width: `${pool.pct}%`, borderRadius: 9999 }} />
              </div>
            </div>

            {/* RANDOM.ORG note */}
            <div style={{ background: 'var(--primary-light)', borderRadius: 8, padding: '7px 10px', display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 600 }}>Draw verified by RANDOM.ORG signed API</span>
            </div>

            {/* Simulate draw button */}
            <Link href="/winner-reveal" style={{ textDecoration: 'none', display: 'block' }}>
              <button style={{
                width: '100%', background: 'linear-gradient(135deg, #6D28D9, #9333EA)',
                color: 'white', border: 'none', borderRadius: 9999, padding: '11px',
                fontSize: 13, fontWeight: 700, cursor: 'pointer'
              }}>
                Simulate Draw →
              </button>
            </Link>
          </div>
        ))}

        {/* Postal entry card */}
        <div style={{ background: 'var(--card)', border: '2px dashed var(--border)', borderRadius: 16, padding: '18px 16px', textAlign: 'center', marginTop: 4 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>✉️</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Free Postal Entry</div>
          <div style={{ fontSize: 12, color: 'var(--text-sec)', lineHeight: 1.5, marginBottom: 12 }}>
            Enter any competition for free by post. Send your name, address and competition ID on a postcard to:
          </div>
          <div style={{ background: 'var(--primary-light)', borderRadius: 10, padding: '10px 14px', display: 'inline-block', textAlign: 'left' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', lineHeight: 1.6 }}>
              Winify Free Entry<br/>
              PO Box 1234<br/>
              London, EC1A 1BB<br/>
              United Kingdom
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-sec)', marginTop: 10 }}>No purchase necessary. 1 free entry per competition per household.</div>
        </div>
      </div>

      <div style={{ height: 16 }} />
      <BottomNav active="entries" />
    </div>
  )
}
