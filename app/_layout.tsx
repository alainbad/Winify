import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="competition/[id]/index" options={{ headerShown: false }} />
        <Stack.Screen name="competition/[id]/skill-gate" options={{ headerShown: false }} />
        <Stack.Screen name="competition/[id]/payment" options={{ headerShown: false }} />
        <Stack.Screen name="competition/[id]/success" options={{ headerShown: false }} />
        <Stack.Screen name="winner-reveal" options={{ headerShown: false }} />
      </Stack>
    </>
  )
}
