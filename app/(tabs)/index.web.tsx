import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, StyleSheet, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import { Colors } from '@/constants/theme'
import { POOLS, RECENT_WINNERS, Pool } from '@/lib/data'

const LOGO_DEV_TOKEN = 'pk_OfBoU3ocR7WzMrZfenk7Iw'

const BRAND_DOMAINS: Record<string, string> = {
  'Amazon':      'amazon.com',
  'Xbox':        'xbox.com',
  'Netflix':     'netflix.com',
  'Steam':       'steampowered.com',
  'Spotify':     'spotify.com',
  'Roblox':      'roblox.com',
  // Google Play omitted — logo.dev returns the Google G, not the Play triangle
  'Apple':       'apple.com',
  'Uber Eats':   'ubereats.com',
  'Starbucks':   'starbucks.com',
  'PlayStation': 'playstation.com',
  'Microsoft':   'microsoft.com',
  'Booking.com': 'booking.com',
  'Airbnb':      'airbnb.com',
  'Nintendo':    'nintendo.com',
  'Disney+':     'disneyplus.com',
  'Expedia':     'expedia.com',
}


// Single-path brands (from simple-icons)
const BRAND_PATHS: Record<string, string> = {
  'Netflix': 'm5.398 0 8.348 23.602c2.346.059 4.856.398 4.856.398L10.113 0H5.398zm8.489 0v9.172l4.715 13.33V0h-4.715zM5.398 1.5V24c1.873-.225 2.81-.312 4.715-.398V14.83L5.398 1.5z',
  'Steam': 'M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0z',
  'Spotify': 'M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z',
  'Roblox': 'M18.926 23.998 0 18.892 5.075.002 24 5.108ZM15.348 10.09l-5.282-1.453-1.414 5.273 5.282 1.453z',
  'Google Play': 'M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z',
  'Apple': 'M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701',
  'PlayStation': 'M8.984 2.596v17.547l3.915 1.261V6.688c0-.69.304-1.151.794-.991.636.18.76.814.76 1.505v5.875c2.441 1.193 4.362-.002 4.362-3.152 0-3.237-1.126-4.675-4.438-5.827-1.307-.448-3.728-1.186-5.39-1.502zm4.656 16.241l6.296-2.275c.715-.258.826-.625.246-.818-.586-.192-1.637-.139-2.357.123l-4.205 1.5V14.98l.24-.085s1.201-.42 2.913-.615c1.696-.18 3.785.03 5.437.661 1.848.601 2.04 1.472 1.576 2.072-.465.6-1.622 1.036-1.622 1.036l-8.544 3.107V18.86zM1.807 18.6c-1.9-.545-2.214-1.668-1.352-2.32.801-.586 2.16-1.052 2.16-1.052l5.615-2.013v2.313L4.205 17c-.705.271-.825.632-.239.826.586.195 1.637.15 2.343-.12L8.247 17v2.074c-.12.03-.256.044-.39.073-1.939.331-3.996.196-6.038-.479z',
  'Airbnb': 'M12.001 18.275c-1.353-1.697-2.148-3.184-2.413-4.457-.263-1.027-.16-1.848.291-2.465.477-.71 1.188-1.056 2.121-1.056s1.643.345 2.12 1.063c.446.61.558 1.432.286 2.465-.291 1.298-1.085 2.785-2.412 4.458zm9.601 1.14c-.185 1.246-1.034 2.28-2.2 2.783-2.253.98-4.483-.583-6.392-2.704 3.157-3.951 3.74-7.028 2.385-9.018-.795-1.14-1.933-1.695-3.394-1.695-2.944 0-4.563 2.49-3.927 5.382.37 1.565 1.352 3.343 2.917 5.332-.98 1.085-1.91 1.856-2.732 2.333-.636.344-1.245.558-1.828.609-2.679.399-4.778-2.2-3.825-4.88.132-.345.395-.98.845-1.961l.025-.053c1.464-3.178 3.242-6.79 5.285-10.795l.053-.132.58-1.116c.45-.822.635-1.19 1.351-1.643.346-.21.77-.315 1.246-.315.954 0 1.698.558 2.016 1.007.158.239.345.557.582.953l.558 1.089.08.159c2.041 4.004 3.821 7.608 5.279 10.794l.026.025.533 1.22.318.764c.243.613.294 1.222.213 1.858zm1.22-2.39c-.186-.583-.505-1.271-.9-2.094v-.03c-1.889-4.006-3.642-7.608-5.307-10.844l-.111-.163C15.317 1.461 14.468 0 12.001 0c-2.44 0-3.476 1.695-4.535 3.898l-.081.16c-1.669 3.236-3.421 6.843-5.303 10.847v.053l-.559 1.22c-.21.504-.317.768-.345.847C-.172 20.74 2.611 24 5.98 24c.027 0 .132 0 .265-.027h.372c1.75-.213 3.554-1.325 5.384-3.317 1.829 1.989 3.635 3.104 5.382 3.317h.372c.133.027.239.027.265.027 3.37.003 6.152-3.261 4.802-6.975z',
  'Booking.com': 'M24 0H0v24h24ZM8.575 6.563h2.658c2.108 0 3.473 1.15 3.473 2.898 0 1.15-.575 1.82-.91 2.108l-.287.263.335.192c.815.479 1.318 1.389 1.318 2.395 0 1.988-1.51 3.257-3.857 3.257H7.449V7.713c0-.623.503-1.126 1.126-1.15zm1.7 1.868c-.479.024-.694.264-.694.79v1.893h1.676c.958 0 1.294-.743 1.294-1.365 0-.815-.503-1.318-1.318-1.318zm-.096 4.36c-.407.071-.598.31-.598.79v2.251h1.868c.934 0 1.509-.55 1.509-1.533 0-.934-.599-1.509-1.51-1.509zm7.737 2.394c.743 0 1.341.599 1.341 1.342a1.34 1.34 0 0 1-1.341 1.341 1.355 1.355 0 0 1-1.341-1.341c0-.743.598-1.342 1.34-1.342z',
  'Expedia': 'M19.067 0H4.933A4.94 4.94 0 0 0 0 4.933v14.134A4.932 4.932 0 0 0 4.933 24h14.134A4.932 4.932 0 0 0 24 19.067V4.933C24.01 2.213 21.797 0 19.067 0ZM7.336 19.341c0 .19-.148.337-.337.337h-2.33a.333.333 0 0 1-.337-.337v-2.33c0-.189.148-.336.337-.336H7c.19 0 .337.147.337.337zm12.121-1.486-2.308 2.298c-.169.168-.422.053-.422-.2V9.57l-6.44 6.44a.533.533 0 0 1-.421.17H8.169a.32.32 0 0 1-.338-.338v-1.697c0-.2.053-.316.169-.422l6.44-6.44H4.058c-.253 0-.369-.253-.2-.421l2.297-2.309c.137-.137.285-.232.517-.232H18.15c.854 0 1.539.686 1.539 1.54v11.478c-.01.231-.095.368-.232.516z',
}

