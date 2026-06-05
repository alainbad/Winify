import { Tabs } from 'expo-router'
import { Colors } from '@/constants/theme'
import Svg, { Path, Rect, Circle, Polyline } from 'react-native-svg'

function HomeIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <Polyline points="9 22 9 12 15 12 15 22" />
    </Svg>
  )
}
function BrowseIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={3} y={3} width={7} height={7} />
      <Rect x={14} y={3} width={7} height={7} />
      <Rect x={14} y={14} width={7} height={7} />
      <Rect x={3} y={14} width={7} height={7} />
    </Svg>
  )
}
function EntriesIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M2 9a3 3 0 010-6h20a3 3 0 010 6" />
      <Path d="M2 9v11a2 2 0 002 2h16a2 2 0 002-2V9" />
      <Path d="M12 3v18" />
    </Svg>
  )
}
function AccountIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <Circle cx={12} cy={7} r={4} />
    </Svg>
  )
}

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { height: 66, backgroundColor: Colors.card, borderTopColor: Colors.border, borderTopWidth: 1 },
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.muted,
      tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginBottom: 8 },
    }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <HomeIcon color={color} /> }} />
      <Tabs.Screen name="browse" options={{ title: 'Browse', tabBarIcon: ({ color }) => <BrowseIcon color={color} /> }} />
      <Tabs.Screen name="entries" options={{ title: 'My Entries', tabBarIcon: ({ color }) => <EntriesIcon color={color} /> }} />
      <Tabs.Screen name="account" options={{ title: 'Account', tabBarIcon: ({ color }) => <AccountIcon color={color} /> }} />
    </Tabs>
  )
}
