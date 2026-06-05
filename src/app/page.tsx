'use client'
import { useState } from 'react'
import StatusBar from '@/components/StatusBar'
import WinnerToast from '@/components/WinnerToast'
import TrustStrip from '@/components/TrustStrip'
import HeroCard from '@/components/HeroCard'
import CompactCard from '@/components/CompactCard'
import FilterTabs from '@/components/FilterTabs'
import BottomNav from '@/components/BottomNav'
import { POOLS } from '@/lib/data'

type Filter = 'All' | 'MICRO' | 'VOLUME' | 'MEGA'

export default function HomePage() {
  const [filter, setFilter] = useState<Filter>('All')
  const featuredPool = POOLS.find(p => p.featured)!
  const otherPools = POOLS.filter(p => !p.featured)
  const filtered = filter === 'All' ? otherPools : otherPools.filter(p => p.tier === filter)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg)' }}>
      <StatusBar />

      {/* NavBar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px 8px' }}>
        <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.03em' }}>Winify</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: 'var(--gold-bg)', border: '1px solid #FDE68A', borderRadius: 9999, padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 14 }}>⚡</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#92400E' }}>5 credits</span>
          </div>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #6D28D9, #C026D3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>A</span>
          </div>
        </div>
      </div>

      <WinnerToast />
      <TrustStrip />

      {/* Featured section */}
      <div style={{ padding: '0 16px 8px' }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>🔥 Featured</span>
      </div>
      <HeroCard pool={featuredPool} />

      {/* Filter */}
      <FilterTabs onFilter={setFilter} />

      {/* All Competitions */}
      <div style={{ padding: '0 16px 8px' }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>All Competitions</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px', flex: 1 }}>
        {filtered.map(pool => (
          <CompactCard key={pool.id} pool={pool} />
        ))}
      </div>

      <div style={{ height: 16 }} />
      <BottomNav active="home" />
    </div>
  )
}
