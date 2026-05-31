'use client'
import Link from 'next/link'
import { useWallet } from '@/lib/WalletContext'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const { account, connecting, connect, disconnect } = useWallet()
  const path = usePathname()

  const links = [
    { href: '/', label: 'Dashboard' },
    { href: '/agents', label: 'Agents' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/register', label: 'Register' },
    { href: '/stake', label: 'Stake' },
    { href: 'https://github.com/0xkinno/nexus', label: 'GitHub ↗', external: true },
  ]

  const shortAddr = (addr: string) => addr.slice(0, 8) + '...' + addr.slice(-4)

  return (
    <nav style={{ borderBottom: '1px solid rgba(0,255,136,0.1)', padding: '16px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#0A0F0A', zIndex: 100 }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
        <div style={{ width: 32, height: 32, background: '#00FF88', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#0A0F0A', fontSize: 14 }}>N</div>
        <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: 2, color: '#E8F5E9' }}>NEXUS</span>
        <span style={{ fontSize: 10, color: '#00FF88', border: '1px solid rgba(0,255,136,0.3)', padding: '2px 8px', borderRadius: 4, letterSpacing: 2 }}>LIVE</span>
      </Link>

      <div style={{ display: 'flex', gap: 28, fontSize: 14 }}>
        {links.map(link => (
          link.external ? (
            <a key={link.href} href={link.href} target="_blank" style={{ color: '#4CAF6A', textDecoration: 'none' }}>{link.label}</a>
          ) : (
            <Link key={link.href} href={link.href} style={{
              color: path === link.href ? '#00FF88' : '#4CAF6A',
              textDecoration: 'none',
              fontWeight: path === link.href ? 700 : 400,
            }}>
              {link.label}
            </Link>
          )
        ))}
      </div>

      {account ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 12, color: '#00FF88', fontFamily: 'monospace', background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.2)', padding: '6px 12px', borderRadius: 8 }}>
            ● {shortAddr(account)}
          </div>
          <button onClick={disconnect} style={{ background: 'transparent', border: '1px solid rgba(0,255,136,0.2)', color: '#4CAF6A', padding: '6px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
            Disconnect
          </button>
        </div>
      ) : (
        <button onClick={connect} disabled={connecting} style={{ background: '#00FF88', color: '#0A0F0A', padding: '8px 20px', borderRadius: 8, fontWeight: 700, fontSize: 13, border: 'none', cursor: connecting ? 'not-allowed' : 'pointer' }}>
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </nav>
  )
}
