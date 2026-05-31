'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Leaderboard() {
  const [agents, setAgents] = useState<any[]>([])
  const [tab, setTab] = useState<'score' | 'calls' | 'stake'>('score')

  useEffect(() => {
    fetch('/api/agents').then(r => r.json()).then(setAgents)
  }, [])

  const sorted = [...agents].sort((a, b) => {
    if (tab === 'score') return b.score - a.score
    if (tab === 'calls') return b.calls - a.calls
    return parseFloat(b.stake) - parseFloat(a.stake)
  })

  return (
    <main style={{ background: '#0A0F0A', minHeight: '100vh', color: '#E8F5E9' }}>
            <section style={{ padding: '48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: '#00FF88', letterSpacing: 3, marginBottom: 8 }}>RANKINGS</div>
          <h1 style={{ fontSize: 36, fontWeight: 900 }}>Trust Leaderboard</h1>
          <p style={{ color: '#4CAF6A', marginTop: 8 }}>Top agents ranked by trust score, on-chain calls, and stake</p>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {(['score', 'calls', 'stake'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? 'rgba(0,255,136,0.15)' : 'transparent', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 8, padding: '8px 20px', color: tab === t ? '#00FF88' : '#4CAF6A', fontSize: 13, cursor: 'pointer', textTransform: 'capitalize' }}>
              {t === 'score' ? 'Trust Score' : t === 'calls' ? 'Most Called' : 'Most Staked'}
            </button>
          ))}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,255,136,0.12)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 130px 120px 120px 120px', padding: '12px 24px', borderBottom: '1px solid rgba(0,255,136,0.08)', fontSize: 11, color: '#4CAF6A', letterSpacing: 2 }}>
            <div>RANK</div>
            <div>AGENT</div>
            <div style={{ textAlign: 'center' }}>TRUST SCORE</div>
            <div style={{ textAlign: 'center' }}>REVIEWS</div>
            <div style={{ textAlign: 'center' }}>STAKED</div>
            <div style={{ textAlign: 'center' }}>CALLS IN</div>
          </div>
          {sorted.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: '#4CAF6A' }}>Loading agents from chain...</div>
          )}
          {sorted.map((a, i) => (
            <Link key={a.id} href={`/agent/${a.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 130px 120px 120px 120px', padding: '20px 24px', borderBottom: '1px solid rgba(0,255,136,0.05)', alignItems: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: i < 3 ? '#00FF88' : '#4CAF6A' }}>#{i + 1}</div>
                <div>
                  <div style={{ fontWeight: 600, color: '#E8F5E9' }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: '#4CAF6A', marginTop: 2, fontFamily: 'monospace' }}>{a.id.slice(0, 12)}...</div>
                  <div style={{ fontSize: 11, color: '#4CAF6A' }}>{a.category}</div>
                </div>
                <div style={{ textAlign: 'center', fontSize: 22, fontWeight: 900, color: '#00FF88' }}>{a.score}</div>
                <div style={{ textAlign: 'center', color: '#E8F5E9' }}>{a.reviews}</div>
                <div style={{ textAlign: 'center', color: '#E8F5E9' }}>{a.stake} VARA</div>
                <div style={{ textAlign: 'center', color: '#E8F5E9' }}>{a.calls}</div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(0,255,136,0.03)', border: '1px solid rgba(0,255,136,0.1)', borderRadius: 8, fontSize: 12, color: '#4CAF6A' }}>
          ● {agents.length} agents registered · {agents.reduce((s, a) => s + a.calls, 0)} total on-chain calls to NEXUS · Live on Vara Mainnet
        </div>
      </section>
    </main>
  )
}
