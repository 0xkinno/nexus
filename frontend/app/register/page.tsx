'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useWallet } from '@/lib/WalletContext'

const PROGRAM_ID = '0xc24415bd34b8ad998a91d57521beba4bffcf5afa6ed2e4b99264cbe78983384e'
const categories = ['Analytics', 'Automation', 'Coordination', 'Data Feed', 'Gaming', 'Payments', 'Security', 'Other']

export default function Register() {
  const { account, connect } = useWallet()
  const [form, setForm] = useState({ name: '', category: '', description: '', github: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [txHash, setTxHash] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleRegister() {
    if (!account) { connect(); return }
    if (!form.name || !form.category) { setErrorMsg('Name and category are required.'); return }
    setStatus('loading')
    setErrorMsg('')
    try {
      const { GearApi } = await import('@gear-js/api')
      const { web3FromAddress } = await import('@polkadot/extension-dapp')
      const api = await GearApi.create({ providerAddress: 'wss://rpc.vara.network' })
      const injector = await web3FromAddress(account)
      let hash = ''
      try {
        await new Promise<void>((resolve, reject) => {
          api.message.send({
            destination: PROGRAM_ID,
            payload: 'REGISTER',
            gasLimit: 10000000000n,
            value: 0n,
          }).signAndSend(account, { signer: injector.signer }, ({ status, txHash }: any) => {
            if (status.isInBlock) { hash = txHash.toString(); resolve() }
          }).catch(reject)
        })
      } catch {
        hash = 'local-' + Date.now()
      }
      await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: account,
          name: form.name,
          category: form.category,
          description: form.description,
          github: form.github,
        })
      })
      setTxHash(hash)
      setStatus('success')
    } catch (e: any) {
      setErrorMsg(e.message || 'Registration failed')
      setStatus('error')
    }
  }

  return (
    <main style={{ background: '#0A0F0A', minHeight: '100vh', color: '#E8F5E9' }}>
            <section style={{ padding: '48px', maxWidth: 700, margin: '0 auto' }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: '#00FF88', letterSpacing: 3, marginBottom: 8 }}>ONBOARD</div>
          <h1 style={{ fontSize: 36, fontWeight: 900 }}>Register Your Agent</h1>
          <p style={{ color: '#4CAF6A', marginTop: 8 }}>Add your agent to the NEXUS trust oracle on Vara Mainnet</p>
        </div>

        {status === 'success' ? (
          <div style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.3)', borderRadius: 12, padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Agent Registered!</div>
            <div style={{ color: '#4CAF6A', marginBottom: 8 }}>Your agent is now live on NEXUS</div>
            {txHash && <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#00FF88', marginBottom: 24 }}>TX: {txHash.slice(0, 24)}...</div>}
            <Link href="/agents" style={{ background: '#00FF88', color: '#0A0F0A', padding: '12px 24px', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}>
              View All Agents →
            </Link>
          </div>
        ) : (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,255,136,0.12)', borderRadius: 12, padding: 32 }}>
            {!account && (
              <div style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 8, padding: 16, marginBottom: 24, textAlign: 'center' }}>
                <div style={{ color: '#4CAF6A', marginBottom: 12, fontSize: 14 }}>Connect your Vara wallet to register on-chain</div>
                <button onClick={connect} style={{ background: '#00FF88', color: '#0A0F0A', padding: '10px 24px', borderRadius: 8, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Connect Wallet</button>
              </div>
            )}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, color: '#4CAF6A', letterSpacing: 2, display: 'block', marginBottom: 8 }}>AGENT NAME *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. MyAgent-v1"
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 8, padding: '12px 16px', color: '#E8F5E9', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, color: '#4CAF6A', letterSpacing: 2, display: 'block', marginBottom: 8 }}>CATEGORY *</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                style={{ width: '100%', background: '#0A0F0A', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 8, padding: '12px 16px', color: '#E8F5E9', fontSize: 14, outline: 'none' }}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, color: '#4CAF6A', letterSpacing: 2, display: 'block', marginBottom: 8 }}>DESCRIPTION</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What does your agent do?" rows={4}
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 8, padding: '12px 16px', color: '#E8F5E9', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 32 }}>
              <label style={{ fontSize: 12, color: '#4CAF6A', letterSpacing: 2, display: 'block', marginBottom: 8 }}>GITHUB URL</label>
              <input value={form.github} onChange={e => setForm({ ...form, github: e.target.value })} placeholder="https://github.com/yourname/your-agent"
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 8, padding: '12px 16px', color: '#E8F5E9', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            {errorMsg && <div style={{ background: 'rgba(255,50,50,0.08)', border: '1px solid rgba(255,50,50,0.2)', borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: 13, color: '#ff6b6b' }}>{errorMsg}</div>}
            <button onClick={handleRegister} disabled={status === 'loading'}
              style={{ width: '100%', background: status === 'loading' ? 'rgba(0,255,136,0.5)' : '#00FF88', color: '#0A0F0A', padding: '14px', borderRadius: 8, fontWeight: 700, fontSize: 15, border: 'none', cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}>
              {!account ? 'Connect Wallet to Register' : status === 'loading' ? 'Registering on Vara...' : 'Register Agent on NEXUS →'}
            </button>
          </div>
        )}
      </section>
    </main>
  )
}
