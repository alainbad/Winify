import Link from 'next/link'
import { POOLS } from '@/lib/data'
import BottomNav from '@/components/BottomNav'

const MOCK_ENTRANTS = [
  { name: 'j***n', ticket: '#0041' },
  { name: 'm***e', ticket: '#0038' },
  { name: 's***h', ticket: '#0035' },
  { name: 'r***a', ticket: '#0029' },
  { name: 'k***l', ticket: '#0022' },
]

export default function CompetitionPage({ params }: { params: { id: string } }) {
  const pool = POOLS.find(p => p.id === Number(params.id)) ?? POOLS[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
        <Link href="/browse" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 10, background: 'var(--primary-light)', color: 'var(--primary)', fontSize: 18, fontWeight: 700 }}>
          ←
        </Link>
        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Competition Detail</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 20 }}>
        {/* Prize card */}
        <div style={{ margin: '16px 16px 12px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: '24px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>{pool.emoji}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 8 }}>{pool.prize}</div>
          <div style={{ fontSize: 13, color: 'var(--text-sec)', lineHeight: 1.5 }}>{pool.desc}</div>
          <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6, background: pool.accentBg, borderRadius: 9999, padding: '4px 12px' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: pool.accent, letterSpacing: '0.06em' }}>{pool.tier}</span>
            {pool.hot && <span style={{ fontSize: 11, fontWeight: 700, color: '#EA580C' }}>· HOT 🔥</span>}
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ margin: '0 16px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            { label: 'Entry Price', value: `$${pool.price}.00` },
            { label: 'Pool Size', value: `${pool.total}` },
            { label: 'Closes In', value: pool.time },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '12px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', marginBottom: 3 }}>{stat.value}</div>
              <div style={{ fontSize: 10, color: 'var(--text-sec)', fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ margin: '0 16px 16px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Entries</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sec)' }}>{pool.entries} / {pool.total}</span>
          </div>
          <div style={{ background: '#F0EBFF', borderRadius: 9999, height: 8 }}>
            <div style={{ background: pool.pct > 70 ? 'linear-gradient(90deg, #6D28D9, #EF4444)' : pool.accent, height: '100%', width: `${pool.pct}%`, borderRadius: 9999, transition: 'width 0.3s ease' }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-sec)', marginTop: 6, textAlign: 'right' }}>{pool.pct}% full</div>
        </div>

        {/* How It Works */}
        <div style={{ margin: '0 16px 16px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '16px' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>How It Works</div>
          {[
            'Answer a skill question correctly',
            'Pay $2 — ticket instantly issued',
            'Pool locks when full or timer expires',
            'RANDOM.ORG selects winner — cryptographically verifiable',
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: i < 3 ? 12 : 0 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {i + 1}
              </div>
              <span style={{ fontSize: 13, color: 'var(--text-sec)', lineHeight: 1.5, paddingTop: 3 }}>{step}</span>
            </div>
          ))}
        </div>

        {/* Recent Entrants */}
        <div style={{ margin: '0 16px 16px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '16px' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Recent Entrants</div>
          {MOCK_ENTRANTS.map((e, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>
                  {e.name[0].toUpperCase()}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{e.name}</span>
              </div>
              <span style={{ fontSize: 12, color: 'var(--text-sec)', fontWeight: 500 }}>Ticket {e.ticket}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ padding: '0 16px' }}>
          <Link href={`/competition/${pool.id}/skill-gate`} style={{ textDecoration: 'none', display: 'block' }}>
            <button style={{
              width: '100%', background: 'linear-gradient(135deg, #6D28D9, #9333EA)',
              color: 'white', border: 'none', borderRadius: 9999, padding: '16px',
              fontSize: 16, fontWeight: 700, cursor: 'pointer', letterSpacing: '-0.01em',
              boxShadow: '0 6px 20px rgba(109,40,217,0.3)'
            }}>
              Enter for $2 →
            </button>
          </Link>
          <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, color: 'var(--text-sec)' }}>
            Skill competition · RANDOM.ORG verified draw
          </div>
        </div>
      </div>

      <BottomNav active="browse" />
    </div>
  )
}
