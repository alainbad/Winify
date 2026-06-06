import { Tabs } from 'expo-router'
import { Colors } from '@/constants/theme'
import React from 'react'
import { useWindowDimensions } from 'react-native'

function Icon({ d, focused, size = 24 }: { d: string | string[]; focused: boolean; size?: number }) {
  const color = focused ? Colors.primary : Colors.muted
  const paths = Array.isArray(d) ? d : [d]
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' } as any}>
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  )
}

const ICONS = {
  home: ['M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z', 'M9 21V12h6v9'],
  browse: ['M11 19a8 8 0 100-16 8 8 0 000 16z', 'M21 21l-4.35-4.35'],
  entries: ['M2 9a2 2 0 012-2h16a2 2 0 012 2v1a2 2 0 000 4v1a2 2 0 01-2 2H4a2 2 0 01-2-2v-1a2 2 0 000-4V9z', 'M9 12h6', 'M12 9v6'],
  account: ['M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2', 'M12 11a4 4 0 100-8 4 4 0 000 8z'],
}

export default function TabsLayout() {
  const { width } = useWindowDimensions()
  const isDesktop = width >= 768

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: isDesktop
          ? { display: 'none' }
          : { height: 66, backgroundColor: Colors.card, borderTopColor: Colors.border, borderTopWidth: 1 },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.muted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginBottom: 8 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ focused }) => <Icon d={ICONS.home} focused={focused} /> }} />
      <Tabs.Screen name="browse" options={{ title: 'Browse', tabBarIcon: ({ focused }) => <Icon d={ICONS.browse} focused={focused} /> }} />
      <Tabs.Screen name="entries" options={{ title: 'My Entries', tabBarIcon: ({ focused }) => <Icon d={ICONS.entries} focused={focused} /> }} />
      <Tabs.Screen name="account" options={{ title: 'Account', tabBarIcon: ({ focused }) => <Icon d={ICONS.account} focused={focused} /> }} />
    </Tabs>
  )
}
