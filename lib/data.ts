export type Pool = {
  id: number
  prize: string
  brand: string
  logo: string
  bgColor: string
  emoji: string
  tier: 'MICRO' | 'VOLUME' | 'MEGA'
  entries: number
  total: number
  pct: number
  time: string
  price: number
  accent: string
  accentBg: string
  hot: boolean
  featured: boolean
  desc: string
  gumroadUrl?: string
}

const cb = (domain: string) => `https://logo.clearbit.com/${domain}`

export const POOLS: Pool[] = [
  // ── MEGA ────────────────────────────────────────────────────
  { id: 1, prize: '$500 Amazon Voucher', brand: 'Amazon', logo: cb('amazon.com'), bgColor: '#232F3E', emoji: '🛍️',
    tier: 'MEGA', entries: 47, total: 150, pct: 31, time: '38d 0h', price: 5,
    accent: '#FF9900', accentBg: '#FFF7ED', hot: false, featured: true,
    desc: 'One lucky winner takes home a $500 Amazon voucher.' },

  // ── MICRO ($50) ─────────────────────────────────────────────
  { id: 2, prize: '$50 Xbox Gift Card', brand: 'Xbox', logo: cb('xbox.com'), bgColor: '#107C10', emoji: '🎮',
    tier: 'MICRO', entries: 8, total: 15, pct: 53, time: '3d 14h', price: 5,
    accent: '#107C10', accentBg: '#ECFDF5', hot: true, featured: false,
    desc: 'Game credits for Xbox — spend on games, DLC, or Game Pass.' },
  { id: 3, prize: '$50 Netflix Gift Card', brand: 'Netflix', logo: cb('netflix.com'), bgColor: '#141414', emoji: '🎬',
    tier: 'MICRO', entries: 5, total: 15, pct: 33, time: '5d 8h', price: 5,
    accent: '#E50914', accentBg: '#FFF1F2', hot: false, featured: false,
    desc: 'Three months of premium Netflix on us.' },
  { id: 4, prize: '$50 Steam Wallet', brand: 'Steam', logo: cb('steampowered.com'), bgColor: '#1B2838', emoji: '🎮',
    tier: 'MICRO', entries: 6, total: 15, pct: 40, time: '4d 12h', price: 5,
    accent: '#1B2838', accentBg: '#F1F5F9', hot: false, featured: false,
    desc: 'Add $50 to your Steam wallet — any game, any time.' },

  // ── MICRO ($75) ─────────────────────────────────────────────
  { id: 5, prize: '$75 Spotify Premium', brand: 'Spotify', logo: cb('spotify.com'), bgColor: '#191414', emoji: '🎵',
    tier: 'MICRO', entries: 8, total: 20, pct: 40, time: '2d 6h', price: 5,
    accent: '#1DB954', accentBg: '#ECFDF5', hot: true, featured: false,
    desc: 'Six months of ad-free music streaming.' },
  { id: 6, prize: '$75 Roblox Robux', brand: 'Roblox', logo: cb('roblox.com'), bgColor: '#FFFFFF', emoji: '🟥',
    tier: 'MICRO', entries: 5, total: 20, pct: 25, time: '6d 0h', price: 5,
    accent: '#E2231A', accentBg: '#FFF1F2', hot: false, featured: false,
    desc: '6,500 Robux dropped straight into your account.' },
  { id: 7, prize: '$75 Google Play Credit', brand: 'Google Play', logo: cb('play.google.com'), bgColor: '#FFFFFF', emoji: '▶️',
    tier: 'MICRO', entries: 3, total: 20, pct: 15, time: '6d 18h', price: 5,
    accent: '#4285F4', accentBg: '#EFF6FF', hot: false, featured: false,
    desc: 'Apps, movies, or in-app purchases on Google Play.' },

  // ── MICRO ($100) ────────────────────────────────────────────
  { id: 8, prize: '$100 Apple Gift Card', brand: 'Apple', logo: cb('apple.com'), bgColor: '#1A1A1A', emoji: '🍎',
    tier: 'MICRO', entries: 8, total: 25, pct: 32, time: '3d 0h', price: 5,
    accent: '#1A1A1A', accentBg: '#F5F5F5', hot: true, featured: false,
    desc: 'Spend on App Store, iTunes, or Apple subscriptions.' },
  { id: 9, prize: '$100 Uber Eats Voucher', brand: 'Uber Eats', logo: cb('ubereats.com'), bgColor: '#000000', emoji: '🍔',
    tier: 'MICRO', entries: 3, total: 25, pct: 12, time: '7d 0h', price: 5,
    accent: '#06C167', accentBg: '#ECFDF5', hot: false, featured: false,
    desc: 'Free dinners, delivered.' },
  { id: 10, prize: '$100 Starbucks Card', brand: 'Starbucks', logo: cb('starbucks.com'), bgColor: '#FFFFFF', emoji: '☕',
    tier: 'MICRO', entries: 5, total: 25, pct: 20, time: '5d 18h', price: 5,
    accent: '#006241', accentBg: '#ECFDF5', hot: false, featured: false,
    desc: 'Coffee runs on us all week.' },
  { id: 11, prize: '$100 Amazon Gift Card', brand: 'Amazon', logo: cb('amazon.com'), bgColor: '#232F3E', emoji: '📦',
    tier: 'MICRO', entries: 9, total: 25, pct: 36, time: '1d 4h', price: 5,
    accent: '#FF9900', accentBg: '#FFF7ED', hot: true, featured: false,
    desc: 'Quick win — $100 to spend on Amazon.' },

  // ── VOLUME ($150) ───────────────────────────────────────────
  { id: 12, prize: '$150 Amazon Gift Card', brand: 'Amazon', logo: cb('amazon.com'), bgColor: '#232F3E', emoji: '📦',
    tier: 'VOLUME', entries: 18, total: 45, pct: 40, time: '14d 6h', price: 5,
    accent: '#FF9900', accentBg: '#FFF7ED', hot: false, featured: false,
    desc: '$150 to spend on anything at Amazon.' },
  { id: 13, prize: '$150 PlayStation Store', brand: 'PlayStation', logo: cb('playstation.com'), bgColor: '#003791', emoji: '🎯',
    tier: 'VOLUME', entries: 24, total: 45, pct: 53, time: '8d 12h', price: 5,
    accent: '#003791', accentBg: '#EFF6FF', hot: true, featured: false,
    desc: 'Top up your PSN wallet with $150.' },
  { id: 14, prize: '$150 Steam Wallet', brand: 'Steam', logo: cb('steampowered.com'), bgColor: '#1B2838', emoji: '🎮',
    tier: 'VOLUME', entries: 17, total: 45, pct: 38, time: '17d 0h', price: 5,
    accent: '#1B2838', accentBg: '#F1F5F9', hot: false, featured: false,
    desc: '$150 to spend in the Steam store.' },

  // ── VOLUME ($200) ───────────────────────────────────────────
  { id: 15, prize: '$200 Xbox Live Card', brand: 'Xbox', logo: cb('xbox.com'), bgColor: '#107C10', emoji: '🎮',
    tier: 'VOLUME', entries: 14, total: 60, pct: 23, time: '19d 8h', price: 5,
    accent: '#107C10', accentBg: '#ECFDF5', hot: false, featured: false,
    desc: '$200 for the Xbox store — games, DLC, or Game Pass.' },
  { id: 16, prize: '$200 Microsoft Store', brand: 'Microsoft', logo: cb('microsoft.com'), bgColor: '#FFFFFF', emoji: '🪟',
    tier: 'VOLUME', entries: 11, total: 60, pct: 18, time: '21d 0h', price: 5,
    accent: '#0078D4', accentBg: '#EFF6FF', hot: false, featured: false,
    desc: 'Spend on apps, games, Office, or Surface accessories.' },
  { id: 17, prize: '$200 Booking.com Credit', brand: 'Booking.com', logo: cb('booking.com'), bgColor: '#003580', emoji: '🏨',
    tier: 'VOLUME', entries: 19, total: 60, pct: 32, time: '16d 0h', price: 5,
    accent: '#003580', accentBg: '#EFF6FF', hot: false, featured: false,
    desc: '$200 off your next hotel stay anywhere.' },

  // ── VOLUME ($300) ───────────────────────────────────────────
  { id: 18, prize: '$300 Airbnb Credit', brand: 'Airbnb', logo: cb('airbnb.com'), bgColor: '#FFFFFF', emoji: '🏠',
    tier: 'VOLUME', entries: 16, total: 90, pct: 18, time: '18d 6h', price: 5,
    accent: '#FF5A5F', accentBg: '#FFF1F2', hot: false, featured: false,
    desc: '$300 credit toward any Airbnb stay.' },
  { id: 19, prize: '$300 Apple Gift Card', brand: 'Apple', logo: cb('apple.com'), bgColor: '#1A1A1A', emoji: '🍎',
    tier: 'VOLUME', entries: 26, total: 90, pct: 29, time: '7d 18h', price: 5,
    accent: '#1A1A1A', accentBg: '#F5F5F5', hot: true, featured: false,
    desc: 'App Store, iTunes, iCloud, Apple One — your call.' },
  { id: 20, prize: '$300 Nintendo eShop', brand: 'Nintendo', logo: cb('nintendo.com'), bgColor: '#E60012', emoji: '🎮',
    tier: 'VOLUME', entries: 13, total: 90, pct: 14, time: '20d 12h', price: 5,
    accent: '#E60012', accentBg: '#FFF1F2', hot: false, featured: false,
    desc: '$300 for Nintendo Switch games & DLC.' },
  { id: 21, prize: '$300 Disney+ Credit', brand: 'Disney+', logo: cb('disneyplus.com'), bgColor: '#0F1F5C', emoji: '🏰',
    tier: 'VOLUME', entries: 10, total: 90, pct: 11, time: '21d 0h', price: 5,
    accent: '#113CCF', accentBg: '#EFF6FF', hot: false, featured: false,
    desc: 'Three full years of Disney+ streaming.' },

  // ── MEGA ($500) ─────────────────────────────────────────────
  { id: 22, prize: '$500 Apple Store', brand: 'Apple', logo: cb('apple.com'), bgColor: '#1A1A1A', emoji: '🍎',
    tier: 'MEGA', entries: 99, total: 150, pct: 66, time: '28d 6h', price: 5,
    accent: '#1A1A1A', accentBg: '#F5F5F5', hot: false, featured: false,
    desc: '$500 at the Apple Store — AirPods, accessories, anything.' },
  { id: 23, prize: '$500 PlayStation Store', brand: 'PlayStation', logo: cb('playstation.com'), bgColor: '#003791', emoji: '🎮',
    tier: 'MEGA', entries: 84, total: 150, pct: 56, time: '30d 2h', price: 5,
    accent: '#003791', accentBg: '#EFF6FF', hot: true, featured: false,
    desc: 'Massive PSN top-up — games, DLC, PS Plus for a year.' },

  // ── MEGA ($750) ─────────────────────────────────────────────
  { id: 24, prize: '$750 Booking.com Voucher', brand: 'Booking.com', logo: cb('booking.com'), bgColor: '#003580', emoji: '🏨',
    tier: 'MEGA', entries: 57, total: 200, pct: 29, time: '33d 8h', price: 5,
    accent: '#003580', accentBg: '#EFF6FF', hot: false, featured: false,
    desc: 'Your next trip on us — $750 off any Booking.com stay.' },
  { id: 25, prize: '$750 Microsoft Store', brand: 'Microsoft', logo: cb('microsoft.com'), bgColor: '#FFFFFF', emoji: '🪟',
    tier: 'MEGA', entries: 39, total: 200, pct: 20, time: '37d 0h', price: 5,
    accent: '#0078D4', accentBg: '#EFF6FF', hot: false, featured: false,
    desc: '$750 on Microsoft Store — Surface, Xbox, Office, anything.' },

  // ── MEGA ($1000) ────────────────────────────────────────────
  { id: 26, prize: '$1,000 Expedia Voucher', brand: 'Expedia', logo: cb('expedia.com'), bgColor: '#00355F', emoji: '✈️',
    tier: 'MEGA', entries: 63, total: 300, pct: 21, time: '44d 12h', price: 5,
    accent: '#FFC72C', accentBg: '#FFFBEB', hot: false, featured: false,
    desc: '$1,000 to spend on Expedia flights & hotels.' },
  { id: 27, prize: '$1,000 Steam Wallet', brand: 'Steam', logo: cb('steampowered.com'), bgColor: '#1B2838', emoji: '🎮',
    tier: 'MEGA', entries: 123, total: 300, pct: 41, time: '40d 6h', price: 5,
    accent: '#1B2838', accentBg: '#F1F5F9', hot: false, featured: false,
    desc: '$1,000 for the Steam store — build your dream library.' },
  { id: 28, prize: '$1,000 Xbox Series X Bundle', brand: 'Xbox', logo: cb('xbox.com'), bgColor: '#107C10', emoji: '🎮',
    tier: 'MEGA', entries: 138, total: 300, pct: 46, time: '42d 0h', price: 5,
    accent: '#107C10', accentBg: '#ECFDF5', hot: true, featured: false,
    desc: 'Xbox Series X console + Game Pass Ultimate for a year.' },
]

