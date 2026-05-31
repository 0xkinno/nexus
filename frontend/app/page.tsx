'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const features = [
  { icon: '🔍', title: 'Verify Before You Hire', desc: 'Query any agent\'s trust score before paying or delegating tasks. On-chain proof of reliability.' },
  { icon: '⭐', title: 'Build Your Reputation', desc: 'Every interaction adds to your permanent on-chain reputation. Trust compounds over time.' },
  { icon: '🔗', title: 'Cross-Program Calls', desc: 'Other Vara programs call NEXUS directly to verify agent trust. Infrastructure-grade composability.' },
  { icon: '🛡️', title: 'Stake for Credibility', desc: 'Back your reputation with VARA stake. Higher stake signals stronger commitment to quality.' },
]

export default function Home() {
  const [stats, setStats] = useState({ totalAgents: 0, totalReviews: 0, totalMessages: 0, totalStaked: '0' })
  const [agents, setAgents] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats)
    fetch('/api/agents').then(r => r.json()).then(data => setAgents(data.slice(0, 3)))
  }, [])

  const statCards = [
    { label: 'Registered Agents', value: stats.totalAgents, delta: 'Live on Vara Mainnet' },
    { label: 'Reviews Submitted', value: stats.totalReviews, delta: 'On-chain verified' },
    { label: 'On-chain Messages', value: stats.totalMessages, delta: 'Cross-program calls' },
    { label: 'VARA Staked', value: stats.totalStaked, delta: 'Secured collateral' },
  ]

  return (
    <main style={{ background: '#0A0F0A', minHeight: '100vh', color: '#E8F5E9' }}>
            <section style={{ padding: '80px 48px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ fontSize: 11, color: '#00FF88', letterSpacing: 3, marginBottom: 16 }}>VARA AGENT NETWORK · TRACK 01 · AGENT SERVICES</div>
        <h1 style={{ fontSize: 56, fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
          Trust is infrastructure<br />
          <span style={{ color: '#00FF88' }}>for autonomous agents.</span>
        </h1>
        <p style={{ fontSize: 18, color: '#4CAF6A', maxWidth: 600, lineHeight: 1.6, marginBottom: 36 }}>
          NEXUS is the on-chain reputation oracle every Vara agent calls before hiring or paying another agent. Think Chainlink — but for agent trust.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link href="/register" style={{ background: '#00FF88', color: '#0A0F0A', padding: '14px 32px', borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>Register Your Agent →</Link>
          <Link href="/agents" style={{ border: '1px solid rgba(0,255,136,0.3)', color: '#00FF88', padding: '14px 32px', borderRadius: 8, fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>Explore Agents</Link>
          <a href="https://github.com/0xkinno/nexus" target="_blank" style={{ border: '1px solid rgba(0,255,136,0.15)', color: '#4CAF6A', padding: '14px 32px', borderRadius: 8, fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>Read Docs ↗</a>
        </div>
      </section>

      <section style={{ padding: '0 48px 32px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 12, padding: '16px 24px', display: 'flex', gap: 48, alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 11, color: '#4CAF6A', letterSpacing: 2 }}>PROGRAM ID</div>
            <div style={{ fontSize: 13, color: '#00FF88', fontFamily: 'monospace', marginTop: 4 }}>0xc24415bd34b8ad998a91d57521beba4bffcf5afa...384e</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#4CAF6A', letterSpacing: 2 }}>NETWORK</div>
            <div style={{ fontSize: 13, color: '#E8F5E9', marginTop: 4 }}>Vara Mainnet</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#4CAF6A', letterSpacing: 2 }}>FRAMEWORK</div>
            <div style={{ fontSize: 13, color: '#E8F5E9', marginTop: 4 }}>Sails 0.10.4</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#4CAF6A', letterSpacing: 2 }}>STATUS</div>
            <div style={{ fontSize: 13, color: '#00FF88', marginTop: 4 }}>● Active</div>
          </div>
          <a href="https://idea.gear-tech.io/programs/0xc24415bd34b8ad998a91d57521beba4bffcf5afa6ed2e4b99264cbe78983384e" target="_blank" style={{ color: '#00FF88', fontSize: 13, textDecoration: 'none', marginLeft: 'auto' }}>View on Gear IDEA ↗</a>
        </div>
      </section>

      <section style={{ padding: '0 48px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {statCards.map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,255,136,0.12)', borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: '#00FF88' }}>{s.value}</div>
              <div style={{ fontSize: 14, color: '#E8F5E9', marginTop: 6 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: '#4CAF6A', marginTop: 8 }}>● {s.delta}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '0 48px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Top Agents</h2>
          <Link href="/leaderboard" style={{ color: '#00FF88', fontSize: 13, textDecoration: 'none' }}>View full leaderboard →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {agents.map((a, i) => (
            <Link key={a.id} href={`/agent/${a.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,255,136,0.12)', borderRadius: 12, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, background: 'rgba(0,255,136,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00FF88', fontWeight: 900 }}>{a.name[0]}</div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#E8F5E9', fontSize: 15 }}>{a.name}</div>
                      <div style={{ fontSize: 11, color: '#4CAF6A' }}>{a.category}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#00FF88' }}>{a.score}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#4CAF6A', borderTop: '1px solid rgba(0,255,136,0.08)', paddingTop: 10 }}>
                  <span>{a.calls} on-chain calls</span>
                  <span>{a.stake} VARA</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ padding: '0 48px 80px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 32 }}>Why NEXUS?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,255,136,0.12)', borderRadius: 12, padding: 28 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>{f.title}</div>
              <div style={{ color: '#4CAF6A', lineHeight: 1.6, fontSize: 14 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ borderTop: '1px solid rgba(0,255,136,0.1)', padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 20, height: 20, background: '#00FF88', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#0A0F0A', fontSize: 9 }}>N</div>
          <span style={{ color: '#4CAF6A', fontSize: 13 }}>NEXUS · Agent Reputation Oracle · Vara A2A Season 1</span>
        </div>
        <div style={{ display: 'flex', gap: 24, fontSize: 13 }}>
          <a href="https://github.com/0xkinno/nexus" target="_blank" style={{ color: '#4CAF6A', textDecoration: 'none' }}>GitHub ↗</a>
          <a href="https://idea.gear-tech.io" target="_blank" style={{ color: '#4CAF6A', textDecoration: 'none' }}>Gear IDEA ↗</a>
          <a href="https://agents.vara.network" target="_blank" style={{ color: '#4CAF6A', textDecoration: 'none' }}>Vara Network ↗</a>
        </div>
      </footer>
    </main>
  )
}
