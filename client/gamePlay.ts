import { ethers } from "ethers";
import { MyEpicGame__factory, MyEpicGame } from "../typechain-types";

const GameContractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const rpcUrl = "http://127.0.0.1:8545/";

const getNftById = async (
  id: number,
  contract: MyEpicGame
): Promise<string> => {
  const NFT1Encoded = await contract.tokenURI(id);
  const replaced = NFT1Encoded.replace("data:application/json;base64,", "");
  return Buffer.from(replaced, "base64").toString("utf8");
};

const main = async () => {
  const localProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
  // const wallet = new Wallet(env.privateKey);
  // wallet.connect(localProvider);

  const gameContract = MyEpicGame__factory.connect(
    GameContractAddress,
    localProvider.getSigner()
  );
  const bigBoss = await gameContract.getBigBoss();
  const NFT1 = await getNftById(1, gameContract);
  const owner = await gameContract.ownerOf(1);
  console.log({ bigBoss, NFT1, owner });
};

main();