// Multi-element SVG inner HTML for brands requiring complex/colored icons
const BRAND_SVG_HTML: Record<string, { inner: string; viewBox: string }> = {
  'Microsoft': {
    viewBox: '0 0 24 24',
    inner: '<rect x="0" y="0" width="11" height="11" fill="#f25022"/><rect x="13" y="0" width="11" height="11" fill="#7fba00"/><rect x="0" y="13" width="11" height="11" fill="#00a4ef"/><rect x="13" y="13" width="11" height="11" fill="#ffb900"/>',
  },
  'Xbox': {
    viewBox: '0 0 24 24',
    inner: '<circle cx="12" cy="12" r="12" fill="#107C10"/><path d="M12 4.5C10.4 4.5 8.9 5 8.9 5L12 9.8 15.1 5C15.1 5 13.6 4.5 12 4.5Z" fill="white"/><path d="M7.5 5.8C7.5 5.8 5 8 5 12 5 14.5 6 16.5 6 16.5L10.5 11 7.5 5.8Z" fill="white"/><path d="M16.5 5.8L13.5 11 18 16.5C18 16.5 19 14.5 19 12 19 8 16.5 5.8 16.5 5.8Z" fill="white"/><path d="M6.3 17.3C7.8 19 9.8 19.5 12 19.5 14.2 19.5 16.2 19 17.7 17.3L12 11 6.3 17.3Z" fill="white"/>',
  },
  'Amazon': {
    viewBox: '0 0 24 24',
    inner: '<path d="M13.958 10.09c0 1.232.029 2.256-.59 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.698-3.182v.685zm3.186 7.706a.66.66 0 01-.76.074c-1.067-.886-1.257-1.298-1.841-2.144-1.759 1.794-3.006 2.33-5.288 2.33-2.701 0-4.802-1.667-4.802-5.002 0-2.604 1.412-4.376 3.422-5.241 1.742-.765 4.174-.9 6.032-1.11v-.414c0-.762.06-1.662-.386-2.322-.392-.587-1.143-.83-1.804-.83-1.226 0-2.32.629-2.587 1.932-.055.288-.269.573-.557.587l-3.113-.337c-.262-.059-.553-.271-.477-.674C5.93 1.962 9.057 1 11.866 1c1.436 0 3.313.383 4.444 1.47C17.721 3.757 17.6 5.48 17.6 7.35v4.9c0 1.47.61 2.117 1.185 2.91.2.282.244.619-.01.828-.641.537-1.782 1.533-2.408 2.092l-.007-.003-.216-.281z" fill="currentColor"/><path d="M20.672 19.014c-2.391 1.762-5.855 2.7-8.836 2.7-4.18 0-7.941-1.545-10.785-4.115-.224-.202-.024-.478.244-.321 3.073 1.787 6.87 2.863 10.795 2.863 2.646 0 5.552-.549 8.228-1.687.405-.172.743.266.354.56z" fill="#FF9900"/><path d="M21.722 17.818c-.305-.391-2.02-.185-2.791-.093-.234.028-.27-.176-.059-.324 1.366-.961 3.609-.683 3.872-.361.262.324-.069 2.572-1.352 3.645-.196.165-.384.077-.297-.14.289-.72.936-2.337.627-2.727z" fill="#FF9900"/>',
  },
  'Nintendo': {
    viewBox: '0 0 24 24',
    inner: '<rect x="0" y="0" width="24" height="24" rx="12" fill="#E60012"/><path d="M5 5.5 H9.5 L15 13 V5.5 H19 V18.5 H14.5 L9 11 V18.5 H5 Z" fill="white"/>',
  },
  'Disney+': {
    viewBox: '0 0 24 24',
    inner: '<rect x="0" y="0" width="24" height="24" rx="3" fill="#0F1F5C"/><text x="3.5" y="17" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-size="13" fill="white">D+</text>',
  },
  'Uber Eats': {
    viewBox: '0 0 24 24',
    inner: '<circle cx="12" cy="12" r="12" fill="#06C167"/><path d="M12 4a8 8 0 1 0 0 16A8 8 0 0 0 12 4zm0 3a5 5 0 1 1 0 10A5 5 0 0 1 12 7zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" fill="white"/>',
  },
  'Starbucks': {
    viewBox: '0 0 24 24',
    inner: '<circle cx="12" cy="12" r="12" fill="#00704A"/><circle cx="12" cy="12" r="8" fill="none" stroke="white" stroke-width="1.5"/><path d="M12 4.5 C10 6 9 8 9 10 L9 14 C9 16 10 18 12 19.5 C14 18 15 16 15 14 L15 10 C15 8 14 6 12 4.5Z" fill="white" opacity="0.9"/><circle cx="12" cy="9" r="2" fill="#00704A"/>',
  },
}

