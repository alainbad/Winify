'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { POOLS } from '@/lib/data'

type PayState = 'idle' | 'loading' | 'done'

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const pool = POOLS.find(p => p.id === Number(id)) ?? POOLS[0]

  const [payMethod, setPayMethod] = useState<'apple' | 'card'>('apple')
  const [agreed, setAgreed] = useState(false)
  const [payState, setPayState] = useState<PayState>('idle')

  const handlePay = () => {
    if (!agreed) return
    setPayState('loading')
    setTimeout(() => {
      setPayState('done')
      router.push(`/competition/${id}/success`)
    }, 1800)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
        <Link href={`/competition/${id}/skill-gate`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 10, background: 'var(--primary-light)', color: 'var(--primary)', fontSize: 18, fontWeight: 700 }}>
          ←
        </Link>
        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Confirm Entry</span>
      </div>

      <div style={{ flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Skill gate passed badge */}
        <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#065F46' }}>Skill Gate Passed</span>
        </div>

        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.02em' }}>Confirm Your Entry</div>

        {/* Order summary */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: '16px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sec)', marginBottom: 12 }}>Order Summary</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 24 }}>{pool.emoji}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{pool.prize}</div>
                <div style={{ fontSize: 11, color: 'var(--text-sec)' }}>{pool.tier} Pool · 1 entry</div>
              </div>
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>$2.00</span>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Total</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--primary)' }}>$2.00</span>
          </div>
        </div>

        {/* Payment method */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-sec)', marginBottom: 10 }}>Payment Method</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {/* Apple Pay */}
            <button onClick={() => setPayMethod('apple')} style={{
              flex: 1, background: payMethod === 'apple' ? 'var(--primary-light)' : 'var(--card)',
              border: payMethod === 'apple' ? '2px solid var(--primary)' : '1px solid var(--border)',
              borderRadius: 14, padding: '14px 10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6
            }}>
              <div style={{ background: '#000', color: 'white', borderRadius: 6, padding: '4px 10px', fontSize: 12, fontWeight: 700, letterSpacing: '-0.02em' }}>
                Apple Pay
              </div>
              {payMethod === 'apple' && <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--primary)' }}>Selected</span>}
            </button>

            {/* Card */}
            <button onClick={() => setPayMethod('card')} style={{
              flex: 1, background: payMethod === 'card' ? 'var(--primary-light)' : 'var(--card)',
              border: payMethod === 'card' ? '2px solid var(--primary)' : '1px solid var(--border)',
              borderRadius: 14, padding: '14px 10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6
            }}>
              <svg width="28" height="20" viewBox="0 0 28 20" fill="none">
                <rect width="28" height="20" rx="4" fill={payMethod === 'card' ? '#6D28D9' : '#E8DEFF'}/>
                <rect x="0" y="5" width="28" height="5" fill={payMethod === 'card' ? '#4C1D95' : '#C4B8DC'}/>
                <rect x="4" y="13" width="8" height="3" rx="1" fill={payMethod === 'card' ? 'white' : '#7B6A98'}/>
              </svg>
              <span style={{ fontSize: 12, fontWeight: 600, color: payMethod === 'card' ? 'var(--primary)' : 'var(--text-sec)' }}>Credit Card</span>
              {payMethod === 'card' && <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--primary)' }}>Selected</span>}
            </button>
          </div>
        </div>

        {/* Terms checkbox */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <button onClick={() => setAgreed(a => !a)} style={{
            width: 20, height: 20, borderRadius: 5, border: agreed ? 'none' : '2px solid var(--border)',
            background: agreed ? 'var(--primary)' : 'transparent', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1
          }}>
            {agreed && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>}
          </button>
          <span style={{ fontSize: 12, color: 'var(--text-sec)', lineHeight: 1.5 }}>
            I confirm I am 18+, have read the{' '}
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Terms & Conditions</span>
            {' '}and{' '}
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Privacy Policy</span>
            , and understand this is a skill competition. The $2.00 fee is non-refundable.
          </span>
        </div>

        {/* Pay button */}
        <button
          onClick={handlePay}
          disabled={!agreed || payState === 'loading'}
          style={{
            width: '100%', background: agreed ? 'linear-gradient(135deg, #6D28D9, #9333EA)' : 'var(--muted)',
            color: 'white', border: 'none', borderRadius: 9999, padding: '16px',
            fontSize: 16, fontWeight: 700, cursor: agreed ? 'pointer' : 'not-allowed',
            boxShadow: agreed ? '0 6px 20px rgba(109,40,217,0.3)' : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
          }}>
          {payState === 'loading' ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.3"/>
                <path d="M21 12c0-4.97-4.03-9-9-9"/>
              </svg>
              Processing...
            </>
          ) : 'Confirm & Pay $2.00'}
        </button>

        <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>

        {/* Security note */}
        <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-sec)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          <span style={{ fontSize: 11, color: 'var(--text-sec)' }}>256-bit SSL encrypted · Secure payment</span>
        </div>
      </div>
    </div>
  )
}
