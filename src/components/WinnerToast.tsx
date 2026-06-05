'use client'
import { useEffect, useState } from 'react'
import { RECENT_WINNERS } from '@/lib/data'

export default function WinnerToast() {
  const [visible, setVisible] = useState(false)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(show)
  }, [])

  useEffect(() => {
    if (!visible) return
    const hide = setTimeout(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex(i => (i + 1) % RECENT_WINNERS.length)
        setVisible(true)
      }, 1000)
    }, 5000)
    return () => clearTimeout(hide)
  }, [visible, index])

  if (!visible) return null
  const w = RECENT_WINNERS[index]

  return (
    <div style={{
      position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)',
      maxWidth: 398, width: 'calc(100% - 32px)',
      background: '#ECFDF5', border: '1.5px solid #A7F3D0', borderRadius: 12,
      padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
      animation: 'slideUp 0.4s ease', zIndex: 100, boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
    }}>
      <span style={{ fontSize: 20 }}>🎉</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#065F46' }}>{w.name} just won {w.prize}</div>
        <div style={{ fontSize: 11, color: '#059669' }}>{w.timeAgo}</div>
      </div>
      <button onClick={() => setVisible(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#059669', fontSize: 16, padding: 0 }}>×</button>
    </div>
  )
}
