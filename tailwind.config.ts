import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: { outfit: ['Outfit', 'sans-serif'] },
      colors: {
        primary: '#6D28D9',
        'primary-dark': '#4C1D95',
        'primary-light': '#F5F0FF',
        gold: '#F59E0B',
        'gold-bg': '#FFFBEB',
        'win-green': '#059669',
        'win-green-bg': '#ECFDF5',
        'win-bg': '#FAF8FF',
        'win-card': '#FFFFFF',
        'win-border': '#E8DEFF',
        'win-text': '#1A0A2E',
        'win-text-sec': '#7B6A98',
        'win-muted': '#C4B8DC',
      },
      keyframes: {
        livepulse: { '0%,100%': { transform: 'scale(1)', opacity: '1' }, '50%': { transform: 'scale(1.5)', opacity: '0.6' } },
        slideUp: { from: { transform: 'translateY(8px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        bounceIn: { '0%': { transform: 'scale(0.5)', opacity: '0' }, '70%': { transform: 'scale(1.1)' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        confettiFall: { from: { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' }, to: { transform: 'translateY(100vh) rotate(360deg)', opacity: '0' } },
      },
      animation: {
        livepulse: 'livepulse 1.8s ease-in-out infinite',
        slideUp: 'slideUp 0.4s ease',
        bounceIn: 'bounceIn 0.6s ease forwards',
        confettiFall: 'confettiFall 3s ease-in forwards',
      },
    },
  },
  plugins: [],
}
export default config
