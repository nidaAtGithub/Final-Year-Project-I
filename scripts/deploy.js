const hre = require("hardhat");

async function main() {
  const FIRRegistry = await hre.ethers.getContractFactory("FIRRegistry");
  const firRegistry = await FIRRegistry.deploy();

  await firRegistry.waitForDeployment();  // ✅ correct for ethers v6

  const address = await firRegistry.getAddress();

  console.log("FIRRegistry deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
