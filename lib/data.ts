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
  { id: 1, prize: '$500 Amazon Voucher', brand: 'Amazon', logo: cb('amazon.com'), bgColor: '#232F3E', emoji: '🛍️',
    tier: 'MEGA', entries: 234, total: 750, pct: 31, time: '38d 0h', price: 2,
    accent: '#FF9900', accentBg: '#FFF7ED', hot: false, featured: true,
    desc: 'One lucky winner takes home a $500 Amazon voucher.' },

  { id: 2, prize: '$10 Xbox Gift Card', brand: 'Xbox', logo: cb('xbox.com'), bgColor: '#107C10', emoji: '🎮',
    tier: 'MICRO', entries: 20, total: 22, pct: 91, time: '3d 14h', price: 2,
    accent: '#107C10', accentBg: '#ECFDF5', hot: true, featured: false,
    desc: 'Game credits for Xbox instantly.' },
  { id: 3, prize: '$15 Netflix Gift Card', brand: 'Netflix', logo: cb('netflix.com'), bgColor: '#141414', emoji: '🎬',
    tier: 'MICRO', entries: 8, total: 15, pct: 53, time: '5d 8h', price: 2,
    accent: '#E50914', accentBg: '#FFF1F2', hot: false, featured: false,
    desc: 'A month of premium Netflix on us.' },
  { id: 4, prize: '$10 Steam Wallet', brand: 'Steam', logo: cb('steampowered.com'), bgColor: '#1B2838', emoji: '🎮',
    tier: 'MICRO', entries: 14, total: 22, pct: 64, time: '4d 12h', price: 2,
    accent: '#1B2838', accentBg: '#F1F5F9', hot: false, featured: false,
    desc: 'Add $10 to your Steam wallet — any game, any time.' },
  { id: 5, prize: '$10 Spotify Premium', brand: 'Spotify', logo: cb('spotify.com'), bgColor: '#191414', emoji: '🎵',
    tier: 'MICRO', entries: 19, total: 22, pct: 86, time: '2d 6h', price: 2,
    accent: '#1DB954', accentBg: '#ECFDF5', hot: true, featured: false,
    desc: 'A month of ad-free music streaming.' },
  { id: 6, prize: '$15 Roblox Robux', brand: 'Roblox', logo: cb('roblox.com'), bgColor: '#FFFFFF', emoji: '🟥',
    tier: 'MICRO', entries: 11, total: 22, pct: 50, time: '6d 0h', price: 2,
    accent: '#E2231A', accentBg: '#FFF1F2', hot: false, featured: false,
    desc: '1,200 Robux dropped straight into your account.' },
  { id: 7, prize: '$10 Google Play Credit', brand: 'Google Play', logo: cb('play.google.com'), bgColor: '#FFFFFF', emoji: '▶️',
    tier: 'MICRO', entries: 7, total: 22, pct: 32, time: '6d 18h', price: 2,
    accent: '#4285F4', accentBg: '#EFF6FF', hot: false, featured: false,
    desc: 'Apps, movies, or in-app purchases on Google Play.' },
  { id: 8, prize: '$15 Apple Gift Card', brand: 'Apple', logo: cb('apple.com'), bgColor: '#1A1A1A', emoji: '🍎',
    tier: 'MICRO', entries: 17, total: 22, pct: 77, time: '3d 0h', price: 2,
    accent: '#1A1A1A', accentBg: '#F5F5F5', hot: true, featured: false,
    desc: 'Spend on App Store, iTunes, or Apple subscriptions.' },
  { id: 9, prize: '$10 Uber Eats Voucher', brand: 'Uber Eats', logo: cb('ubereats.com'), bgColor: '#000000', emoji: '🍔',
    tier: 'MICRO', entries: 6, total: 22, pct: 27, time: '7d 0h', price: 2,
    accent: '#06C167', accentBg: '#ECFDF5', hot: false, featured: false,
    desc: 'Free dinner on Winify.' },
  { id: 10, prize: '$15 Starbucks Card', brand: 'Starbucks', logo: cb('starbucks.com'), bgColor: '#FFFFFF', emoji: '☕',
    tier: 'MICRO', entries: 12, total: 22, pct: 55, time: '5d 18h', price: 2,
    accent: '#006241', accentBg: '#ECFDF5', hot: false, featured: false,
    desc: 'Coffee runs on us for a week.' },
  { id: 11, prize: '$10 Amazon Gift Card', brand: 'Amazon', logo: cb('amazon.com'), bgColor: '#232F3E', emoji: '📦',
    tier: 'MICRO', entries: 21, total: 22, pct: 95, time: '1d 4h', price: 2,
    accent: '#FF9900', accentBg: '#FFF7ED', hot: true, featured: false,
    desc: 'Quick win — $10 to spend on Amazon.' },

  { id: 12, prize: '$50 Amazon Gift Card', brand: 'Amazon', logo: cb('amazon.com'), bgColor: '#232F3E', emoji: '📦',
    tier: 'VOLUME', entries: 55, total: 75, pct: 73, time: '14d 6h', price: 2,
    accent: '#FF9900', accentBg: '#FFF7ED', hot: false, featured: false,
    desc: '$50 to spend on anything at Amazon.' },
  { id: 13, prize: '$50 PlayStation Store', brand: 'PlayStation', logo: cb('playstation.com'), bgColor: '#003791', emoji: '🎯',
    tier: 'VOLUME', entries: 62, total: 75, pct: 83, time: '8d 12h', price: 2,
    accent: '#003791', accentBg: '#EFF6FF', hot: true, featured: false,
    desc: 'Top up your PSN wallet with $50.' },
  { id: 14, prize: '$50 Steam Wallet', brand: 'Steam', logo: cb('steampowered.com'), bgColor: '#1B2838', emoji: '🎮',
    tier: 'VOLUME', entries: 44, total: 75, pct: 59, time: '17d 0h', price: 2,
    accent: '#1B2838', accentBg: '#F1F5F9', hot: false, featured: false,
    desc: '$50 to spend in the Steam store.' },
  { id: 15, prize: '$50 Xbox Live Card', brand: 'Xbox', logo: cb('xbox.com'), bgColor: '#107C10', emoji: '🎮',
    tier: 'VOLUME', entries: 38, total: 75, pct: 51, time: '19d 8h', price: 2,
    accent: '#107C10', accentBg: '#ECFDF5', hot: false, featured: false,
    desc: '$50 for the Xbox store — games, DLC, or Game Pass.' },
  { id: 16, prize: '$50 Microsoft Store', brand: 'Microsoft', logo: cb('microsoft.com'), bgColor: '#FFFFFF', emoji: '🪟',
    tier: 'VOLUME', entries: 29, total: 75, pct: 39, time: '21d 0h', price: 2,
    accent: '#0078D4', accentBg: '#EFF6FF', hot: false, featured: false,
    desc: 'Spend on apps, games, Office, or Surface accessories.' },
  { id: 17, prize: '$50 Booking.com Credit', brand: 'Booking.com', logo: cb('booking.com'), bgColor: '#003580', emoji: '🏨',
    tier: 'VOLUME', entries: 48, total: 75, pct: 64, time: '16d 0h', price: 2,
    accent: '#003580', accentBg: '#EFF6FF', hot: false, featured: false,
    desc: '$50 off your next hotel stay anywhere.' },
  { id: 18, prize: '$50 Airbnb Credit', brand: 'Airbnb', logo: cb('airbnb.com'), bgColor: '#FFFFFF', emoji: '🏠',
    tier: 'VOLUME', entries: 41, total: 75, pct: 55, time: '18d 6h', price: 2,
    accent: '#FF5A5F', accentBg: '#FFF1F2', hot: false, featured: false,
    desc: '$50 credit toward any Airbnb stay.' },
  { id: 19, prize: '$50 Apple Gift Card', brand: 'Apple', logo: cb('apple.com'), bgColor: '#1A1A1A', emoji: '🍎',
    tier: 'VOLUME', entries: 67, total: 75, pct: 89, time: '7d 18h', price: 2,
    accent: '#1A1A1A', accentBg: '#F5F5F5', hot: true, featured: false,
    desc: 'App Store, iTunes, iCloud, Apple One — your call.' },
  { id: 20, prize: '$50 Nintendo eShop', brand: 'Nintendo', logo: cb('nintendo.com'), bgColor: '#E60012', emoji: '🎮',
    tier: 'VOLUME', entries: 33, total: 75, pct: 44, time: '20d 12h', price: 2,
    accent: '#E60012', accentBg: '#FFF1F2', hot: false, featured: false,
    desc: '$50 for Nintendo Switch games & DLC.' },
  { id: 21, prize: 'Disney+ Annual Plan', brand: 'Disney+', logo: cb('disneyplus.com'), bgColor: '#0F1F5C', emoji: '🏰',
    tier: 'VOLUME', entries: 25, total: 75, pct: 33, time: '21d 0h', price: 2,
    accent: '#113CCF', accentBg: '#EFF6FF', hot: false, featured: false,
    desc: 'A full year of Disney+ streaming.' },

  { id: 22, prize: '$500 Apple Store', brand: 'Apple', logo: cb('apple.com'), bgColor: '#1A1A1A', emoji: '🍎',
    tier: 'MEGA', entries: 498, total: 750, pct: 66, time: '28d 6h', price: 2,
    accent: '#1A1A1A', accentBg: '#F5F5F5', hot: false, featured: false,
    desc: '$500 at the Apple Store — iPhone accessories, AirPods, anything.' },
  { id: 23, prize: '$1,000 Expedia Voucher', brand: 'Expedia', logo: cb('expedia.com'), bgColor: '#00355F', emoji: '✈️',
    tier: 'MEGA', entries: 312, total: 1500, pct: 21, time: '44d 12h', price: 2,
    accent: '#FFC72C', accentBg: '#FFFBEB', hot: false, featured: false,
    desc: '$1,000 to spend on Expedia flights & hotels.' },
  { id: 24, prize: '$500 Booking.com Voucher', brand: 'Booking.com', logo: cb('booking.com'), bgColor: '#003580', emoji: '🏨',
    tier: 'MEGA', entries: 287, total: 750, pct: 38, time: '33d 8h', price: 2,
    accent: '#003580', accentBg: '#EFF6FF', hot: false, featured: false,
    desc: 'Your next trip on us — $500 off any Booking.com stay.' },
  { id: 25, prize: '$500 PlayStation Store', brand: 'PlayStation', logo: cb('playstation.com'), bgColor: '#003791', emoji: '🎮',
    tier: 'MEGA', entries: 421, total: 750, pct: 56, time: '30d 2h', price: 2,
    accent: '#003791', accentBg: '#EFF6FF', hot: true, featured: false,
    desc: 'Massive PSN top-up — games, DLC, PS Plus for a year.' },
  { id: 26, prize: '$1,000 Steam Wallet', brand: 'Steam', logo: cb('steampowered.com'), bgColor: '#1B2838', emoji: '🎮',
    tier: 'MEGA', entries: 612, total: 1500, pct: 41, time: '40d 6h', price: 2,
    accent: '#1B2838', accentBg: '#F1F5F9', hot: false, featured: false,
    desc: '$1,000 for the Steam store — build your dream library.' },
  { id: 27, prize: '$500 Microsoft Store', brand: 'Microsoft', logo: cb('microsoft.com'), bgColor: '#FFFFFF', emoji: '🪟',
    tier: 'MEGA', entries: 198, total: 750, pct: 26, time: '37d 0h', price: 2,
    accent: '#0078D4', accentBg: '#EFF6FF', hot: false, featured: false,
    desc: '$500 on Microsoft Store — Surface, Xbox, Office, anything.' },
  { id: 28, prize: '$1,000 Xbox Series X Bundle', brand: 'Xbox', logo: cb('xbox.com'), bgColor: '#107C10', emoji: '🎮',
    tier: 'MEGA', entries: 689, total: 1500, pct: 46, time: '42d 0h', price: 2,
    accent: '#107C10', accentBg: '#ECFDF5', hot: true, featured: false,
    desc: 'Xbox Series X console + Game Pass Ultimate for a year.' },
]

