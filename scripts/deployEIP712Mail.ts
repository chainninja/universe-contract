import { ethers } from "hardhat";

async function main() {
  const eip712ContractFactory = await ethers.getContractFactory("EIP712Mail");
  const managerContract = await eip712ContractFactory.deploy();

  await managerContract.deployed();
  console.log("Contract Deployed to:", managerContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
