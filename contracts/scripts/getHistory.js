require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

// Day 2 evening: "Write a tiny script or use a block explorer link to pull
// the full on-chain event history for one complaintId, to demo 'immutable
// audit trail' live."
//
// Usage:
//   node scripts/getHistory.js <complaintId>
//   node scripts/getHistory.js 1

async function main() {
  const [, , complaintIdArg] = process.argv;
  const complaintId = complaintIdArg || process.env.SAMPLE_COMPLAINT_ID || "1";

  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  const contractAddress = process.env.CONTRACT_ADDRESS;

  if (!rpcUrl || !contractAddress) {
    throw new Error(
      "Missing SEPOLIA_RPC_URL or CONTRACT_ADDRESS in your .env file. " +
      "Fill these in after running scripts/deploy.js --network sepolia."
    );
  }

  const deploymentFile = path.join(__dirname, "..", "deployments", "sepolia.json");
  const { abi, deployedAt } = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const registry = new ethers.Contract(contractAddress, abi, provider);

  console.log(`Fetching StatusChanged history for complaint #${complaintId}...`);

  // Filter on the indexed complaintId so we only get this complaint's events,
  // searching from the contract's deployment block onward.
  const filter = registry.filters.StatusChanged(complaintId);
  const events = await registry.queryFilter(filter, 0, "latest");

  if (events.length === 0) {
    console.log("No on-chain history found for this complaint id yet.");
    return;
  }

  console.log(`Found ${events.length} transition(s):\n`);
  for (const event of events) {
    const { oldStatus, newStatus, timestamp } = event.args;
    const when = new Date(Number(timestamp) * 1000).toISOString();
    console.log(
      `  ${when}  ${oldStatus || "(none)"} -> ${newStatus}  ` +
      `[tx: https://sepolia.etherscan.io/tx/${event.transactionHash}]`
    );
  }

  console.log(`\nContract deployed: ${deployedAt}`);
  console.log(`Full contract history: https://sepolia.etherscan.io/address/${contractAddress}#events`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
