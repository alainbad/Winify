import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useState, useEffect, useRef } from 'react'
import { Colors } from '@/constants/theme'

const QUESTION = 'Which planet is known as the Red Planet?'
const OPTIONS = [
  { key: 'A', label: 'Venus' },
  { key: 'B', label: 'Mars' },
  { key: 'C', label: 'Jupiter' },
  { key: 'D', label: 'Saturn' },
]
const CORRECT = 'B'
const TOTAL = 10

type Stage = 'answering' | 'correct' | 'wrong'

export default function SkillGateScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [timeLeft, setTimeLeft] = useState(TOTAL)
  const [stage, setStage] = useState<Stage>('answering')
  const [selected, setSelected] = useState<string | null>(null)
  const resultScale = useRef(new Animated.Value(0)).current

  // Countdown
  useEffect(() => {
    if (stage !== 'answering') return
    if (timeLeft <= 0) {
      setStage('wrong')
      return
    }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, stage])

  // Result pop
  useEffect(() => {
    if (stage === 'answering') return
    Animated.spring(resultScale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 6 }).start()
  }, [stage])

  function handleAnswer(key: string) {
    if (stage !== 'answering') return
    setSelected(key)
    setStage(key === CORRECT ? 'correct' : 'wrong')
  }

  function handleRetry() {
    setStage('answering')
    setSelected(null)
    setTimeLeft(TOTAL)
    resultScale.setValue(0)
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>SKILL GATE</Text>
      </View>
      <Text style={styles.heading}>Prove you're human</Text>
      <Text style={styles.sub}>Answer correctly to enter. No bots allowed.</Text>

      {/* Timer Ring */}
      {stage === 'answering' && (
        <View style={[styles.ringWrap, { borderColor: timeLeft <= 3 ? '#EF4444' : '#A78BFA' }]}>
          <Text style={[styles.ringText, { color: timeLeft <= 3 ? '#EF4444' : 'white' }]}>{timeLeft}</Text>
        </View>
      )}

      {/* Question */}
      {stage === 'answering' && (
        <View style={styles.questionCard}>
          <Text style={styles.question}>{QUESTION}</Text>
          <View style={{ gap: 10, marginTop: 16 }}>
            {OPTIONS.map(opt => (
              <TouchableOpacity key={opt.key} onPress={() => handleAnswer(opt.key)} style={styles.optionBtn}>
                <View style={styles.optionKey}><Text style={styles.optionKeyText}>{opt.key}</Text></View>
                <Text style={styles.optionLabel}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Result */}
      {stage !== 'answering' && (
        <Animated.View style={[styles.resultCard, { transform: [{ scale: resultScale }] }]}>
          {stage === 'correct' ? (
            <>
              <View style={styles.resultIconGreen}>
                <Text style={{ fontSize: 36 }}>✓</Text>
              </View>
              <Text style={styles.resultTitle}>Correct!</Text>
              <Text style={styles.resultDesc}>Mars is indeed the Red Planet. You're in!</Text>
              <TouchableOpacity style={styles.proceedBtn} onPress={() => router.push(`/competition/${id}/payment`)}>
                <Text style={styles.proceedBtnText}>Continue to Payment →</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.resultIconRed}>
                <Text style={{ fontSize: 36 }}>✗</Text>
              </View>
              <Text style={styles.resultTitle}>{timeLeft <= 0 ? 'Time\'s up!' : 'Wrong answer'}</Text>
              <Text style={styles.resultDesc}>The correct answer is B — Mars. Try again?</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={handleRetry}>
                <Text style={styles.retryBtnText}>Try Again</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A0A2E', alignItems: 'center', padding: 24, paddingTop: 60 },
  backBtn: { alignSelf: 'flex-start', marginBottom: 20 },
  backText: { fontSize: 15, fontWeight: '600', color: 'rgba(255,255,255,0.6)' },
  badge: { backgroundColor: 'rgba(109,40,217,0.3)', borderWidth: 1, borderColor: 'rgba(167,139,250,0.4)', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 5, marginBottom: 16 },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 2, color: '#A78BFA' },
  heading: { fontSize: 24, fontWeight: '800', color: 'white', marginBottom: 6, textAlign: 'center' },
  sub: { fontSize: 13, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: 24 },
  ringWrap: { width: 72, height: 72, borderRadius: 36, borderWidth: 4, alignItems: 'center', justifyContent: 'center', marginBottom: 24, backgroundColor: 'rgba(255,255,255,0.05)' },
  ringText: { fontSize: 22, fontWeight: '800' },
  questionCard: { width: '100%', backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 18, padding: 20 },
  question: { fontSize: 17, fontWeight: '700', color: 'white', textAlign: 'center', lineHeight: 24 },
  optionBtn: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: 14 },
  optionKey: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(167,139,250,0.2)', alignItems: 'center', justifyContent: 'center' },
  optionKeyText: { fontSize: 13, fontWeight: '800', color: '#A78BFA' },
  optionLabel: { fontSize: 15, fontWeight: '600', color: 'white' },
  resultCard: { width: '100%', backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 18, padding: 28, alignItems: 'center', marginTop: 20 },
  resultIconGreen: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(5,150,105,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  resultIconRed: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(239,68,68,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  resultTitle: { fontSize: 22, fontWeight: '800', color: 'white', marginBottom: 6 },
  resultDesc: { fontSize: 13, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 20 },
  proceedBtn: { backgroundColor: Colors.primary, borderRadius: 999, paddingHorizontal: 28, paddingVertical: 14 },
  proceedBtnText: { fontSize: 15, fontWeight: '700', color: 'white' },
  retryBtn: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 999, paddingHorizontal: 28, paddingVertical: 14 },
  retryBtnText: { fontSize: 15, fontWeight: '700', color: 'white' },
})
