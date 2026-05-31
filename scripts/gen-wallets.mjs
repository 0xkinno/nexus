import { Keyring } from '@polkadot/keyring'
import { mnemonicGenerate } from '@polkadot/util-crypto'

const keyring = new Keyring({ type: 'sr25519' })
const wallets = []

for (let i = 0; i < 5; i++) {
  const mnemonic = mnemonicGenerate()
  const account = keyring.addFromMnemonic(mnemonic)
  wallets.push({ index: i + 1, address: account.address, mnemonic })
  console.log(`\nWallet ${i + 1}:`)
  console.log(`  Address:  ${account.address}`)
  console.log(`  Mnemonic: ${mnemonic}`)
}

import { writeFileSync } from 'fs'
writeFileSync('/root/nexus/scripts/wallets.json', JSON.stringify(wallets, null, 2))
console.log('\nSaved to ~/nexus/scripts/wallets.json')