// ─────────────────────────────────────────────────────────────
// GUMROAD INTEGRATION
// ─────────────────────────────────────────────────────────────
export const DEFAULT_GUMROAD_URL = 'https://badranalain.gumroad.com/l/spjrva'

export const GUMROAD_URLS: Record<number, string> = {
  // 1: 'https://badranalain.gumroad.com/l/xxxxx',
}

export function getGumroadUrl(poolId: number): string {
  return GUMROAD_URLS[poolId] ?? DEFAULT_GUMROAD_URL
}

export const RECENT_WINNERS = [
  { name: 'j***n', prize: '$100 Amazon Gift Card', timeAgo: '2 min ago' },
  { name: 'm***e', prize: '$50 Xbox Gift Card', timeAgo: '8 min ago' },
  { name: 's***h', prize: '$500 Amazon Voucher', timeAgo: '23 min ago' },
  { name: 'r***a', prize: '$150 PlayStation Store', timeAgo: '1h ago' },
  { name: 'k***l', prize: '$75 Netflix Gift Card', timeAgo: '1h 30m ago' },
  { name: 'a***x', prize: '$300 Airbnb Credit', timeAgo: '2h ago' },
  { name: 't***y', prize: '$75 Spotify Premium', timeAgo: '3h ago' },
]
