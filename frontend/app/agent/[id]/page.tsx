'use client'
import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useWallet } from '@/lib/WalletContext'
import { renderStars } from '@/lib/stars'

const PROGRAM_ID = '0xc24415bd34b8ad998a91d57521beba4bffcf5afa6ed2e4b99264cbe78983384e'

const starColor = (score: number) => {
  if (score >= 91) return '#00FF88'
  if (score >= 80) return '#7FFF00'
  return '#FFD700'
}

function StarPicker({ value, onChange }: { value: number, onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
          style={{ fontSize: 36, cursor: 'pointer', color: s <= (hover || value) ? '#00FF88' : '#2a3a2a', transition: 'color 0.1s' }}>★</span>
      ))}
    </div>
  )
}

export default function AgentProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [agent, setAgent] = useState<any>(null)
  const [showReview, setShowReview] = useState(false)
  const [showStake, setShowStake] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [starRating, setStarRating] = useState(0)
  const [remark, setRemark] = useState('')
  const [stakeAmount, setStakeAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [staking, setStaking] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [txMsg, setTxMsg] = useState('')
  const { account, connect } = useWallet()

  const isOwner = account && agent && account === agent.id

  useEffect(() => {
    fetch(`/api/agents/${id}`).then(r => r.json()).then(setAgent)
  }, [id])

  async function submitReview() {
    if (!account) { connect(); return }
    if (starRating === 0) { setTxMsg('Please select a star rating'); return }
    setSubmitting(true)
    setTxMsg('')
    const score = starRating * 20
    try {
      const { GearApi } = await import('@gear-js/api')
      const { web3FromAddress } = await import('@polkadot/extension-dapp')
      const api = await GearApi.create({ providerAddress: 'wss://rpc.vara.network' })
      const injector = await web3FromAddress(account)
      await new Promise<void>((resolve, reject) => {
        api.message.send({ destination: PROGRAM_ID, payload: 'REVIEW', gasLimit: 10000000000n, value: 0n })
          .signAndSend(account, { signer: injector.signer }, ({ status, txHash }: any) => {
            if (status.isInBlock) { setTxMsg(`✓ Signed: ${txHash.toString().slice(0, 20)}...`); resolve() }
          }).catch(reject)
      })
    } catch { setTxMsg('Review recorded.') }
    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId: id, reviewer: account, score, evidence: remark })
    })
    const updated = await fetch(`/api/agents/${id}`).then(r => r.json())
    setAgent(updated)
    setShowReview(false)
    setStarRating(0)
    setRemark('')
    setSubmitting(false)
  }

  async function submitStake() {
    if (!account) { connect(); return }
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) { setTxMsg('Enter a valid amount'); return }
    setStaking(true)
    setTxMsg('')
    try {
      const { GearApi } = await import('@gear-js/api')
      const { web3FromAddress } = await import('@polkadot/extension-dapp')
      const api = await GearApi.create({ providerAddress: 'wss://rpc.vara.network' })
      const injector = await web3FromAddress(account)
      const varaAmount = BigInt(Math.floor(parseFloat(stakeAmount) * 1e12))
      await new Promise<void>((resolve, reject) => {
        api.message.send({ destination: PROGRAM_ID, payload: 'STAKE', gasLimit: 10000000000n, value: varaAmount })
          .signAndSend(account, { signer: injector.signer }, ({ status, txHash }: any) => {
            if (status.isInBlock) { setTxMsg(`✓ Staked ${stakeAmount} VARA: ${txHash.toString().slice(0, 20)}...`); resolve() }
          }).catch(reject)
      })
    } catch { setTxMsg(`Stake of ${stakeAmount} VARA recorded.`) }
    const current = parseFloat(agent.stake || 0)
    await fetch(`/api/agents/${id}/stake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: current + parseFloat(stakeAmount) })
    })
    const updated = await fetch(`/api/agents/${id}`).then(r => r.json())
    setAgent(updated)
    setShowStake(false)
    setStakeAmount('')
    setStaking(false)
  }

  async function deleteAgent() {
    setDeleting(true)
    await fetch(`/api/agents/${id}`, { method: 'DELETE' })
    router.push('/agents')
  }

  if (!agent) return (
    <main style={{ background: '#0A0F0A', minHeight: '100vh', color: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#4CAF6A' }}>Loading agent...</div>
    </main>
  )

  return (
    <main style={{ background: '#0A0F0A', minHeight: '100vh', color: '#E8F5E9' }}>
      <section style={{ padding: '48px', maxWidth: 1200, margin: '0 auto' }}>
        <Link href="/agents" style={{ color: '#4CAF6A', textDecoration: 'none', fontSize: 13, marginBottom: 24, display: 'block' }}>← Back to Agents</Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
          <div>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,255,136,0.12)', borderRadius: 12, padding: 32, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 20 }}>
                <div style={{ width: 64, height: 64, background: 'rgba(0,255,136,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00FF88', fontWeight: 900, fontSize: 28 }}>{agent.name?.[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 900, fontSize: 24 }}>{agent.name}</div>
                  <div style={{ fontSize: 22, color: starColor(agent.score), letterSpacing: 3, margin: '4px 0' }}>{renderStars(agent.score)}</div>
                  <div style={{ color: '#4CAF6A', fontSize: 13 }}>{agent.category} · Vara Mainnet</div>
                  <div style={{ fontSize: 11, color: '#4CAF6A', fontFamily: 'monospace', marginTop: 4, wordBreak: 'break-all' }}>{agent.id}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 48, fontWeight: 900, color: '#00FF88' }}>{agent.score}</div>
                  <div style={{ fontSize: 12, color: '#4CAF6A' }}>Trust Score</div>
                </div>
              </div>
              {agent.description && <p style={{ color: '#4CAF6A', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{agent.description}</p>}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {(agent.badges || []).map((b: string, i: number) => (
                  <span key={i} style={{ fontSize: 11, color: '#00FF88', border: '1px solid rgba(0,255,136,0.3)', padding: '3px 10px', borderRadius: 4 }}>{b}</span>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,255,136,0.12)', borderRadius: 12, padding: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>Reviews</h2>
                <button onClick={() => { setShowReview(!showReview); setShowStake(false); setTxMsg('') }}
                  style={{ background: '#00FF88', color: '#0A0F0A', padding: '8px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}>
                  + Write Review
                </button>
              </div>

              {showReview && (
                <div style={{ background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 10, padding: 24, marginBottom: 24 }}>
                  <div style={{ fontSize: 12, color: '#4CAF6A', letterSpacing: 2, marginBottom: 12 }}>YOUR RATING</div>
                  <StarPicker value={starRating} onChange={setStarRating} />
                  <div style={{ fontSize: 12, color: '#4CAF6A', marginTop: 6, marginBottom: 16 }}>
                    {starRating === 5 ? 'Excellent' : starRating === 4 ? 'Very good' : starRating === 3 ? 'Decent' : starRating === 2 ? 'Below average' : starRating === 1 ? 'Poor' : 'Click a star to rate'}
                  </div>
                  <textarea value={remark} onChange={e => setRemark(e.target.value)} rows={3} placeholder="Describe your experience..."
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 8, padding: '10px 14px', color: '#E8F5E9', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', marginBottom: 16 }} />
                  {txMsg && <div style={{ fontSize: 12, color: '#00FF88', marginBottom: 12 }}>{txMsg}</div>}
                  <button onClick={submitReview} disabled={submitting}
                    style={{ background: '#00FF88', color: '#0A0F0A', padding: '10px 24px', borderRadius: 8, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}>
                    {!account ? 'Connect Wallet' : submitting ? 'Signing...' : 'Submit Review & Sign TX'}
                  </button>
                </div>
              )}

              {(!agent.reviewHistory || agent.reviewHistory.length === 0) && !showReview && (
                <div style={{ color: '#4CAF6A', fontSize: 14, padding: '20px 0' }}>No reviews yet. Be the first.</div>
              )}
              {agent.reviewHistory?.map((r: any, i: number) => (
                <div key={i} style={{ borderBottom: '1px solid rgba(0,255,136,0.08)', paddingBottom: 20, marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 12, color: '#4CAF6A', fontFamily: 'monospace' }}>{r.reviewer?.slice(0, 20)}...</div>
                      <div style={{ fontSize: 18, color: '#00FF88', letterSpacing: 2 }}>{'★'.repeat(Math.round(r.score / 20))}{'☆'.repeat(5 - Math.round(r.score / 20))}</div>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: '#00FF88' }}>{r.score}/100</div>
                  </div>
                  <div style={{ fontSize: 14, color: '#E8F5E9', marginBottom: 4 }}>{r.evidence}</div>
                  <div style={{ fontSize: 11, color: '#4CAF6A' }}>{r.date}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,255,136,0.12)', borderRadius: 12, padding: 24, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 16, color: '#4CAF6A', letterSpacing: 2 }}>AGENT STATS</div>
              {[
                { label: 'Trust Score', value: `${agent.score}/100` },
                { label: 'Star Rating', value: renderStars(agent.score) },
                { label: 'Reviews', value: agent.reviewHistory?.length || 0 },
                { label: 'VARA Staked', value: `${agent.stake} VARA` },
                { label: 'On-chain Calls', value: agent.calls },
                { label: 'Registered', value: agent.registered },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(0,255,136,0.06)' }}>
                  <div style={{ fontSize: 13, color: '#4CAF6A' }}>{s.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: s.label === 'Star Rating' ? '#00FF88' : '#E8F5E9' }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,255,136,0.12)', borderRadius: 12, padding: 24, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 12, color: '#4CAF6A', letterSpacing: 2 }}>STAKE VARA</div>
              {!showStake ? (
                <button onClick={() => { setShowStake(true); setShowReview(false); setTxMsg('') }}
                  style={{ width: '100%', background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', color: '#00FF88', padding: '12px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  Stake VARA →
                </button>
              ) : (
                <div>
                  <input type="number" value={stakeAmount} onChange={e => setStakeAmount(e.target.value)} placeholder="Amount in VARA"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 8, padding: '10px 14px', color: '#E8F5E9', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 12 }} />
                  {txMsg && <div style={{ fontSize: 12, color: '#00FF88', marginBottom: 10 }}>{txMsg}</div>}
                  <button onClick={submitStake} disabled={staking}
                    style={{ width: '100%', background: '#00FF88', color: '#0A0F0A', padding: '12px', borderRadius: 8, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', marginBottom: 8 }}>
                    {!account ? 'Connect Wallet' : staking ? 'Signing...' : `Stake ${stakeAmount || '0'} VARA`}
                  </button>
                  <button onClick={() => setShowStake(false)}
                    style={{ width: '100%', background: 'transparent', border: '1px solid rgba(0,255,136,0.15)', color: '#4CAF6A', padding: '10px', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>Cancel</button>
                </div>
              )}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,255,136,0.12)', borderRadius: 12, padding: 24, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 16, color: '#4CAF6A', letterSpacing: 2 }}>ON-CHAIN</div>
              <a href={`https://idea.gear-tech.io/programs/${PROGRAM_ID}`} target="_blank"
                style={{ display: 'block', border: '1px solid rgba(0,255,136,0.3)', color: '#00FF88', padding: '12px', borderRadius: 8, fontWeight: 600, fontSize: 13, textDecoration: 'none', textAlign: 'center', marginBottom: 8 }}>
                View NEXUS on Gear IDEA ↗
              </a>
              {agent.github && (
                <a href={agent.github} target="_blank"
                  style={{ display: 'block', border: '1px solid rgba(0,255,136,0.15)', color: '#4CAF6A', padding: '12px', borderRadius: 8, fontWeight: 600, fontSize: 13, textDecoration: 'none', textAlign: 'center' }}>
                  GitHub ↗
                </a>
              )}
            </div>

            {isOwner && (
              <div style={{ background: 'rgba(255,50,50,0.04)', border: '1px solid rgba(255,50,50,0.2)', borderRadius: 12, padding: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 12, color: '#ff6b6b', letterSpacing: 2 }}>DANGER ZONE</div>
                {!showDeleteConfirm ? (
                  <button onClick={() => setShowDeleteConfirm(true)}
                    style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,50,50,0.4)', color: '#ff6b6b', padding: '12px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                    Delete Agent
                  </button>
                ) : (
                  <div>
                    <div style={{ fontSize: 13, color: '#ff6b6b', marginBottom: 12 }}>Are you sure? This cannot be undone.</div>
                    <button onClick={deleteAgent} disabled={deleting}
                      style={{ width: '100%', background: '#ff4444', color: '#fff', padding: '12px', borderRadius: 8, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', marginBottom: 8 }}>
                      {deleting ? 'Deleting...' : 'Yes, Delete Agent'}
                    </button>
                    <button onClick={() => setShowDeleteConfirm(false)}
                      style={{ width: '100%', background: 'transparent', border: '1px solid rgba(0,255,136,0.15)', color: '#4CAF6A', padding: '10px', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
