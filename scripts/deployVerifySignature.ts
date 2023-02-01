import { ethers } from "hardhat";

async function main() {
  const verifySignatureContractFactory = await ethers.getContractFactory(
    "VerifySignature"
  );
  const contract = await verifySignatureContractFactory.deploy();

  await contract.deployed();
  console.log("Contract Deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
