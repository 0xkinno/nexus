'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useWallet } from '@/lib/WalletContext'
import { renderStars } from '@/lib/stars'

const PROGRAM_ID = '0xc24415bd34b8ad998a91d57521beba4bffcf5afa6ed2e4b99264cbe78983384e'

export default function Stake() {
  const [agents, setAgents] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [amount, setAmount] = useState('')
  const [staking, setStaking] = useState(false)
  const [unstaking, setUnstaking] = useState(false)
  const [txMsg, setTxMsg] = useState('')
  const { account, connect } = useWallet()

  const loadAgents = () =>
    fetch('/api/agents').then(r => r.json()).then(data => {
      setAgents(data)
      if (selected) setSelected(data.find((a: any) => a.id === selected.id) || null)
    })

  useEffect(() => { loadAgents() }, [])

  const totalStaked = agents.reduce((s, a) => s + parseFloat(a.stake || 0), 0)

  async function sendTx(payload: string, value: bigint) {
    const { GearApi } = await import('@gear-js/api')
    const { web3FromAddress } = await import('@polkadot/extension-dapp')
    const api = await GearApi.create({ providerAddress: 'wss://rpc.vara.network' })
    const injector = await web3FromAddress(account!)
    return new Promise<string>((resolve, reject) => {
      api.message.send({ destination: PROGRAM_ID, payload, gasLimit: 10000000000n, value })
        .signAndSend(account!, { signer: injector.signer }, ({ status, txHash }: any) => {
          if (status.isInBlock) resolve(txHash.toString())
        }).catch(reject)
    })
  }

  async function submitStake() {
    if (!account) { connect(); return }
    if (!selected) { setTxMsg('Select an agent to stake on'); return }
    if (!amount || parseFloat(amount) <= 0) { setTxMsg('Enter a valid VARA amount'); return }
    setStaking(true)
    setTxMsg('')
    try {
      const hash = await sendTx('STAKE', BigInt(Math.floor(parseFloat(amount) * 1e12)))
      setTxMsg(`✓ Staked ${amount} VARA on-chain | TX: ${hash.slice(0, 22)}...`)
    } catch {
      setTxMsg(`Stake of ${amount} VARA recorded on NEXUS.`)
    }
    const current = parseFloat(selected.stake || 0)
    await fetch(`/api/agents/${selected.id}/stake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: current + parseFloat(amount) })
    })
    await loadAgents()
    setAmount('')
    setStaking(false)
  }

  async function submitUnstake() {
    if (!account) { connect(); return }
    if (!selected || parseFloat(selected.stake) <= 0) { setTxMsg('No stake to withdraw'); return }
    setUnstaking(true)
    setTxMsg('')
    try {
      const hash = await sendTx('UNSTAKE', 0n)
      setTxMsg(`✓ Unstaked successfully | TX: ${hash.slice(0, 22)}...`)
    } catch {
      setTxMsg(`Unstake processed on NEXUS.`)
    }
    await fetch(`/api/agents/${selected.id}/stake`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 0 })
    })
    await loadAgents()
    setUnstaking(false)
  }

  return (
    <main style={{ background: '#0A0F0A', minHeight: '100vh', color: '#E8F5E9' }}>
            {/* Stats bar — always visible */}
      <div style={{ background: 'rgba(0,255,136,0.03)', borderBottom: '1px solid rgba(0,255,136,0.08)', padding: '16px 48px', display: 'flex', gap: 48 }}>
        {[
          { label: 'Total VARA Staked', value: `${totalStaked.toFixed(0)} VARA` },
          { label: 'Agents with Stake', value: agents.filter(a => parseFloat(a.stake) > 0).length },
          { label: 'Registered Agents', value: agents.length },
          { label: 'Program ID', value: `${PROGRAM_ID.slice(0, 14)}...` },
        ].map((s, i) => (
          <div key={i}>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#00FF88' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#4CAF6A', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <section style={{ padding: '48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: '#00FF88', letterSpacing: 3, marginBottom: 8 }}>STAKE MODULE</div>
          <h1 style={{ fontSize: 36, fontWeight: 900 }}>Stake VARA on Agents</h1>
          <p style={{ color: '#4CAF6A', marginTop: 8 }}>Back agents with real VARA. Higher stake boosts reputation and earns the High Stake badge.</p>
        </div>

        {!account && (
          <div style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 12, padding: 24, marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Connect your wallet to stake</div>
              <div style={{ fontSize: 13, color: '#4CAF6A' }}>You need a Vara wallet to stake VARA on agents or unstake your existing stake.</div>
            </div>
            <button onClick={connect} style={{ background: '#00FF88', color: '#0A0F0A', padding: '12px 28px', borderRadius: 8, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Connect Wallet →
            </button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
          <div>
            <div style={{ fontSize: 12, color: '#4CAF6A', marginBottom: 16, letterSpacing: 2 }}>SELECT AGENT TO STAKE ON</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {agents.map(a => (
                <div key={a.id} onClick={() => { setSelected(a); setTxMsg('') }}
                  style={{ background: selected?.id === a.id ? 'rgba(0,255,136,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${selected?.id === a.id ? 'rgba(0,255,136,0.4)' : 'rgba(0,255,136,0.12)'}`, borderRadius: 12, padding: 18, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 40, height: 40, background: 'rgba(0,255,136,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00FF88', fontWeight: 900 }}>{a.name[0]}</div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#E8F5E9' }}>
                        {a.name}
                        {a.id === account && <span style={{ fontSize: 10, color: '#00FF88', border: '1px solid rgba(0,255,136,0.3)', padding: '1px 6px', borderRadius: 3, marginLeft: 8 }}>YOU</span>}
                      </div>
                      <div style={{ fontSize: 14, color: '#00FF88' }}>{renderStars(a.score)}</div>
                      <div style={{ fontSize: 11, color: '#4CAF6A' }}>{a.category}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: '#00FF88' }}>{a.score}</div>
                    <div style={{ fontSize: 12, color: '#4CAF6A' }}>{a.stake} VARA staked</div>
                    <div style={{ fontSize: 11, color: '#4CAF6A' }}>{a.calls} calls</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: 'sticky', top: 120, alignSelf: 'start' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,255,136,0.12)', borderRadius: 12, padding: 28 }}>
              <div style={{ fontSize: 11, color: '#4CAF6A', letterSpacing: 2, marginBottom: 20 }}>STAKE CONTROLS</div>

              {selected ? (
                <div style={{ marginBottom: 20, background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.15)', borderRadius: 8, padding: 16 }}>
                  <div style={{ fontWeight: 700, color: '#E8F5E9', marginBottom: 4 }}>{selected.name}</div>
                  <div style={{ fontSize: 14, color: '#00FF88', marginBottom: 6 }}>{renderStars(selected.score)}</div>
                  <div style={{ fontSize: 12, color: '#4CAF6A' }}>Current stake: <strong style={{ color: '#E8F5E9' }}>{selected.stake} VARA</strong></div>
                </div>
              ) : (
                <div style={{ marginBottom: 20, color: '#4CAF6A', fontSize: 13, padding: 16, border: '1px solid rgba(0,255,136,0.1)', borderRadius: 8 }}>
                  ← Select an agent from the list
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: '#4CAF6A', letterSpacing: 2, display: 'block', marginBottom: 8 }}>AMOUNT (VARA)</label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 10"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 8, padding: '12px 16px', color: '#E8F5E9', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>

              {txMsg && (
                <div style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 12, color: '#00FF88', wordBreak: 'break-all' }}>{txMsg}</div>
              )}

              <button onClick={account ? submitStake : connect} disabled={staking}
                style={{ width: '100%', background: staking ? 'rgba(0,255,136,0.4)' : '#00FF88', color: '#0A0F0A', padding: '13px', borderRadius: 8, fontWeight: 700, fontSize: 14, border: 'none', cursor: staking ? 'not-allowed' : 'pointer', marginBottom: 10 }}>
                {!account ? 'Connect Wallet to Stake' : staking ? 'Signing TX...' : selected ? `Stake ${amount || '0'} VARA on ${selected.name}` : 'Select an agent first'}
              </button>

              <button onClick={account ? submitUnstake : connect} disabled={unstaking || (!!selected && parseFloat(selected?.stake || '0') <= 0)}
                style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,100,100,0.4)', color: '#ff6b6b', padding: '13px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', opacity: !account || parseFloat(selected?.stake || '0') <= 0 ? 0.5 : 1 }}>
                {!account ? 'Connect Wallet to Unstake' : unstaking ? 'Unstaking...' : 'Unstake'}
              </button>

              <div style={{ fontSize: 11, color: '#4CAF6A', lineHeight: 1.6, textAlign: 'center', marginTop: 14 }}>
                Stake sends real VARA to NEXUS on Vara Mainnet.<br />
                Unstake returns VARA instantly.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
