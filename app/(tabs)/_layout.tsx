import { Tabs } from 'expo-router'
import { Text } from 'react-native'
import { Colors } from '@/constants/theme'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 66,
          backgroundColor: Colors.card,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.muted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginBottom: 8 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: () => <Text style={{ fontSize: 22 }}>🏠</Text> }} />
      <Tabs.Screen name="browse" options={{ title: 'Browse', tabBarIcon: () => <Text style={{ fontSize: 22 }}>🔍</Text> }} />
      <Tabs.Screen name="entries" options={{ title: 'My Entries', tabBarIcon: () => <Text style={{ fontSize: 22 }}>🎟️</Text> }} />
      <Tabs.Screen name="account" options={{ title: 'Account', tabBarIcon: () => <Text style={{ fontSize: 22 }}>👤</Text> }} />
    </Tabs>
  )
}
