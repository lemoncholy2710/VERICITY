const fs = require("fs");
const path = require("path");
const { ethers, network } = require("hardhat");

// Day 1 midday: deploy locally on the Hardhat in-memory network.
// Day 1 afternoon: deploy to the public Sepolia testnet with a funded wallet.
//   npx hardhat run scripts/deploy.js --network hardhat   (local)
//   npx hardhat run scripts/deploy.js --network sepolia   (public testnet)
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Network:", network.name);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", ethers.formatEther(balance), "ETH");

  // The backend wallet is who's authorized to call logEvent(). For the
  // MVP demo it's simplest to make the deployer itself the backend wallet.
  const backendAddress = deployer.address;

  const ComplaintRegistry = await ethers.getContractFactory("ComplaintRegistry");
  const registry = await ComplaintRegistry.deploy(backendAddress);
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log("ComplaintRegistry deployed to:", address);
  console.log("Backend wallet set to:", backendAddress);

  // Save the address + ABI somewhere the backend team (feature/backend-ai)
  // can read from once you two sync up (see the SYNC POINT note in
  // ComplaintRegistry.sol).
  const artifact = await require("hardhat").artifacts.readArtifact("ComplaintRegistry");
  const deploymentInfo = {
    network: network.name,
    address,
    backend: backendAddress,
    deployedAt: new Date().toISOString(),
    abi: artifact.abi,
  };

  const outDir = path.join(__dirname, "..", "deployments");
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `${network.name}.json`);
  fs.writeFileSync(outFile, JSON.stringify(deploymentInfo, null, 2));
  console.log("Saved deployment info to:", outFile);

  if (network.name === "sepolia") {
    console.log(
      "\nView it on the explorer: https://sepolia.etherscan.io/address/" + address
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
