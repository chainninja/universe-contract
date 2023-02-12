import { ethers } from "hardhat";
import env from "../envConfig";

async function main() {
  //Local
  // const GameContractAddress = "0x68B1D87F95878fE05B998F19b66F4baba5De1aed";
  // const SimpleContractAddress = "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44";

  // const privateKey = env.privateKey;

  // Goerli:
  const GameContractAddress = "0x3a1a9231656f4818ddd1c13518b752ccbff8e95B";

  // const SimpleContractAddress = "0x6C1E65eE12fdeD086bD30535cc4c231B49922d49";
  const privateKey = env.goerliPrivateKey;

  const wallet = new ethers.Wallet(privateKey);

  const simpleWalletContractFactory = await ethers.getContractFactory(
    "SimpleWallet"
  );

  const managerContract = await simpleWalletContractFactory.deploy(
    wallet.address,
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

  // const mintNFTs = await managerContract.mintNFTs();
  // mintNFTs.wait();
  // console.log("NFTs Minted");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
