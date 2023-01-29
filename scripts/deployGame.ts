import { ethers } from "hardhat";

async function main() {
  const gameContractFactory = await ethers.getContractFactory('MyEpicGame');
  const gameContract = await gameContractFactory.deploy();
  await gameContract.deployed();
  console.log("Contract Deployed to:", gameContract.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
