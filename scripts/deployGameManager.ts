import { ethers } from "hardhat";

async function main() {
  //Local
  // const GameContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  // Goerli:
  const GameContractAddress = "0x3a1a9231656f4818ddd1c13518b752ccbff8e95B";

  const managerContractFactory = await ethers.getContractFactory(
    "EpicGameManager"
  );
  const managerContract = await managerContractFactory.deploy(
    GameContractAddress
  );

  await managerContract.deployed();
  console.log("Contract Deployed to:", managerContract.address);

  // const [user] = await ethers.getSigners();
  // const userBalance = await user.getBalance();
  // const address = await user.getAddress();
  // console.log({ userBalance, address });
  // managerContract.sendMoneyToContract({
  //   value: ethers.utils.parseEther("1"),
  // });

  const txn = await managerContract.getBigBoss();
  console.log("Txn:", { txn });

  const mintNFTs = await managerContract.mintNFTs();
  mintNFTs.wait();
  console.log("NFTs Minted");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
