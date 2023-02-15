import { Wallet } from "ethers";
import { ethers } from "hardhat";
import { config } from "../config";

const sendEther = async (toAddress: string, wallet: Wallet) => {
  const rpcUrl = "https://goerli.infura.io/v3/2e4149067ccd4116ab0ff144487e3b89";
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const account = wallet.connect(provider);

  const gasPrice = 20e10;
  const gasLimit = 300000;
  const tx = {
    to: toAddress,
    gasLimit: "0x" + gasLimit.toString(16),
    gasPrice: "0x" + gasPrice.toString(16),
    value: ethers.utils.parseEther("0.01"),
  };
  const transaction = await account.sendTransaction(tx);
  console.log("sendEther", { transaction });
};

async function main() {
  const { gameContractAddress, privateKey } = config.localhost;

  const wallet = new ethers.Wallet(privateKey);

  const simpleWalletContractFactory = await ethers.getContractFactory(
    "SimpleWallet"
  );

  const walletContract = await simpleWalletContractFactory.deploy(
    wallet.address,
    gameContractAddress
  );

  await walletContract.deployed();
  console.log("Contract Deployed to:", walletContract.address);

  // const [user] = await ethers.getSigners();
  // const userBalance = await user.getBalance();
  // const address = await user.getAddress();
  // console.log({ userBalance, address });
  // walletContract.sendMoneyToContract({
  //   value: ethers.utils.parseEther("1"),
  // });

  const txn = await walletContract.getBigBoss();
  console.log("Txn:", { txn });
  // await sendEther(walletContract.address, wallet);

  // const mintNFTs = await managerContract.mintNFTs();
  // mintNFTs.wait();
  // console.log("NFTs Minted");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
