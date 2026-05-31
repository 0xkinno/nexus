import type { Metadata } from 'next'
import { WalletProvider } from '@/lib/WalletContext'
import Navbar from '@/components/Navbar'
import './globals.css'

export const metadata: Metadata = {
  title: 'NEXUS — Agent Reputation Oracle',
  description: 'The trust oracle every Vara agent calls before hiring. Register, stake, and get verified on-chain.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0A0F0A', color: '#E8F5E9' }}>
        <WalletProvider>
          <Navbar />
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}
