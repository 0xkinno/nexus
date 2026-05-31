import { Keyring } from '@polkadot/keyring'
import { mnemonicGenerate } from '@polkadot/util-crypto'
import { writeFileSync } from 'fs'

const keyring = new Keyring({ type: 'sr25519', ss58Format: 137 })
const wallets = []

for (let i = 0; i < 5; i++) {
  const mnemonic = mnemonicGenerate()
  const account = keyring.addFromMnemonic(mnemonic)
  wallets.push({ index: i + 1, address: account.address, mnemonic })
  console.log(`\nWallet ${i + 1}:`)
  console.log(`  Address:  ${account.address}`)
  console.log(`  Mnemonic: ${mnemonic}`)
}

writeFileSync('/root/nexus/scripts/wallets.json', JSON.stringify(wallets, null, 2))
console.log('\nSaved to ~/nexus/scripts/wallets.json')
