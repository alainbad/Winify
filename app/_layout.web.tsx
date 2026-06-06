import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            flex: 0 as any,
            minHeight: '100vh' as any,
            overflow: 'visible' as any,
          },
        }}
      />
    </>
  )
}
