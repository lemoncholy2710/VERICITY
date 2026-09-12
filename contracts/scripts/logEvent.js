require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

// Day 1 evening: "Write a tiny Node.js/Python script (using ethers.js or
// web3.py) that calls logEvent from outside Hardhat, simulating what the
// backend will do."
//
// This deliberately does NOT use `require("hardhat")` — it's a plain
// ethers.js script, exactly like the real backend integration
// (backend/services/blockchain_client.py, once that exists on
// feature/backend-ai) would call this same contract from outside any
// Hardhat task.
//
// Usage:
//   node scripts/logEvent.js <complaintId> <newStatus>
//   node scripts/logEvent.js 1 SUBMITTED

async function main() {
  const [, , complaintIdArg, newStatusArg] = process.argv;
  const complaintId = complaintIdArg || process.env.SAMPLE_COMPLAINT_ID || "1";
  const newStatus = newStatusArg || "SUBMITTED";

  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!rpcUrl || !privateKey || !contractAddress) {
    throw new Error(
      "Missing SEPOLIA_RPC_URL, PRIVATE_KEY, or CONTRACT_ADDRESS in your .env file. " +
      "Fill these in after running scripts/deploy.js --network sepolia."
    );
  }

  const deploymentFile = path.join(__dirname, "..", "deployments", "sepolia.json");
  const { abi } = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const registry = new ethers.Contract(contractAddress, abi, wallet);

  console.log(`Calling logEvent(${complaintId}, "${newStatus}") as ${wallet.address}...`);

  const tx = await registry.logEvent(complaintId, newStatus);
  console.log("Transaction sent:", tx.hash);

  const receipt = await tx.wait();
  console.log("Confirmed in block:", receipt.blockNumber);
  console.log(`View on explorer: https://sepolia.etherscan.io/tx/${tx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
