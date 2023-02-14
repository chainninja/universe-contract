import { ethers, Wallet } from "ethers";
import { MyEpicGame } from "../typechain-types";
import { abi as EpicGameAbi } from "../artifacts/contracts/games/MyEpicGame.sol/MyEpicGame.json";
import { Transaction } from "@ethereumjs/tx";
import { Buffer } from "buffer";
import { Chain, Common, Hardfork } from "@ethereumjs/common";
import { config } from "../config";

const { gameContractAddress, rpcUrl, privateKey } = config.goerli;

const gasPrice = 20e10;
const gasLimit = 300000;

const getNftById = async (
  id: number,
  contract: MyEpicGame
): Promise<string> => {
  const NFT1Encoded = await contract.tokenURI(id);
  const replaced = NFT1Encoded.replace("data:application/json;base64,", "");
  return Buffer.from(replaced, "base64").toString("utf8");
};

const main = async () => {
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  console.log({ pk: privateKey, length: privateKey.length });

  const wallet = new Wallet(privateKey);
  console.log({ wallet: wallet.address });

  const gameContract = new ethers.Contract(
    gameContractAddress,
    EpicGameAbi,
    provider
  ) as MyEpicGame;

  const bigBoss = await gameContract.getBigBoss();
  const NFT1 = await getNftById(1, gameContract);
  const owner = await gameContract.ownerOf(1);
  console.log({ bigBoss, NFT1, owner });

  // sign and send the Transaction
  // const mintedNft = gameContract.mintCharacterNFT(1);
  const from = wallet.address;
  const nonce = await provider.getTransactionCount(from);
  const EpicGameInterface = new ethers.utils.Interface(EpicGameAbi);
  const callData = EpicGameInterface.encodeFunctionData("mintCharacterNFT", [
    2,
  ]);
  const txParams = {
    nonce,
    gasLimit: "0x" + gasLimit.toString(16),
    gasPrice: "0x" + gasPrice.toString(16),
    to: gameContract.address,
    from,
    value: "0x00",
    data: callData,
  };

  // Sign Transaction Option 1:
  const common = new Common({
    chain: Chain.Goerli,
    hardfork: Hardfork.London,
  });
  const tx = Transaction.fromTxData(txParams, { common });
  // const tx = FeeMarketEIP1559Transaction.fromTxData(txParams, { common });
  const signedTransaction = tx.sign(Buffer.from(privateKey, "hex"));
  const signedTx = "0x" + signedTransaction.serialize().toString("hex");

  // Sign Transaction Option 2:
  const signedTx2 = await wallet.signTransaction(txParams);

  console.log({
    from,
    nonce,
    callData,
    txParams,
    signedTransaction,
    signedTx,
    signedTx2,
  });
  const { hash } = await provider.sendTransaction(signedTx);

  await provider.waitForTransaction(hash, 1);
  console.log(`sendTransaction - done with hash: ${hash}.`);
};

main();
