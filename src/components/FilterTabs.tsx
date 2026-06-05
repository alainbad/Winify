'use client'
import { useState } from 'react'

type Filter = 'All' | 'MICRO' | 'VOLUME' | 'MEGA'

export default function FilterTabs({ onFilter }: { onFilter: (f: Filter) => void }) {
  const [active, setActive] = useState<Filter>('All')
  const tabs: Filter[] = ['All', 'MICRO', 'VOLUME', 'MEGA']
  return (
    <div style={{ display: 'flex', gap: 8, padding: '0 16px 12px', overflowX: 'auto' }}>
      {tabs.map(tab => (
        <button key={tab} onClick={() => { setActive(tab); onFilter(tab) }}
          style={{
            background: active === tab ? 'var(--primary)' : 'var(--card)',
            color: active === tab ? 'white' : 'var(--text-sec)',
            border: active === tab ? 'none' : '1px solid var(--border)',
            borderRadius: 9999, padding: '7px 16px', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0
          }}>{tab}</button>
      ))}
    </div>
  )
}
