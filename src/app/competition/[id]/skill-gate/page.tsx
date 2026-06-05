'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

type State = 'answering' | 'correct' | 'wrong' | 'timeout'

const OPTIONS = [
  { key: 'A', label: 'Venus' },
  { key: 'B', label: 'Mars' },
  { key: 'C', label: 'Jupiter' },
  { key: 'D', label: 'Saturn' },
]
const CORRECT = 'B'
const CIRCUMFERENCE = 163

export default function SkillGatePage() {
  const params = useParams()
  const id = params.id
  const [state, setState] = useState<State>('answering')
  const [timeLeft, setTimeLeft] = useState(10)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    if (state !== 'answering') return
    if (timeLeft <= 0) { setState('timeout'); return }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, state])

  const handleSelect = (key: string) => {
    if (state !== 'answering') return
    setSelected(key)
    setState(key === CORRECT ? 'correct' : 'wrong')
  }

  const ringColor = timeLeft > 6 ? '#059669' : timeLeft > 3 ? '#F59E0B' : '#EF4444'
  const offset = CIRCUMFERENCE - (CIRCUMFERENCE * timeLeft) / 10

  return (
    <div style={{ minHeight: '100vh', background: '#1A0A2E', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Link href={`/competition/${id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: 18, fontWeight: 700 }}>
          ←
        </Link>
        <span style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>Skill Question</span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 20px 24px' }}>
        {/* Timer ring */}
        <div style={{ position: 'relative', marginBottom: 32 }}>
          <svg width="80" height="80" viewBox="0 0 60 60" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
            <circle
              cx="30" cy="30" r="26" fill="none"
              stroke={state === 'correct' ? '#059669' : state === 'wrong' || state === 'timeout' ? '#EF4444' : ringColor}
              strokeWidth="4" strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={state === 'answering' ? offset : state === 'correct' ? 0 : CIRCUMFERENCE}
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {state === 'correct' && <span style={{ fontSize: 24 }}>✓</span>}
            {(state === 'wrong' || state === 'timeout') && <span style={{ fontSize: 24 }}>✗</span>}
            {state === 'answering' && <span style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>{timeLeft}</span>}
          </div>
        </div>

        {/* Question */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', marginBottom: 10 }}>SKILL QUESTION</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'white', lineHeight: 1.4 }}>
            Which planet is known as the Red Planet?
          </div>
        </div>

        {/* Options */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {OPTIONS.map(opt => {
            let bg = 'rgba(255,255,255,0.07)'
            let border = '1px solid rgba(255,255,255,0.12)'
            let color = 'white'
            if (selected === opt.key && state === 'correct') { bg = 'rgba(5,150,105,0.2)'; border = '1px solid #059669' }
            if (selected === opt.key && state === 'wrong') { bg = 'rgba(239,68,68,0.2)'; border = '1px solid #EF4444' }
            if (state !== 'answering' && opt.key === CORRECT) { bg = 'rgba(5,150,105,0.2)'; border = '1px solid #059669' }
            return (
              <button key={opt.key} onClick={() => handleSelect(opt.key)}
                disabled={state !== 'answering'}
                style={{
                  background: bg, border, borderRadius: 12,
                  padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
                  cursor: state === 'answering' ? 'pointer' : 'default',
                  width: '100%', textAlign: 'left'
                }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color, flexShrink: 0 }}>
                  {opt.key}
                </span>
                <span style={{ fontSize: 14, fontWeight: 600, color }}>{opt.label}</span>
              </button>
            )
          })}
        </div>

        {/* Status message */}
        {state === 'correct' && (
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#4ADE80', marginBottom: 8 }}>Correct! Proceeding to payment...</div>
            <Link href={`/competition/${id}/payment`} style={{ textDecoration: 'none', display: 'inline-block', background: 'linear-gradient(135deg, #059669, #34D399)', color: 'white', fontWeight: 700, fontSize: 14, padding: '12px 28px', borderRadius: 9999 }}>
              Continue to Payment →
            </Link>
          </div>
        )}

        {state === 'wrong' && (
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#EF4444', marginBottom: 4 }}>Incorrect — fee still processed.</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>You may still enter, but the skill answer was wrong.</div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button onClick={() => { setState('answering'); setTimeLeft(10); setSelected(null) }}
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontWeight: 600, fontSize: 13, padding: '10px 20px', borderRadius: 9999, cursor: 'pointer' }}>
                Try Again
              </button>
              <Link href={`/competition/${id}/payment`} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', background: 'rgba(239,68,68,0.2)', border: '1px solid #EF4444', color: '#FCA5A5', fontWeight: 600, fontSize: 13, padding: '10px 20px', borderRadius: 9999 }}>
                Continue Anyway
              </Link>
            </div>
          </div>
        )}

        {state === 'timeout' && (
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#EF4444', marginBottom: 8 }}>Time&apos;s up!</div>
            <button onClick={() => { setState('answering'); setTimeLeft(10); setSelected(null) }}
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontWeight: 600, fontSize: 14, padding: '12px 28px', borderRadius: 9999, cursor: 'pointer' }}>
              Try Again
            </button>
          </div>
        )}

        {/* Legal text */}
        <div style={{ textAlign: 'center', padding: '0 8px' }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5, margin: 0 }}>
            Winify is a skill competition, not a lottery. Fee is processed regardless of answer.
            Must be 18+ to enter. See full Terms & Conditions.
          </p>
        </div>
      </div>
    </div>
  )
}
