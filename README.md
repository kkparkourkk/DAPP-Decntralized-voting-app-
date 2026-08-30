# Decentralized Voting DApp

## Backend (Solidity + Python/Ape)
    pip install -r requirements.txt
    ape plugins install solidity
    ape compile
    ape test
    ape run deploy --network ethereum:sepolia

## Frontend (React)
    cd frontend
    npm install
    npm run dev

Fill in CONTRACT_ADDRESS and CONTRACT_ABI in frontend/src/contractConfig.js
after deploying (address from deploy output, ABI from .build/Voting.json).
