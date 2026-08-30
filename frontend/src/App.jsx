import { useState, useEffect, useCallback } from "react";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contractConfig";

export default function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setStatus("MetaMask not found. Please install it.");
      return;
    }
    try {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const votingContract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      setAccount(address);
      setContract(votingContract);
      setStatus("Wallet connected.");
    } catch (err) {
      setStatus("Connection failed: " + err.message);
    }
  };

  const loadResults = useCallback(async () => {
    if (!contract) return;
    try {
      const results = await contract.getAllResults();
      setCandidates(results);

      if (account) {
        const voted = await contract.hasVoted(account);
        setHasVoted(voted);
      }

      const remaining = await contract.timeRemaining();
      setTimeLeft(Number(remaining));
    } catch (err) {
      console.error(err);
    }
  }, [contract, account]);

  useEffect(() => {
    loadResults();
  }, [loadResults]);

  useEffect(() => {
    if (!contract) return;
    const onVote = () => loadResults();
    contract.on("VoteCast", onVote);
    return () => contract.off("VoteCast", onVote);
  }, [contract, loadResults]);

  const castVote = async (candidateId) => {
    if (!contract) return;
    setLoading(true);
    setStatus("Submitting vote...");
    try {
      const tx = await contract.vote(candidateId);
      await tx.wait();
      setStatus("Vote confirmed!");
      setHasVoted(true);
      loadResults();
    } catch (err) {
      setStatus("Vote failed: " + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    if (seconds <= 0) return "Voting closed";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s remaining`;
  };

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Decentralized Voting</h1>

      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <p>Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
      )}

      {timeLeft !== null && <p>{formatTime(timeLeft)}</p>}
      {status && <p style={{ color: "#555" }}>{status}</p>}

      <h2>Candidates</h2>
      {candidates.length === 0 && <p>No candidates yet.</p>}

      {candidates.map((c) => (
        <div
          key={Number(c.id)}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 12,
            marginBottom: 8,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <strong>{c.name}</strong>
            <div>{Number(c.voteCount)} votes</div>
          </div>
          <button
            disabled={!account || hasVoted || loading || timeLeft <= 0}
            onClick={() => castVote(c.id)}
          >
            Vote
          </button>
        </div>
      ))}

      {hasVoted && <p>You have already voted. Thank you!</p>}
    </div>
  );
}
