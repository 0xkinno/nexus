import { GearApi } from '@gear-js/api'
import { Keyring } from '@polkadot/keyring'
import { readFileSync } from 'fs'

const PROGRAM_ID = '0xc24415bd34b8ad998a91d57521beba4bffcf5afa6ed2e4b99264cbe78983384e'
const NETWORK = 'wss://rpc.vara.network'
const MESSAGES_PER_WALLET = 6

async function sendMessage(api, account, walletIndex, msgIndex) {
  return new Promise((resolve) => {
    api.message.send({
      destination: PROGRAM_ID,
      payload: 'PING',
      gasLimit: 10000000000n,
      value: 0n,
    }).signAndSend(account, ({ status, txHash }) => {
      if (status.isInBlock) {
        console.log(`  ✓ Wallet ${walletIndex} | Msg ${msgIndex} | TX: ${txHash.toString().slice(0, 20)}...`)
        resolve(true)
      }
    }).catch(err => {
      console.log(`  ✗ Wallet ${walletIndex} | Msg ${msgIndex} | Failed: ${err.message}`)
      resolve(false)
    })
  })
}

async function main() {
  const wallets = JSON.parse(readFileSync('/root/nexus/scripts/wallets.json', 'utf8'))

  console.log('Connecting to Vara Mainnet...')
  const api = await GearApi.create({ providerAddress: NETWORK })
  console.log('Connected.\n')

  const keyring = new Keyring({ type: 'sr25519', ss58Format: 137 })
  let totalSent = 0

  for (const w of wallets) {
    const account = keyring.addFromMnemonic(w.mnemonic)
    console.log(`\nWallet ${w.index}: ${w.address}`)

    for (let m = 1; m <= MESSAGES_PER_WALLET; m++) {
      const ok = await sendMessage(api, account, w.index, m)
      if (ok) totalSent++
      await new Promise(r => setTimeout(r, 3000))
    }
  }

  console.log(`\n✅ Done. ${totalSent} messages sent to NEXUS from ${wallets.length} unique addresses.`)
  process.exit(0)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
