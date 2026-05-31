'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { renderStars, getStars } from '@/lib/stars'

const categories = ['All', 'Analytics', 'Automation', 'Coordination', 'Data Feed', 'Gaming', 'Payments', 'Security', 'Other']

const starColor = (score: number) => {
  if (score >= 91) return '#00FF88'
  if (score >= 80) return '#7FFF00'
  return '#FFD700'
}

export default function Agents() {
  const [agents, setAgents] = useState<any[]>([])
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/agents').then(r => r.json()).then(setAgents)
  }, [])

  const filtered = agents.filter(a => {
    const matchCat = filter === 'All' || a.category === filter
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <main style={{ background: '#0A0F0A', minHeight: '100vh', color: '#E8F5E9' }}>
            <section style={{ padding: '48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: '#00FF88', letterSpacing: 3, marginBottom: 8 }}>AGENT REGISTRY</div>
          <h1 style={{ fontSize: 36, fontWeight: 900 }}>All Registered Agents</h1>
          <p style={{ color: '#4CAF6A', marginTop: 8 }}>Browse and verify agents on the NEXUS trust oracle</p>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search agents..."
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 8, padding: '8px 16px', color: '#E8F5E9', fontSize: 13, outline: 'none', width: 200 }} />
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{ background: filter === c ? 'rgba(0,255,136,0.15)' : 'transparent', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 8, padding: '8px 16px', color: filter === c ? '#00FF88' : '#4CAF6A', fontSize: 12, cursor: 'pointer' }}>
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ color: '#4CAF6A', textAlign: 'center', padding: 60 }}>Loading agents from chain...</div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {filtered.map((a) => (
            <Link key={a.id} href={`/agent/${a.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,255,136,0.12)', borderRadius: 12, padding: 24, cursor: 'pointer', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, background: 'rgba(0,255,136,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00FF88', fontWeight: 900, fontSize: 18 }}>{a.name[0]}</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: '#00FF88' }}>{a.score}</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2, color: '#E8F5E9' }}>{a.name}</div>
                <div style={{ fontSize: 18, color: starColor(a.score), marginBottom: 4, letterSpacing: 2 }}>{renderStars(a.score)}</div>
                <div style={{ fontSize: 11, color: '#4CAF6A', marginBottom: 4 }}>{a.category}</div>
                <div style={{ fontSize: 11, color: '#4CAF6A', fontFamily: 'monospace', marginBottom: 12 }}>{a.id.slice(0, 14)}...</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  {a.badges?.map((b: string, j: number) => (
                    <span key={j} style={{ fontSize: 10, color: '#00FF88', border: '1px solid rgba(0,255,136,0.3)', padding: '2px 8px', borderRadius: 4 }}>{b}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#4CAF6A', borderTop: '1px solid rgba(0,255,136,0.08)', paddingTop: 12 }}>
                  <span>{a.calls} on-chain calls</span>
                  <span>{a.stake} VARA staked</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
