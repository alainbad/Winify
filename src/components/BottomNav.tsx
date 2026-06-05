'use client'
import Link from 'next/link'

type Tab = 'home' | 'browse' | 'entries' | 'account'

const tabs = [
  { id: 'home' as Tab, label: 'Home', href: '/', icon: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#6D28D9' : '#C4B8DC'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )},
  { id: 'browse' as Tab, label: 'Browse', href: '/browse', icon: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#6D28D9' : '#C4B8DC'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  )},
  { id: 'entries' as Tab, label: 'My Entries', href: '/entries', icon: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#6D28D9' : '#C4B8DC'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 010-6h20a3 3 0 010 6"/><path d="M2 9v11a2 2 0 002 2h16a2 2 0 002-2V9"/><path d="M12 3v18"/>
    </svg>
  )},
  { id: 'account' as Tab, label: 'Account', href: '/account', icon: (active: boolean) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#6D28D9' : '#C4B8DC'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  )},
]

export default function BottomNav({ active }: { active: Tab }) {
  return (
    <div style={{ height: 66, background: 'var(--card)', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-around', position: 'sticky', bottom: 0, zIndex: 50 }}>
      {tabs.map(tab => (
        <Link key={tab.id} href={tab.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none' }}>
          {tab.icon(active === tab.id)}
          <span style={{ fontSize: 10, fontWeight: active === tab.id ? 700 : 500, color: active === tab.id ? '#6D28D9' : '#C4B8DC', letterSpacing: '0.02em' }}>{tab.label}</span>
        </Link>
      ))}
    </div>
  )
}
