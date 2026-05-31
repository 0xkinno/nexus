'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface WalletContextType {
  account: string | null
  accounts: any[]
  connecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType>({
  account: null,
  accounts: [],
  connecting: false,
  connect: async () => {},
  disconnect: () => {},
})

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null)
  const [accounts, setAccounts] = useState<any[]>([])
  const [connecting, setConnecting] = useState(false)

  async function connect() {
    setConnecting(true)
    try {
      const { web3Enable, web3Accounts } = await import('@polkadot/extension-dapp')
      await web3Enable('NEXUS')
      const allAccounts = await web3Accounts()
      setAccounts(allAccounts)
      if (allAccounts.length > 0) {
        setAccount(allAccounts[0].address)
      }
    } catch (e) {
      console.error('Wallet connection failed:', e)
    }
    setConnecting(false)
  }

  function disconnect() {
    setAccount(null)
    setAccounts([])
  }

  return (
    <WalletContext.Provider value={{ account, accounts, connecting, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext)