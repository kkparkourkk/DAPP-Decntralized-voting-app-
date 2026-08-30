# Decentralized Voting DApp

A decentralized voting application built on the Ethereum blockchain (Sepolia testnet). Votes are recorded on-chain, making them transparent and tamper-proof. Built with Solidity smart contracts, Python (Ape Framework) for contract deployment, and a React frontend for the voting interface.

## Features

- Smart contract enforces one vote per wallet address
- Admin-only candidate management
- Time-bound voting window
- Live results fetched directly from the blockchain
- MetaMask wallet integration with auto network switching to Sepolia

## Tech Stack

- **Smart Contract:** Solidity
- **Contract Tooling:** Python, Ape Framework
- **Frontend:** React, Vite, ethers.js
- **Network:** Ethereum Sepolia Testnet

## Project Structure

```
project/
├── contracts/
│   ├── Voting.sol
│   └── openzeppelin/
│       ├── access/Ownable.sol
│       └── utils/Context.sol
├── scripts/
│   ├── deploy.py
│   └── add_candidate.py
├── tests/
│   └── test_voting.py
├── ape-config.yaml
├── requirements.txt
├── .env.example
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── contractConfig.js
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Prerequisites

Before you start, install the following on your PC:

- **Python 3.11** (recommended — newer versions like 3.13/3.14 can cause dependency issues)
- **Node.js and npm** (v18 or higher)
- **MetaMask** browser extension ([metamask.io](https://metamask.io))
- **Microsoft Visual C++ Build Tools** (Windows only, needed to compile some Python packages) — install the "Desktop development with C++" workload from the Visual Studio Installer

## Setup Instructions

### 1. Clone the repository

```
git clone <your-repo-url>
cd voting-dapp/project
```

### 2. Set up the Python environment

```
python -m venv venv
```

Activate it:

- Windows: `venv\Scripts\activate`
- Mac/Linux: `source venv/bin/activate`

Install dependencies:

```
pip install -r requirements.txt
```

### 3. Install the Solidity compiler plugin

```
ape plugins install solidity
```

### 4. Configure environment variables

Copy `.env.example` to `.env`:

```
cp .env.example .env
```

Open `.env` and add your own Sepolia RPC URL (get a free one from [Alchemy](https://www.alchemy.com/) or [Infura](https://infura.io/)):

```
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key
```

### 5. Import your wallet into Ape

```
ape accounts import voting_deployer
```

Paste your MetaMask private key when prompted (Account Details > Export Private Key in MetaMask). Never share this key or commit it anywhere.

### 6. Get free Sepolia test ETH

You'll need test ETH to pay gas fees for deploying and voting.

- Switch MetaMask to the Sepolia network
- Copy your wallet address
- Visit a Sepolia faucet (the Google Cloud Web3 faucet works reliably) and paste your address to request free test ETH
- Wait a minute or two for it to arrive in your wallet

### 7. Compile the smart contract

```
ape compile
```

### 8. Run the tests

```
ape test
```

All 6 tests should pass, confirming the voting logic works correctly.

### 9. Deploy the contract to Sepolia

```
ape run deploy --network ethereum:sepolia
```

This prints the deployed contract address in the terminal. Copy it.

### 10. Add candidates

Open `scripts/add_candidate.py`, update the `contract_address` variable with your deployed address, then run:

```
ape run add_candidate --network ethereum:sepolia
```

### 11. Update the frontend config

Open `frontend/src/contractConfig.js` and set:

```
CONTRACT_ADDRESS = "your deployed contract address"
```

The `CONTRACT_ABI` should already be included, but if you redeploy after changing the contract, regenerate the ABI from `.build/__local__.json` and paste it in.

### 12. Run the frontend locally

```
cd frontend
npm install
npm run dev
```

Open the local URL shown in the terminal (usually `http://localhost:5173`) in a browser with MetaMask installed.

## How to Vote

1. Click **Connect Wallet** — MetaMask will prompt you to approve the connection and switch to Sepolia
2. View the live candidate list and vote counts
3. Click **Vote** next to your chosen candidate
4. Confirm the transaction in MetaMask
5. Wait a few seconds for the transaction to confirm — your vote count will update

Each wallet address can only vote once. Voting is only allowed within the time window set when the contract was deployed.

## Deploying the Frontend Publicly

To let other people vote from their own devices (not just your PC), host the frontend using a service like Vercel, Netlify, or Render. The smart contract is already public on Sepolia, so only the frontend needs to be hosted — no backend server required.

Voters will need MetaMask installed and a small amount of free Sepolia test ETH to vote.

## Notes

- This project runs on Sepolia testnet, not the Ethereum mainnet — no real money is involved
- Never commit your `.env` file or private keys to GitHub
- If you redeploy the contract, remember to update `CONTRACT_ADDRESS` in `frontend/src/contractConfig.js` and re-add candidates

## About

This project was built as a learning exercise to explore blockchain development end-to-end: writing and testing a Solidity smart contract, deploying it to a live testnet, and building a working frontend that lets real wallets interact with it. It demonstrates core Web3 concepts like on-chain state, wallet-based identity, and gas fees, using a simple and relatable use case: voting.

## License

This project is open source and available under the MIT License. Feel free to use, modify, and build on it for your own learning or projects.