function BrandIcon({ brand, color }: { brand: string; color: string }) {
  const [logoFailed, setLogoFailed] = useState(false)
  const domain = BRAND_DOMAINS[brand]

  if (domain && !logoFailed) {
    const src = `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}&size=128&format=png`
    return (
      <img
        src={src}
        width={64}
        height={64}
        alt={brand}
        onError={() => setLogoFailed(true)}
        style={{ display: 'block', objectFit: 'contain' } as any}
      />
    )
  }

  // Fallback: hand-crafted multi-element SVG
  const htmlIcon = BRAND_SVG_HTML[brand]
  if (htmlIcon) {
    return (
      <svg viewBox={htmlIcon.viewBox} width={64} height={64} style={{ display: 'block' } as any}
        dangerouslySetInnerHTML={{ __html: htmlIcon.inner }} />
    )
  }
  // Fallback: simple-icons single path
  const path = BRAND_PATHS[brand]
  if (!path) {
    return <Text style={{ fontSize: 40, fontWeight: '900', color, opacity: 0.9 }}>{brand.charAt(0)}</Text>
  }
  return (
    <svg viewBox="0 0 24 24" width={64} height={64} fill={color} style={{ display: 'block' } as any}>
      <path d={path} />
    </svg>
  )
}

type CardTheme = {
  bg1: string; bg2: string; textColor: string;
}

// svg = use simpleicons CDN via CSS backgroundImage (for brands not in FA5/MCI)
const CARD_THEMES: Record<string, CardTheme> = {
  'Amazon':      { bg1: '#FF9900', bg2: '#E47911', textColor: '#FFFFFF' },
  'Xbox':        { bg1: '#FFFFFF', bg2: '#F0F0F0', textColor: '#107C10' },
  'Netflix':     { bg1: '#141414', bg2: '#1A0000', textColor: '#E50914' },
  'Steam':       { bg1: '#1B2838', bg2: '#2A475E', textColor: '#FFFFFF' },
  'Spotify':     { bg1: '#191414', bg2: '#121212', textColor: '#1DB954' },
  'Roblox':      { bg1: '#FFFFFF', bg2: '#F0F0F0', textColor: '#E2231A' },
  'Google Play': { bg1: '#1C1C1C', bg2: '#111111', textColor: '#FFFFFF' },
  'Apple':       { bg1: '#1A1A1A', bg2: '#2D2D2D', textColor: '#FFFFFF' },
  'Uber Eats':   { bg1: '#142328', bg2: '#0A1A1F', textColor: '#06C167' },
  'Starbucks':   { bg1: '#00704A', bg2: '#005F3E', textColor: '#FFFFFF' },
  'PlayStation': { bg1: '#003791', bg2: '#00287A', textColor: '#FFFFFF' },
  'Microsoft':   { bg1: '#0078D4', bg2: '#005BA1', textColor: '#FFFFFF' },
  'Booking.com': { bg1: '#003580', bg2: '#002B6B', textColor: '#FFFFFF' },
  'Airbnb':      { bg1: '#FF5A5F', bg2: '#E0474C', textColor: '#FFFFFF' },
  'Nintendo':    { bg1: '#E60012', bg2: '#C4000F', textColor: '#FFFFFF' },
  'Disney+':     { bg1: '#0F1F5C', bg2: '#1A3080', textColor: '#FFFFFF' },
  'Expedia':     { bg1: '#00355F', bg2: '#00243F', textColor: '#FFC72C' },
}

