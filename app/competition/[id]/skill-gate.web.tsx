import React, { useState, useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Animated, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { Colors } from '@/constants/theme'
import { rpc } from '@/lib/auth'

const TOTAL = 10

type Option = { key: string; label: string }
type Question = { id: number; question: string; options: Option[]; correct: string }
type Stage = 'loading' | 'answering' | 'correct' | 'wrong'

// Fallback question if Supabase is unreachable
const FALLBACK: Question = {
  id: 0,
  question: 'Which planet is known as the Red Planet?',
  options: [{ key: 'A', label: 'Venus' }, { key: 'B', label: 'Mars' }, { key: 'C', label: 'Jupiter' }, { key: 'D', label: 'Saturn' }],
  correct: 'B',
}

export default function SkillGateWeb() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [question, setQuestion] = useState<Question | null>(null)
  const [timeLeft, setTimeLeft] = useState(TOTAL)
  const [stage, setStage] = useState<Stage>('loading')
  const [selected, setSelected] = useState<string | null>(null)
  const [hover, setHover] = useState<string | null>(null)
  const resultScale = useRef(new Animated.Value(0)).current

  useEffect(() => {
    rpc('get_random_question').then((data: any) => {
      setQuestion(data && data.question ? data as Question : FALLBACK)
      setStage('answering')
    }).catch(() => { setQuestion(FALLBACK); setStage('answering') })
  }, [])

  useEffect(() => {
    if (stage !== 'answering') return
    if (timeLeft <= 0) { setStage('wrong'); return }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, stage])

  useEffect(() => {
    if (stage === 'answering' || stage === 'loading') return
    Animated.spring(resultScale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 6 }).start()
  }, [stage])

  function handleAnswer(key: string) {
    if (stage !== 'answering' || !question) return
    setSelected(key)
    setStage(key === question.correct ? 'correct' : 'wrong')
  }

  function handleRetry() {
    resultScale.setValue(0)
    setSelected(null)
    setTimeLeft(TOTAL)
    // Fetch a fresh random question on retry
    setStage('loading')
    rpc('get_random_question').then((data: any) => {
      setQuestion(data && data.question ? data as Question : FALLBACK)
      setStage('answering')
    }).catch(() => { setQuestion(FALLBACK); setStage('answering') })
  }

  const urgent = timeLeft <= 3

  return (
    <View style={s.page}>
      <View style={s.topNav}>
        <View style={s.topNavInner}>
          <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace(`/competition/${id}`)}>
            <Text style={s.backLink}>← Back</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ color: '#A78BFA', fontSize: 14 }}>●</Text>
            <Text style={s.brandName}>Tick Pick</Text>
          </View>
        </View>
      </View>

      <View style={s.container}>
        <View style={s.card}>
          <View style={s.cardHead}>
            <View style={s.badge}><Text style={s.badgeText}>SKILL GATE</Text></View>
            <Text style={s.heading}>Prove you're human</Text>
            <Text style={s.sub}>Answer correctly to enter. No bots allowed.</Text>
          </View>

          {stage === 'loading' && (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <ActivityIndicator color="#A78BFA" size="large" />
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 14 }}>Loading question…</Text>
            </View>
          )}

          {stage === 'answering' && question && (
            <>
              <View style={s.timerRow}>
                <View style={[s.ringWrap, { borderColor: urgent ? '#EF4444' : '#A78BFA' }]}>
                  <Text style={[s.ringText, { color: urgent ? '#EF4444' : '#FFFFFF' }]}>{timeLeft}</Text>
                </View>
                <Text style={s.timerLabel}>seconds left</Text>
              </View>

              <Text style={s.question}>{question.question}</Text>

              <View style={s.options}>
                {question.options.map(opt => {
                  const isHover = hover === opt.key
                  return (
                    <TouchableOpacity
                      key={opt.key}
                      onPress={() => handleAnswer(opt.key)}
                      onPressIn={() => setHover(opt.key)}
                      onPressOut={() => setHover(null)}
                      // @ts-ignore web only
                      onMouseEnter={() => setHover(opt.key)}
                      onMouseLeave={() => setHover(null)}
                      style={[s.optionBtn, isHover && s.optionBtnHover]}
                    >
                      <View style={[s.optionKey, isHover && s.optionKeyHover]}>
                        <Text style={[s.optionKeyText, isHover && { color: '#FFFFFF' }]}>{opt.key}</Text>
                      </View>
                      <Text style={s.optionLabel}>{opt.label}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </>
          )}

          {(stage === 'correct' || stage === 'wrong') && (
            <Animated.View style={[s.result, { transform: [{ scale: resultScale }] }]}>
              {stage === 'correct' ? (
                <>
                  <View style={s.iconGreen}><Text style={{ fontSize: 32, color: '#10B981' }}>✓</Text></View>
                  <Text style={s.resultTitle}>Correct!</Text>
                  <Text style={s.resultDesc}>Well done — you're in!</Text>
                  <TouchableOpacity style={s.proceedBtn} onPress={() => router.push(`/competition/${id}/payment`)}>
                    <Text style={s.proceedBtnText}>Continue to Payment →</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View style={s.iconRed}><Text style={{ fontSize: 32, color: '#EF4444' }}>✗</Text></View>
                  <Text style={s.resultTitle}>{timeLeft <= 0 ? "Time's up!" : 'Wrong answer'}</Text>
                  <Text style={s.resultDesc}>
                    {timeLeft <= 0 ? "You ran out of time." : `The correct answer was ${question?.correct} — ${question?.options.find(o => o.key === question.correct)?.label}.`}
                  </Text>
                  <TouchableOpacity style={s.retryBtn} onPress={handleRetry}>
                    <Text style={s.retryBtnText}>Try Again</Text>
                  </TouchableOpacity>
                </>
              )}
            </Animated.View>
          )}
        </View>

        <Text style={s.footer}>🔒 Anti-bot verification · Powered by Tick Pick</Text>
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#0F0820' },
  topNav: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  topNavInner: { maxWidth: 1200, width: '100%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 14 },
  backLink: { fontSize: 13, fontWeight: '600', color: '#A78BFA' },
  brandName: { fontSize: 14, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.3 },
  container: { maxWidth: 560, width: '100%', alignSelf: 'center', paddingHorizontal: 24, paddingTop: 48, paddingBottom: 40 },
  card: { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 32 },
  cardHead: { alignItems: 'center', marginBottom: 24 },
  badge: { backgroundColor: 'rgba(167,139,250,0.15)', borderWidth: 1, borderColor: 'rgba(167,139,250,0.3)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 14 },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 1.8, color: '#A78BFA' },
  heading: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 6, letterSpacing: -0.4 },
  sub: { fontSize: 13, color: 'rgba(255,255,255,0.5)', textAlign: 'center' },
  timerRow: { alignItems: 'center', marginBottom: 24 },
  ringWrap: { width: 60, height: 60, borderRadius: 30, borderWidth: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.03)' },
  ringText: { fontSize: 20, fontWeight: '800' },
  timerLabel: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 8, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: '600' },
  question: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  options: { gap: 10 },
  optionBtn: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 14, cursor: 'pointer' as any },
  optionBtnHover: { backgroundColor: 'rgba(167,139,250,0.12)', borderColor: 'rgba(167,139,250,0.5)' },
  optionKey: { width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(167,139,250,0.18)', alignItems: 'center', justifyContent: 'center' },
  optionKeyHover: { backgroundColor: '#A78BFA' },
  optionKeyText: { fontSize: 12, fontWeight: '800', color: '#A78BFA' },
  optionLabel: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  result: { alignItems: 'center', paddingVertical: 12 },
  iconGreen: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(16,185,129,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  iconRed: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(239,68,68,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  resultTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF', marginBottom: 6 },
  resultDesc: { fontSize: 13, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 22, lineHeight: 20 },
  proceedBtn: { backgroundColor: '#A78BFA', borderRadius: 10, paddingHorizontal: 24, paddingVertical: 13 },
  proceedBtnText: { fontSize: 14, fontWeight: '800', color: '#0F0820' },
  retryBtn: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 10, paddingHorizontal: 24, paddingVertical: 13 },
  retryBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  footer: { fontSize: 11, color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 20 },
})
