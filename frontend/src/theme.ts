export const COLORS = {
  surface: "#FAF8FF",
  surface2: "#FFFFFF",
  surface3: "#F3EBFF",
  inverse: "#2D1B69",
  onInverse: "#FFFFFF",
  text: "#1A0A2E",
  textMuted: "#7B6A98",
  brand: "#6D28D9",
  brandDark: "#4C1D95",
  gold: "#F59E0B",
  goldBg: "#FFFBEB",
  border: "#E8DEFF",
  success: "#10B981",
  error: "#EF4444",
  tier_micro: "#0EA5E9",
  tier_micro_bg: "#E0F2FE",
  tier_volume: "#6D28D9",
  tier_volume_bg: "#F3EBFF",
  tier_mega: "#F59E0B",
  tier_mega_bg: "#FFFBEB",
};
export const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
export const RADIUS = { sm: 6, md: 12, lg: 20, pill: 999 };
// Using system fonts (Outfit/Figtree not loaded via @expo-google-fonts per policy)
export const FONT = { display: undefined as unknown as string, text: undefined as unknown as string };

export const API_BASE = `${process.env.EXPO_PUBLIC_BACKEND_URL}/api`;

// Local gift-card PNGs copied from the original web app — exact same designs.
export const BRAND_IMAGES: Record<string, any> = {
  amazon: require("../assets/cards/card-amazon.png"),
  apple: require("../assets/cards/card-apple.png"),
  steam: require("../assets/cards/card-steam.png"),
  nike: require("../assets/cards/card-nike.png"),
  sephora: require("../assets/cards/card-sephora.png"),
  ubereats: require("../assets/cards/card-ubereats.png"),
  netflix: require("../assets/cards/card-netflix.png"),
  spotify: require("../assets/cards/card-spotify.png"),
  playstation: require("../assets/cards/card-playstation.png"),
  xbox: require("../assets/cards/card-xbox.png"),
  airbnb: require("../assets/cards/card-airbnb.png"),
  disneyplus: require("../assets/cards/card-disneyplus.png"),
  nintendo: require("../assets/cards/card-nintendo.png"),
  roblox: require("../assets/cards/card-roblox.png"),
  starbucks: require("../assets/cards/card-starbucks.png"),
  googleplay: require("../assets/cards/card-googleplay.png"),
  microsoft: require("../assets/cards/card-microsoft.png"),
  booking: require("../assets/cards/card-booking.png"),
  expedia: require("../assets/cards/card-expedia.png"),
};
