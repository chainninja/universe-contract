import env from "../envConfig";
import { ethers, Wallet } from "ethers";
import { SimpleWallet } from "../typechain-types";
import { abi as SimpleWalletAbi } from "../artifacts/contracts/wallet/SimpleWallet.sol/SimpleWallet.json";
import { abi as MyEpicGameAbi } from "../artifacts/contracts/games/MyEpicGame.sol/MyEpicGame.json";

//Local
// const GameContractAddress = "0x68B1D87F95878fE05B998F19b66F4baba5De1aed";
// const SimpleContractAddress = "0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44";
// const privateKey = env.privateKey;
// const rpcUrl = "http://127.0.0.1:8545/";

// Goerli:
const GameContractAddress = "0x3a1a9231656f4818ddd1c13518b752ccbff8e95B";
const SimpleContractAddress = "0x6C1E65eE12fdeD086bD30535cc4c231B49922d49";
const privateKey = env.goerliPrivateKey;
const rpcUrl = "https://goerli.infura.io/v3/2e4149067ccd4116ab0ff144487e3b89";

const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
const wallet = new Wallet(privateKey);
const account = wallet.connect(provider);

const walletContract = new ethers.Contract(
  SimpleContractAddress,
  SimpleWalletAbi,
  account
) as SimpleWallet;
const epicGameContract = new ethers.Contract(
  GameContractAddress,
  MyEpicGameAbi,
  account
);
const getViewFunctions = async () => {
  const currentNonce = await walletContract.nonce();
  const bigBoss = await walletContract.getBigBoss();
  const balance = await walletContract.getBalance();
  const signerNonce = await walletContract.signerNonce();
  console.log({ bigBoss, currentNonce, balance, signerNonce });
};

const execute = async () => {
  const nonce1 = await walletContract.nonce();
  // await testWallet.connect(nobody)
  const value = 0;
  // data: callReceiver.interface.encodeFunctionData('testCall', [valA, valB])

  //TODO: change "getBigBoss" to "mintNFTs" to get the idea of what will happend
  const data = epicGameContract.interface.encodeFunctionData("getBigBoss");
  // address _to, uint _value, bytes memory _data, bytes memory signature
  // type "address", "string"， “bytes”， "bool":
  const messageHash = ethers.utils.solidityKeccak256(
    ["address", "uint", "bytes", "uint"],
    [epicGameContract.address, value, data, nonce1]
  );
  // STEP 2: 32 bytes of data in Uint8Array
  const messageHashBinary = ethers.utils.arrayify(messageHash);
  // STEP 3: To sign the 32 bytes of data, make sure you pass in the data
  const signature = await wallet.signMessage(messageHashBinary);
  const returns = await walletContract.execute(
    epicGameContract.address,
    0,
    data,
    signature
  );
  console.log({ returns });
};

const mintNFT = async () => {
  const mintCharacterNumber = 1;
  const messageHash = ethers.utils.solidityKeccak256(
    ["address", "uint"],
    [wallet.address, mintCharacterNumber]
  );
  // STEP 2: 32 bytes of data in Uint8Array
  const messageHashBinary = ethers.utils.arrayify(messageHash);

  // STEP 3: To sign the 32 bytes of data, make sure you pass in the data
  const signature = await wallet.signMessage(messageHashBinary);

  await walletContract.mintNFTs(mintCharacterNumber, signature);
};

const main = async () => {
  await getViewFunctions();
  try {
    await mintNFT();
    await execute();
  } catch (error) {
    console.error(error);
  }
};

main();
