import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { config } from "../config";
import {
  CallErc20,
  MyEpicGame,
  NinjaToken,
  Receiver,
} from "../typechain-types";

const simpleCall = async (
  callerContract: CallErc20,
  receiverContract: Receiver
) => {
  const value = 0;
  // data: callReceiver.interface.encodeFunctionData('testCall', [valA, valB])

  const data = receiverContract.interface.encodeFunctionData("foo", [
    "call foo",
    123,
  ]);

  await callerContract.execute(receiverContract.address, value, data);
};

// const erc20TransferFrom = async (
//   callerContract: CallErc20,
//   ninjaTokenContract: NinjaToken
// ) => {
//   const value = 0;
//   // data: callReceiver.interface.encodeFunctionData('testCall', [valA, valB])

//   const OneTokens = 1 * 10 ** 18;
//   const TenTokens = 10 * 10 ** 18;
//   const approved = ninjaTokenContract.interface.encodeFunctionData("approve", [
//     callerContract.address,
//     BigNumber.from(TenTokens.toString()),
//   ]);
//   await callerContract.execute(ninjaTokenContract.address, value, approved);

//   const data = ninjaTokenContract.interface.encodeFunctionData("transferFrom", [
//     callerContract.address,
//     "0xf419B5a6a3DfBf3d3a6bEEFff331be38EE464080",
//     BigNumber.from(OneTokens.toString()),
//   ]);
//   await callerContract.execute(ninjaTokenContract.address, value, data);
// };

const erc20Transfer = async (
  callerContract: CallErc20,
  ninjaTokenContract: NinjaToken
) => {
  const value = 0;
  // data: callReceiver.interface.encodeFunctionData('testCall', [valA, valB])

  const OneTokens = 1 * 10 ** 18;
  const data = ninjaTokenContract.interface.encodeFunctionData("transfer", [
    "0xf419B5a6a3DfBf3d3a6bEEFff331be38EE464080",
    BigNumber.from(OneTokens.toString()),
  ]);

  await callerContract.execute(ninjaTokenContract.address, value, data);
};

const mintNft = async (callerContract: CallErc20, gameContract: MyEpicGame) => {
  const value = 0;
  const data = gameContract.interface.encodeFunctionData("mintCharacterNFT", [
    1,
  ]);
  // const data = gameContract.interface.encodeFunctionData("getBigBoss");
  await callerContract.execute(gameContract.address, value, data);
};

// const erc20TransferDelegate = async (
//   callerContract: CallErc20,
//   ninjaTokenContract: NinjaToken
// ) => {
//   const OneTokens = 1 * 10 ** 18;
//   const data = ninjaTokenContract.interface.encodeFunctionData("transfer", [
//     "0xf419B5a6a3DfBf3d3a6bEEFff331be38EE464080",
//     BigNumber.from(OneTokens.toString()),
//   ]);

//   await callerContract.executeDelegate(ninjaTokenContract.address, data);
// };

async function main() {
  const { privateKey } = config.localhost;

  const wallet = new ethers.Wallet(privateKey);
  const receiverFactory = await ethers.getContractFactory("Receiver");
  const receiver = await receiverFactory.deploy();
  const callErc20Factory = await ethers.getContractFactory("CallErc20");
  const CallErc20 = await callErc20Factory.deploy(wallet.address);

  const HundredToken = 100 * 10 ** 18;
  const TenToken = 10 * 10 ** 18;
  const hundred = BigNumber.from(HundredToken.toString());
  const erc20Factory = await ethers.getContractFactory("NinjaToken");
  const erc20 = await erc20Factory.deploy(hundred);

  const gameContractFactory = await ethers.getContractFactory("MyEpicGame");
  const gameContract = await gameContractFactory.deploy();

  await receiver.deployed();
  await CallErc20.deployed();
  await erc20.deployed();
  await gameContract.deployed();
  console.log("Contract Deployed to:", {
    callErc20Address: CallErc20.address,
    receiverAddress: receiver.address,
    erc20Address: erc20.address,
    gameContractAddress: gameContract.address,
  });
  await erc20.transfer(CallErc20.address, BigNumber.from(TenToken.toString()));
  await erc20.transfer(wallet.address, BigNumber.from(TenToken.toString()));
  await simpleCall(CallErc20, receiver);
  await erc20Transfer(CallErc20, erc20);
  // await erc20TransferDelegate(CallErc20, erc20);
  // await erc20TransferFrom(CallErc20, erc20);
  await mintNft(CallErc20, gameContract);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
