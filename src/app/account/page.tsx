import StatusBar from '@/components/StatusBar'
import BottomNav from '@/components/BottomNav'

const SETTINGS = [
  { label: 'Notifications', icon: '🔔' },
  { label: 'Free Entry (Post)', icon: '✉️' },
  { label: 'Terms & Conditions', icon: '📋' },
  { label: 'Privacy Policy', icon: '🔒' },
]

export default function AccountPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg)' }}>
      <StatusBar />

      <div style={{ padding: '12px 16px 8px' }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>Account</span>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
        {/* Profile card */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20, padding: '20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #6D28D9, #C026D3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 800, color: 'white', flexShrink: 0 }}>
            A
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', marginBottom: 3 }}>Alex Johnson</div>
            <div style={{ fontSize: 13, color: 'var(--text-sec)', marginBottom: 3 }}>a***@gmail.com</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500 }}>Member since Jan 2026</div>
          </div>
          <button style={{ background: 'var(--primary-light)', color: 'var(--primary)', border: 'none', borderRadius: 9999, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            Edit
          </button>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            { label: 'Entries', value: '12', icon: '🎟️' },
            { label: 'Wins', value: '1', icon: '🏆' },
            { label: 'Credits', value: '5', icon: '⚡' },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{stat.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginBottom: 2 }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-sec)', fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* How Winify Works */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '16px' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>How Winify Works</div>
          <div style={{ fontSize: 13, color: 'var(--text-sec)', lineHeight: 1.6 }}>
            Winify operates as a skill competition platform. Each competition requires you to correctly answer a skill question before paying your entry fee. Winners are selected using RANDOM.ORG&apos;s cryptographically-signed API, ensuring fully verifiable and tamper-proof results.
            <br /><br />
            All competitions are subject to UK law. Winify is not a lottery. A free postal entry route is available for all competitions, ensuring compliance with competition law.
          </div>
        </div>

        {/* Settings list */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          {SETTINGS.map((item, i) => (
            <button key={item.label} style={{
              width: '100%', background: 'transparent', border: 'none',
              borderBottom: i < SETTINGS.length - 1 ? '1px solid var(--border)' : 'none',
              padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
              textAlign: 'left'
            }}>
              <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{item.icon}</span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{item.label}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          ))}
        </div>

        {/* Sign Out */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          <button style={{
            width: '100%', background: 'transparent', border: 'none',
            padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
            textAlign: 'left'
          }}>
            <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>🚪</span>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: '#EF4444' }}>Sign Out</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>

        {/* Version */}
        <div style={{ textAlign: 'center', paddingBottom: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>Winify v0.1.0 · Made with ❤️ in the UK</span>
        </div>
      </div>

      <BottomNav active="account" />
    </div>
  )
}
