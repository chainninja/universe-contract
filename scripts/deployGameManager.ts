import { ethers } from "hardhat";
import { config } from "../config";
async function main() {
  const { gameContractAddress } = config.goerli;

  const managerContractFactory = await ethers.getContractFactory(
    "EpicGameManager"
  );
  const managerContract = await managerContractFactory.deploy(
    gameContractAddress
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
