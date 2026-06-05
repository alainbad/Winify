import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'

const outfit = Outfit({ subsets: ['latin'], weight: ['400','500','600','700','800'] })

export const metadata: Metadata = {
  title: 'Winify — Win more. Pay less. Verified every time.',
  description: 'Skill competitions with verified fair draws via RANDOM.ORG',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.className}>
      <body style={{ background: '#2D1B69', margin: 0, padding: 0, minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 430, minHeight: '100vh', background: '#FAF8FF', position: 'relative', overflow: 'hidden' }}>
          {children}
        </div>
      </body>
    </html>
  )
}