function GiftCardThumb({ pool, style, children }: { pool: Pool; style?: any; children?: React.ReactNode }) {
  const theme = CARD_THEMES[pool.brand] ?? { bg1: pool.bgColor, bg2: pool.bgColor, textColor: '#FFFFFF' }
  const ic = theme.icon

  return (
    <View style={[style, { backgroundColor: theme.bg1, position: 'relative', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }]}>
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: theme.bg2, opacity: 0.45 }]} />
      <View style={styles.giftCircle1} />
      <View style={styles.giftCircle2} />
      <BrandIcon brand={pool.brand} color={theme.textColor} />
      <Text style={[styles.giftBrandName, { color: theme.textColor }]}>{pool.brand}</Text>
      <View style={styles.giftLabel}>
        <Text style={styles.giftLabelText}>GIFT CARD</Text>
      </View>
      {children}
    </View>
  )
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const { width } = useWindowDimensions()
  const isMobile = width < 768
  return (
    <View style={styles.navbar}>
      <View style={styles.navInner}>
        <Text style={styles.navLogo}>Tick Pick</Text>
        {!isMobile && (
          <View style={styles.navLinks}>
            {['Home', 'Browse', 'How It Works', 'Winners'].map(link => (
              <TouchableOpacity key={link} style={styles.navLinkBtn}>
                <Text style={styles.navLinkText}>{link}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={styles.navActions}>
          <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/(tabs)/account')}>
            <Text style={styles.loginBtnText}>Login</Text>
          </TouchableOpacity>
          {!isMobile && (
            <TouchableOpacity style={styles.signupBtn} onPress={() => router.push('/(tabs)/account')}>
              <Text style={styles.signupBtnText}>Sign Up</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}

// ─── Hero Featured Card ────────────────────────────────────────────────────
function HeroCompCard({ pool }: { pool: Pool }) {
  return (
    <TouchableOpacity onPress={() => router.push(`/competition/${pool.id}`)} activeOpacity={0.9} style={styles.heroCompCard}>
      <GiftCardThumb pool={pool} style={styles.heroCompImage}>
        <View style={styles.heroCompTimePill}>
          <View style={styles.liveDot} />
          <Text style={styles.heroCompTimeText}>{pool.time}</Text>
        </View>
        <View style={styles.hotPillRight}>
          <Text style={styles.hotPillText}>FEATURED ⭐</Text>
        </View>
      </GiftCardThumb>
      <View style={styles.heroCompBody}>
        <View style={styles.tierRow}>
          <View style={[styles.tierChip, { backgroundColor: pool.accentBg }]}>
            <Text style={[styles.tierChipText, { color: pool.accent }]}>{pool.tier}</Text>
          </View>
        </View>
        <Text style={styles.heroCompPrize}>{pool.prize}</Text>
        <Text style={styles.heroCompDesc} numberOfLines={2}>{pool.desc}</Text>
        <View style={styles.progressWrap}>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${pool.pct}%` as any, backgroundColor: pool.accent }]} />
          </View>
          <View style={styles.progressMeta}>
            <Text style={styles.progressText}>{pool.pct}% sold</Text>
            <Text style={styles.progressText}>{pool.entries}/{pool.total} entries</Text>
          </View>
        </View>
        <View style={styles.heroCompFooter}>
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>${pool.price}.00</Text>
          </View>
          <TouchableOpacity style={styles.playNowBtn} onPress={() => router.push(`/competition/${pool.id}`)}>
            <Text style={styles.playNowBtnText}>Enter Now →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}

// ─── Hero Section ─────────────────────────────────────────────────────────
function Hero({ featured }: { featured: Pool }) {
  const { width } = useWindowDimensions()
  const isMobile = width < 768
  return (
    <View style={styles.hero}>
      <View style={[styles.heroInner, isMobile && { flexDirection: 'column', gap: 32, alignItems: 'stretch' }]}>
        {/* Left */}
        <View style={[styles.heroLeft, isMobile && { width: '100%' as any }]}>
          <View style={styles.heroBadge}>
            <View style={styles.liveDotGreen} />
            <Text style={styles.heroBadgeText}>38 live competitions right now</Text>
          </View>
          <Text style={[styles.heroHeadline, isMobile && { fontSize: 42, lineHeight: 48 }]}>Win Big{'\n'}for Just $2</Text>
          <Text style={styles.heroSubtext}>
            Enter premium prize draws with a single ticket. Every draw is provably fair,
            powered by RANDOM.ORG. Winners paid instantly.
          </Text>
          <View style={styles.heroCtaRow}>
            <TouchableOpacity style={styles.heroCta} onPress={() => router.push('/browse')}>
              <Text style={styles.heroCtaText}>Browse Competitions →</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroCtaOutline} onPress={() => { const el = document.getElementById('how-it-works'); el?.scrollIntoView({ behavior: 'smooth' }) }}>
              <Text style={styles.heroCtaOutlineText}>How It Works</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.heroStats}>
            {[
              { val: '12,400+', label: 'Winners' },
              { val: '$2', label: 'Per Entry' },
              { val: '38', label: 'Live Now' },
            ].map(s => (
              <View key={s.label} style={styles.heroStat}>
                <Text style={styles.heroStatVal}>{s.val}</Text>
                <Text style={styles.heroStatLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* Right */}
        <View style={[styles.heroRight, isMobile && { width: '100%' }]}>
          <HeroCompCard pool={featured} />
        </View>
      </View>
    </View>
  )
}

// ─── Competition Card ────────────────────────────────────────────────────
function CompCard({ pool }: { pool: Pool }) {
  const isUrgent = pool.pct > 80
  return (
    <TouchableOpacity onPress={() => router.push(`/competition/${pool.id}`)} activeOpacity={0.88} style={styles.compCard}>
      <GiftCardThumb pool={pool} style={styles.compCardImage}>
        <View style={styles.timePill}>
          <View style={styles.liveDot} />
          <Text style={styles.timePillText}>{pool.time}</Text>
        </View>
        {pool.hot && (
          <View style={styles.hotPill}>
            <Text style={styles.hotPillText}>HOT 🔥</Text>
          </View>
        )}
      </GiftCardThumb>
      <View style={styles.compCardBody}>
        <View style={styles.tierRow}>
          <View style={[styles.tierChip, { backgroundColor: pool.accentBg }]}>
            <Text style={[styles.tierChipText, { color: pool.accent }]}>{pool.tier}</Text>
          </View>
          {isUrgent && (
            <View style={styles.urgentChip}>
              <Text style={styles.urgentChipText}>ENDING SOON</Text>
            </View>
          )}
        </View>
        <Text style={styles.compCardPrize} numberOfLines={2}>{pool.prize}</Text>
        <View style={styles.progressWrap}>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, {
              width: `${pool.pct}%` as any,
              backgroundColor: isUrgent ? Colors.red : pool.accent,
            }]} />
          </View>
          <Text style={styles.progressText}>{pool.pct}% sold · {pool.entries}/{pool.total}</Text>
        </View>
        <View style={styles.compCardFooter}>
          <View style={styles.priceBadge}>
            <Text style={styles.priceBadgeText}>${pool.price}.00</Text>
          </View>
          <TouchableOpacity style={styles.playBtn} onPress={() => router.push(`/competition/${pool.id}`)}>
            <Text style={styles.playBtnText}>Play Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}

// ─── Filter + Search Bar ─────────────────────────────────────────────────
type Filter = 'All' | 'MICRO' | 'VOLUME' | 'MEGA'

function FilterBar({ active, onSelect, search, onSearch }: {
  active: Filter; onSelect: (f: Filter) => void
  search: string; onSearch: (s: string) => void
}) {
  const tabs: Filter[] = ['All', 'MICRO', 'VOLUME', 'MEGA']
  return (
    <View style={styles.filterBar}>
      <View style={styles.filterBarInner}>
        <View style={styles.filterTabs}>
          {tabs.map(t => (
            <TouchableOpacity key={t} onPress={() => onSelect(t)}
              style={[styles.filterTab, active === t && styles.filterTabActive]}>
              <Text style={[styles.filterTabText, active === t && styles.filterTabTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={search}
            onChangeText={onSearch}
            placeholder="Search competitions..."
            placeholderTextColor={Colors.muted}
            style={styles.searchInput}
          />
        </View>
      </View>
    </View>
  )
}

// ─── Winners Ticker ──────────────────────────────────────────────────────
function WinnersTicker() {
  return (
    <View style={styles.tickerBar}>
      <View style={styles.tickerLabel}>
        <Text style={styles.tickerLabelText}>🏆 RECENT WINS</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tickerScroll}>
        {RECENT_WINNERS.map((w, i) => (
          <View key={i} style={styles.tickerItem}>
            <Text style={styles.tickerName}>{w.name}</Text>
            <Text style={styles.tickerWon}> won </Text>
            <Text style={styles.tickerPrize}>{w.prize}</Text>
            <Text style={styles.tickerTime}> · {w.timeAgo}</Text>
            {i < RECENT_WINNERS.length - 1 && <Text style={styles.tickerDivider}>  ·  </Text>}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

// ─── How It Works ────────────────────────────────────────────────────────
function HowItWorks() {
  const { width } = useWindowDimensions()
  const isMobile = width < 768
  const steps = [
    { icon: '🎯', title: 'Pick a Competition', desc: 'Browse hundreds of live prize draws. From $10 gift cards to $1,000 vouchers.' },
    { icon: '🎟️', title: 'Enter for $2', desc: 'One flat price, no hidden fees. Every ticket gives you a fair shot at winning.' },
    { icon: '🎲', title: 'Fair Draw', desc: 'When tickets sell out, a winner is picked by RANDOM.ORG — provably fair every time.' },
    { icon: '🏆', title: 'Claim Your Prize', desc: 'Winners are notified instantly and prizes delivered within 24 hours.' },
  ]
  const cardWidth = isMobile ? '48%' : '23%'
  return (
    <View style={styles.howSection}>
      <View style={styles.sectionInner}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <Text style={styles.sectionSubtitle}>Four simple steps to your next win</Text>
        </View>
        <View style={[styles.howGrid, isMobile && { flexWrap: 'wrap' }]}>
          {steps.map((s, i) => (
            <View key={i} style={[styles.howCard, { width: cardWidth as any }]}>
              <View style={styles.howIconWrap}>
                <Text style={styles.howIcon}>{s.icon}</Text>
                <View style={styles.howStepNum}><Text style={styles.howStepNumText}>{i + 1}</Text></View>
              </View>
              <Text style={styles.howTitle}>{s.title}</Text>
              <Text style={styles.howDesc}>{s.desc}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────────
function Footer() {
  return (
    <View style={styles.footer}>
      <View style={styles.footerInner}>
        <View style={styles.footerTop}>
          <View style={styles.footerBrand}>
            <Text style={styles.footerLogo}>Tick Pick</Text>
            <Text style={styles.footerTagline}>Premium competitions for everyone.</Text>
            <View style={styles.trustBadges}>
              {['✓ RANDOM.ORG Verified', '✓ Instant Payouts', '✓ 12,400+ Winners'].map(b => (
                <Text key={b} style={styles.trustBadge}>{b}</Text>
              ))}
            </View>
          </View>
          <View style={styles.footerLinks}>
            {[
              { heading: 'Compete', links: ['Browse All', 'MICRO Draws', 'VOLUME Draws', 'MEGA Draws'] },
              { heading: 'Company', links: ['About Us', 'How It Works', 'Past Winners', 'Blog'] },
              { heading: 'Support', links: ['Help Centre', 'Contact Us', 'Terms', 'Privacy'] },
            ].map(col => (
              <View key={col.heading} style={styles.footerCol}>
                <Text style={styles.footerColHead}>{col.heading}</Text>
                {col.links.map(l => (
                  <TouchableOpacity key={l}><Text style={styles.footerLink}>{l}</Text></TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>
        <View style={styles.footerBottom}>
          <Text style={styles.footerCopy}>© 2026 Tick Pick. All rights reserved. Competitions are open to users aged 18+.</Text>
        </View>
      </View>
    </View>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────
export default function HomeWebScreen() {
  const [filter, setFilter] = useState<Filter>('All')
  const [search, setSearch] = useState('')
  const { width } = useWindowDimensions()
  const isMobile = width < 768
  const isTablet = width >= 768 && width < 1100

  const featured = POOLS.find(p => p.featured)!
  const pools = POOLS.filter(p => {
    const matchTier = filter === 'All' || p.tier === filter
    const matchSearch = search === '' || p.prize.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())
    return matchTier && matchSearch
  })

  const itemWidth = isMobile ? '49%' : isTablet ? '32%' : '24%'

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>
      <Navbar />
      <Hero featured={featured} />
      <WinnersTicker />

      {/* Competitions Section */}
      <View style={styles.compSection}>
        <View style={styles.compSectionHeader}>
          <Text style={[styles.sectionTitle, isMobile && { fontSize: 26 }]}>Live Competitions</Text>
          <Text style={styles.sectionSubtitle}>{POOLS.length} draws live now — new ones added daily</Text>
        </View>
        <FilterBar active={filter} onSelect={setFilter} search={search} onSearch={setSearch} />
        <View style={styles.compGrid}>
          {pools.map(p => (
            <View key={p.id} style={[styles.compGridItem, { width: itemWidth }]}>
              <CompCard pool={p} />
            </View>
          ))}
        </View>
      </View>

      <HowItWorks />
      <Footer />
    </ScrollView>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────
const MAX = 1280

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bg },

  // Navbar
  navbar: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: Colors.border, position: 'sticky' as any, top: 0, zIndex: 100 },
  navInner: { maxWidth: MAX, alignSelf: 'center' as any, width: '100%' as any, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 32, paddingVertical: 16 },
  navLogo: { fontSize: 26, fontWeight: '800', color: Colors.primary, letterSpacing: -0.5 },
  navLinks: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  navLinkBtn: { paddingHorizontal: 14, paddingVertical: 8 },
  navLinkText: { fontSize: 15, fontWeight: '500', color: Colors.text },
  navActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  loginBtn: { paddingHorizontal: 18, paddingVertical: 9, borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 8 },
  loginBtnText: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  signupBtn: { paddingHorizontal: 20, paddingVertical: 9, backgroundColor: Colors.primary, borderRadius: 8 },
  signupBtnText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },

  // Hero
  hero: { background: 'linear-gradient(135deg, #2D1B69 0%, #4C1D95 50%, #6D28D9 100%)' as any, backgroundColor: '#2D1B69', paddingVertical: 80, paddingHorizontal: 20 },
  heroInner: { maxWidth: MAX, alignSelf: 'center' as any, width: '100%' as any, flexDirection: 'row', alignItems: 'center', gap: 60 },
  heroLeft: { flex: 1 },
  heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7, alignSelf: 'flex-start', marginBottom: 24 },
  heroBadgeText: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },
  liveDotGreen: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4ADE80' },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4ADE80' },
  heroHeadline: { fontSize: 64, fontWeight: '900', color: '#FFFFFF', lineHeight: 68, letterSpacing: -2, marginBottom: 20 },
  heroSubtext: { fontSize: 18, lineHeight: 28, color: 'rgba(255,255,255,0.75)', fontWeight: '400', marginBottom: 36 },
  heroCtaRow: { flexDirection: 'row', gap: 14, marginBottom: 48 },
  heroCta: { backgroundColor: '#FFFFFF', borderRadius: 10, paddingHorizontal: 28, paddingVertical: 15 },
  heroCtaText: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  heroCtaOutline: { borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)', borderRadius: 10, paddingHorizontal: 28, paddingVertical: 15 },
  heroCtaOutlineText: { fontSize: 16, fontWeight: '600', color: 'rgba(255,255,255,0.9)' },
  heroStats: { flexDirection: 'row', gap: 40 },
  heroStat: {},
  heroStatVal: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  heroStatLabel: { fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: '500', marginTop: 2 },
  heroRight: { width: 340 },

  // Hero comp card
  heroCompCard: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 40, shadowOffset: { width: 0, height: 20 } },
  heroCompImage: { height: 200, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  heroCompTimePill: { position: 'absolute', top: 12, left: 12, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  heroCompTimeText: { fontSize: 12, fontWeight: '600', color: '#FFFFFF' },
  hotPillRight: { position: 'absolute', top: 12, right: 12, backgroundColor: Colors.gold, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  hotPillText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
  heroCompLogo: { width: 160, height: 80 },
  heroCompBody: { padding: 18 },
  heroCompPrize: { fontSize: 20, fontWeight: '800', color: Colors.text, marginBottom: 6, marginTop: 6 },
  heroCompDesc: { fontSize: 13, color: Colors.textSec, lineHeight: 19, marginBottom: 14 },
  heroCompFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },

  // Competition card
  compSection: { paddingVertical: 48, paddingHorizontal: 12 },
  compSectionHeader: { marginBottom: 24, paddingHorizontal: 4 },
  sectionInner: { maxWidth: MAX, alignSelf: 'center' as any, width: '100%' as any },
  sectionHeader: { alignItems: 'center', marginBottom: 48 },
  sectionTitle: { fontSize: 36, fontWeight: '800', color: Colors.text, letterSpacing: -0.5 },
  sectionSubtitle: { fontSize: 16, color: Colors.textSec, marginTop: 8 },
  compGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 as any },
  compGridItem: {},
  compCard: { backgroundColor: '#FFFFFF', borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 16, shadowOffset: { width: 0, height: 4 } },
  compCardImage: { height: 160, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  timePill: { position: 'absolute', top: 10, left: 10, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  timePillText: { fontSize: 11, fontWeight: '600', color: '#FFFFFF' },
  hotPill: { position: 'absolute', top: 10, right: 10, backgroundColor: '#EA580C', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
  giftCircle1: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.08)', top: -30, right: -30 },
  giftCircle2: { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.05)', bottom: -20, left: -20 },
  giftIconWrap: { alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  giftBrandName: { fontSize: 14, fontWeight: '800', letterSpacing: 0.5, textAlign: 'center' },
  giftSvgBox: { width: '72%', height: '72%' },
  giftLabel: { position: 'absolute', bottom: 10, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2 },
  giftLabelText: { fontSize: 9, fontWeight: '800', color: 'rgba(255,255,255,0.9)', letterSpacing: 1.5 },
  compCardLogo: { width: 120, height: 60 },
  compCardBody: { padding: 14 },
  tierRow: { flexDirection: 'row', gap: 6, marginBottom: 8, alignItems: 'center' },
  tierChip: { borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  tierChipText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  urgentChip: { backgroundColor: Colors.redBg, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
  urgentChipText: { fontSize: 10, fontWeight: '700', color: Colors.red, letterSpacing: 0.5 },
  compCardPrize: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 12, lineHeight: 20 },
  progressWrap: { marginBottom: 12 },
  progressBg: { height: 5, backgroundColor: '#F0EBFF', borderRadius: 999, marginBottom: 4 },
  progressFill: { height: '100%', borderRadius: 999 },
  progressMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { fontSize: 11, color: Colors.textSec, fontWeight: '500' },
  compCardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priceBadge: { backgroundColor: Colors.primaryLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  priceBadgeText: { fontSize: 14, fontWeight: '800', color: Colors.primary },
  playBtn: { borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6 },
  playBtnText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  playNowBtn: { backgroundColor: Colors.primary, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 9 },
  playNowBtnText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },

  // Filter bar
  filterBar: { marginBottom: 32 },
  filterBarInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  filterTabs: { flexDirection: 'row', gap: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: Colors.border, borderRadius: 10, padding: 4 },
  filterTab: { borderRadius: 7, paddingHorizontal: 20, paddingVertical: 9 },
  filterTabActive: { backgroundColor: Colors.primary },
  filterTabText: { fontSize: 14, fontWeight: '600', color: Colors.textSec },
  filterTabTextActive: { color: '#FFFFFF' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, width: 260, gap: 8 },
  searchIcon: { fontSize: 15 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text, outlineWidth: 0 } as any,

  // Ticker
  tickerBar: { backgroundColor: Colors.primaryDark, flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  tickerLabel: { backgroundColor: Colors.gold, paddingHorizontal: 16, paddingVertical: 10, marginRight: 16 },
  tickerLabelText: { fontSize: 11, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1 },
  tickerScroll: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 },
  tickerItem: { flexDirection: 'row', alignItems: 'center' },
  tickerName: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  tickerWon: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  tickerPrize: { fontSize: 13, fontWeight: '600', color: Colors.gold },
  tickerTime: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
  tickerDivider: { fontSize: 13, color: 'rgba(255,255,255,0.25)' },

  // How it works
  howSection: { backgroundColor: '#FFFFFF', paddingVertical: 80, paddingHorizontal: 20 },
  howGrid: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' as any },
  howCard: { alignItems: 'center', padding: 24, backgroundColor: Colors.bg, borderRadius: 16, borderWidth: 1, borderColor: Colors.border },
  howIconWrap: { width: 64, height: 64, borderRadius: 20, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 18, position: 'relative' },
  howIcon: { fontSize: 30 },
  howStepNum: { position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  howStepNumText: { fontSize: 11, fontWeight: '800', color: '#FFFFFF' },
  howTitle: { fontSize: 17, fontWeight: '700', color: Colors.text, marginBottom: 10, textAlign: 'center' },
  howDesc: { fontSize: 14, color: Colors.textSec, textAlign: 'center', lineHeight: 21 },

  // Footer
  footer: { backgroundColor: '#1A0A2E', paddingVertical: 60, paddingHorizontal: 20 },
  footerInner: { maxWidth: MAX, alignSelf: 'center' as any, width: '100%' as any },
  footerTop: { flexDirection: 'row', flexWrap: 'wrap' as any, gap: 40, marginBottom: 48 },
  footerBrand: { flex: 1, minWidth: 240 },
  footerLogo: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', marginBottom: 10 },
  footerTagline: { fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 20 },
  trustBadges: { gap: 8 },
  trustBadge: { fontSize: 13, color: Colors.green, fontWeight: '500' },
  footerLinks: { flexDirection: 'row', gap: 60 },
  footerCol: { gap: 12 },
  footerColHead: { fontSize: 13, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.5, marginBottom: 4 },
  footerLink: { fontSize: 14, color: 'rgba(255,255,255,0.5)' },
  footerBottom: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', paddingTop: 24 },
  footerCopy: { fontSize: 13, color: 'rgba(255,255,255,0.35)', textAlign: 'center' },
})
