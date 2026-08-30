export const CONTRACT_ADDRESS = "0xYOUR_DEPLOYED_CONTRACT_ADDRESS";

export const CONTRACT_ABI = [
  "function addCandidate(string _name) external",
  "function vote(uint256 _candidateId) external",
  "function getCandidate(uint256 _candidateId) external view returns (uint256, string, uint256)",
  "function getAllResults() external view returns (tuple(uint256 id, string name, uint256 voteCount)[])",
  "function hasVoted(address) external view returns (bool)",
  "function timeRemaining() external view returns (uint256)",
  "function candidatesCount() external view returns (uint256)",
  "event VoteCast(address indexed voter, uint256 candidateId)",
  "event CandidateAdded(uint256 id, string name)"
];
