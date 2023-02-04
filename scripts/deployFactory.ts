import { ethers } from "hardhat";

async function main() {
  const factory = await ethers.getContractFactory("DeterministicDeployFactory");
  const contract = await factory.deploy();

  await contract.deployed();
  console.log("Contract Deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
