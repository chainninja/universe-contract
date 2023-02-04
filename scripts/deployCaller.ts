import { ethers } from "hardhat";

async function main() {
  const receiverFactory = await ethers.getContractFactory("Receiver");
  const receiverContract = await receiverFactory.deploy();
  await receiverContract.deployed();
  console.log("Receiver Contract Deployed to:", receiverContract.address);

  const callerContractFactory = await ethers.getContractFactory("Caller");
  const callerContract = await callerContractFactory.deploy();

  await callerContract.deployed();
  console.log("Caller Contract Deployed to:", callerContract.address);
  await callerContract.testCallFoo(receiverContract.address);
  await callerContract.testCallDoesNotExist(receiverContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
