'use client'
import { useState } from 'react'
import StatusBar from '@/components/StatusBar'
import CompactCard from '@/components/CompactCard'
import FilterTabs from '@/components/FilterTabs'
import BottomNav from '@/components/BottomNav'
import { POOLS } from '@/lib/data'

type Filter = 'All' | 'MICRO' | 'VOLUME' | 'MEGA'

export default function BrowsePage() {
  const [filter, setFilter] = useState<Filter>('All')
  const [query, setQuery] = useState('')
  const filtered = POOLS.filter(p => {
    const matchTier = filter === 'All' || p.tier === filter
    const matchQuery = p.prize.toLowerCase().includes(query.toLowerCase())
    return matchTier && matchQuery
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg)' }}>
      <StatusBar />

      <div style={{ padding: '12px 16px 8px' }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>Browse Competitions</span>
      </div>

      {/* Search bar */}
      <div style={{ padding: '0 16px 12px' }}>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Search prizes..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              border: 'none', outline: 'none', background: 'transparent',
              fontSize: 14, color: 'var(--text)', flex: 1, fontFamily: 'inherit'
            }}
          />
        </div>
      </div>

      <FilterTabs onFilter={setFilter} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px', flex: 1 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-sec)', fontSize: 14 }}>
            No competitions found
          </div>
        ) : (
          filtered.map(pool => <CompactCard key={pool.id} pool={pool} />)
        )}
      </div>

      <div style={{ height: 16 }} />
      <BottomNav active="browse" />
    </div>
  )
}
