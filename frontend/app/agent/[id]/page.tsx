'use client'
import Link from 'next/link'
import { use } from 'react'

const mockAgent = {
  name: 'NEXUS Agent',
  category: 'Agent Services',
  score: 91,
  reviews: 7,
  stake: '500',
  calls: 28,
  registered: '2026-05-30',
  badges: ['Verified', 'Top Rated', 'High Stake'],
  description: 'A trusted on-chain reputation agent providing trust scoring and verification services on Vara Mainnet.',
  reviewHistory: [
    { reviewer: '0xabc...123', score: 95, evidence: 'Excellent reliability, fast responses', date: '2026-05-28' },
    { reviewer: '0xdef...456', score: 90, evidence: 'Solid performance on complex tasks', date: '2026-05-27' },
    { reviewer: '0xghi...789', score: 88, evidence: 'Good agent, minor delays occasionally', date: '2026-05-26' },
  ]
}

export default function AgentProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const agent = mockAgent

  return (
    <main style={{ background: '#0A0F0A', minHeight: '100vh', color: '#E8F5E9' }}>
            <section style={{ padding: '48px', maxWidth: 1200, margin: '0 auto' }}>
        <Link href="/agents" style={{ color: '#4CAF6A', textDecoration: 'none', fontSize: 13, marginBottom: 24, display: 'block' }}>← Back to Agents</Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
          <div>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,255,136,0.12)', borderRadius: 12, padding: 32, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 20 }}>
                <div style={{ width: 64, height: 64, background: 'rgba(0,255,136,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00FF88', fontWeight: 900, fontSize: 28 }}>{agent.name[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 900, fontSize: 24 }}>{agent.name}</div>
                  <div style={{ color: '#00FF88', fontSize: 20, margin: '4px 0' }}>★★★★★</div>
                  <div style={{ color: '#4CAF6A', fontSize: 13 }}>{agent.category} · Vara Mainnet</div>
                  <div style={{ fontSize: 11, color: '#4CAF6A', fontFamily: 'monospace', marginTop: 4 }}>{id.slice(0, 30)}...</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 48, fontWeight: 900, color: '#00FF88' }}>{agent.score}</div>
                  <div style={{ fontSize: 12, color: '#4CAF6A' }}>Trust Score</div>
                </div>
              </div>
              <p style={{ color: '#4CAF6A', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{agent.description}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {agent.badges.map((b, i) => (
                  <span key={i} style={{ fontSize: 11, color: '#00FF88', border: '1px solid rgba(0,255,136,0.3)', padding: '3px 10px', borderRadius: 4 }}>{b}</span>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,255,136,0.12)', borderRadius: 12, padding: 32 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Review History</h2>
              {agent.reviewHistory.map((r, i) => (
                <div key={i} style={{ borderBottom: '1px solid rgba(0,255,136,0.08)', paddingBottom: 20, marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ fontSize: 13, color: '#4CAF6A', fontFamily: 'monospace' }}>{r.reviewer}</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: '#00FF88' }}>{r.score}/100</div>
                  </div>
                  <div style={{ fontSize: 14, color: '#E8F5E9', marginBottom: 4 }}>{r.evidence}</div>
                  <div style={{ fontSize: 12, color: '#4CAF6A' }}>{r.date}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,255,136,0.12)', borderRadius: 12, padding: 24, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 16, color: '#4CAF6A', letterSpacing: 2 }}>AGENT STATS</div>
              {[
                { label: 'Trust Score', value: `${agent.score}/100` },
                { label: 'Total Reviews', value: agent.reviews },
                { label: 'VARA Staked', value: `${agent.stake} VARA` },
                { label: 'On-chain Calls', value: agent.calls },
                { label: 'Registered', value: agent.registered },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(0,255,136,0.06)' }}>
                  <div style={{ fontSize: 13, color: '#4CAF6A' }}>{s.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,255,136,0.12)', borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 16, color: '#4CAF6A', letterSpacing: 2 }}>ACTIONS</div>
              <Link href="/register" style={{ display: 'block', background: '#00FF88', color: '#0A0F0A', padding: '12px', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none', textAlign: 'center', marginBottom: 12 }}>Submit Review</Link>
              <a href="https://idea.gear-tech.io/programs/0xc24415bd34b8ad998a91d57521beba4bffcf5afa6ed2e4b99264cbe78983384e" target="_blank" style={{ display: 'block', border: '1px solid rgba(0,255,136,0.3)', color: '#00FF88', padding: '12px', borderRadius: 8, fontWeight: 600, fontSize: 13, textDecoration: 'none', textAlign: 'center' }}>View on Gear IDEA ↗</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
