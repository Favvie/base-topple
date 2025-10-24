# USDC Faucet - Base Network

Full-stack decentralized faucet application for distributing USDC tokens on Base network.

## 🏗️ Project Structure
```
├── contracts/          # Smart contracts (Solidity)
├── scripts/           # Deployment scripts
├── faucet-frontend/   # Next.js frontend with WalletConnect
└── hardhat.config.js  # Hardhat configuration
```

## 📦 Components

### Smart Contracts
- **Faucet Contract**: `0x9b3fF4b7CFcAF3Be70bc9063223C9c13da547E1F`
- **USDC Token**: `0x83a8DA50273da93d192d7335dceBF06Bc9C35Ea1`
- **Network**: Base Mainnet
- **Verified**: ✅ [View on BaseScan](https://basescan.org/address/0x9b3fF4b7CFcAF3Be70bc9063223C9c13da547E1F)

### Frontend
- Next.js 14 with TypeScript
- WalletConnect (Reown AppKit) integration
- Tailwind CSS for styling
- Real-time balance tracking
- 24-hour claim cooldown

## 🚀 Quick Start

### Deploy Contracts
```bash
npm install
npx hardhat run scripts/deploy.js --network base
```

### Run Frontend
```bash
cd faucet-frontend
npm install
npm run dev
```

## 🛠️ Built With
- Solidity
- Hardhat
- Next.js
- TypeScript
- Ethers.js v6
- WalletConnect
- Tailwind CSS

## 📄 License
MIT