// ─────────────────────────────────────────────────────────────
// GUMROAD INTEGRATION
// Replace DEFAULT_GUMROAD_URL with your real Gumroad product URL
// (e.g. 'https://yourname.gumroad.com/l/winify-entry').
// For per-competition products, add an entry to GUMROAD_URLS keyed
// by pool id — these override the default.
// ─────────────────────────────────────────────────────────────
export const DEFAULT_GUMROAD_URL = 'https://badranalain.gumroad.com/l/spjrva'

export const GUMROAD_URLS: Record<number, string> = {
  // 1: 'https://yourname.gumroad.com/l/amazon500',
  // 2: 'https://yourname.gumroad.com/l/xbox10',
  // ...add per-pool product URLs here
}

export function getGumroadUrl(poolId: number): string {
  return GUMROAD_URLS[poolId] ?? DEFAULT_GUMROAD_URL
}

export const RECENT_WINNERS = [
  { name: 'j***n', prize: '$50 Amazon Gift Card', timeAgo: '2 min ago' },
  { name: 'm***e', prize: '$10 Xbox Gift Card', timeAgo: '8 min ago' },
  { name: 's***h', prize: '$500 Amazon Voucher', timeAgo: '23 min ago' },
  { name: 'r***a', prize: '$50 PlayStation Store', timeAgo: '1h ago' },
  { name: 'k***l', prize: '$15 Netflix Gift Card', timeAgo: '1h 30m ago' },
  { name: 'a***x', prize: '$50 Booking.com Credit', timeAgo: '2h ago' },
  { name: 't***y', prize: '$10 Spotify Premium', timeAgo: '3h ago' },
]
