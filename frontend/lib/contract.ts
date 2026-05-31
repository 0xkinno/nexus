import { GearApi } from '@gear-js/api'

export const PROGRAM_ID = '0xc24415bd34b8ad998a91d57521beba4bffcf5afa6ed2e4b99264cbe78983384e'
export const NETWORK = 'wss://rpc.vara.network'

export async function getApi() {
  const api = await GearApi.create({ providerAddress: NETWORK })
  return api
}

export async function connectWallet() {
  const { web3Enable, web3Accounts } = await import('@polkadot/extension-dapp')
  const extensions = await web3Enable('NEXUS')
  if (extensions.length === 0) {
    throw new Error('No wallet extension found. Please install Polkadot.js or SubWallet.')
  }
  const accounts = await web3Accounts()
  return accounts
}