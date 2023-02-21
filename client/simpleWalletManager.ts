import { ethers, Wallet, BigNumber } from "ethers";
import { SimpleWallet, MyEpicGame } from "../typechain-types";
import { abi as SimpleWalletAbi } from "../artifacts/contracts/wallet/SimpleWallet.sol/SimpleWallet.json";
import { abi as MyEpicGameAbi } from "../artifacts/contracts/games/MyEpicGame.sol/MyEpicGame.json";
import { abi as ERC20Abi } from "../artifacts/contracts/erc20/ERC20.sol/ERC20.json";
import { config } from "../config";

const {
  gameContractAddress,
  ninjaTokenContractAddress,
  simpleWalletContractAddress,
  rpcUrl,
  privateKey,
} = config.goerli;

const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
const wallet = new Wallet(privateKey);
const account = wallet.connect(provider);

const gasPrice = 20e10;
const gasLimit = 300000;

const walletContract = new ethers.Contract(
  simpleWalletContractAddress,
  SimpleWalletAbi,
  account
) as SimpleWallet;

const epicGameContract = new ethers.Contract(
  gameContractAddress,
  MyEpicGameAbi,
  account
) as MyEpicGame;

const ninjaTokenContract = new ethers.Contract(
  ninjaTokenContractAddress,
  ERC20Abi,
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

const mintNftViaCall = async () => {
  const nonce1 = await walletContract.nonce();
  // await testWallet.connect(nobody)
  const value = 0;
  // data: callReceiver.interface.encodeFunctionData('testCall', [valA, valB])

  //TODO: change "getBigBoss" to "mintNFTs" to get the idea of what will happend
  const data = epicGameContract.interface.encodeFunctionData(
    "mintCharacterNFT",
    [1]
  );
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
  const gasEstimated = await walletContract.estimateGas.execute(
    epicGameContract.address,
    0,
    data,
    signature
  );
  console.log({ gasLimit });

  // const returns = await walletContract.execute(
  //   epicGameContract.address,
  //   0,
  //   data,
  //   signature,
  //   {
  //     gasLimit: gasEstimated.mul(130).div(100),
  //   }
  // );
  const returns = await walletContract.execute(
    epicGameContract.address,
    0,
    data,
    signature
  );
  console.log({ returns });
};

const erc20Transfer = async () => {
  const nonce1 = await walletContract.nonce();
  // await testWallet.connect(nobody)
  const value = 0;
  // data: callReceiver.interface.encodeFunctionData('testCall', [valA, valB])

  //TODO: change "getBigBoss" to "mintNFTs" to get the idea of what will happend
  const OneTokens = 1 * 10 ** 18;
  const data = ninjaTokenContract.interface.encodeFunctionData("transfer", [
    "0xf419B5a6a3DfBf3d3a6bEEFff331be38EE464080",
    BigNumber.from(OneTokens.toString()),
  ]);
  // address _to, uint _value, bytes memory _data, bytes memory signature
  // type "address", "string"， “bytes”， "bool":
  const messageHash = ethers.utils.solidityKeccak256(
    ["address", "uint", "bytes", "uint"],
    [ninjaTokenContract.address, value, data, nonce1]
  );
  // STEP 2: 32 bytes of data in Uint8Array
  const messageHashBinary = ethers.utils.arrayify(messageHash);
  // STEP 3: To sign the 32 bytes of data, make sure you pass in the data
  const signature = await wallet.signMessage(messageHashBinary);
  await walletContract.execute(ninjaTokenContract.address, 0, data, signature);
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

// const genSignature = async () => {
//   const value = 0;
//   const nonce = 0;
//   const epicgameContractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";
//   const data = epicGameContract.interface.encodeFunctionData(
//     "mintCharacterNFT",
//     [1]
//   );
//   // address _to, uint _value, bytes memory _data, bytes memory signature
//   // type "address", "string"， “bytes”， "bool":
//   const messageHash = ethers.utils.solidityKeccak256(
//     ["address", "uint", "bytes", "uint"],
//     [epicgameContractAddress, value, data, nonce]
//   );
//   console.log({ value, nonce, data, messageHash });
//   // STEP 3: To sign the 32 bytes of data, make sure you pass in the data
//   // return await wallet.signMessage(messageHashBinary);
// };

const depositEth = async (price: number) => {
  const tx = {
    to: simpleWalletContractAddress,
    gasLimit: "0x" + gasLimit.toString(16),
    gasPrice: "0x" + gasPrice.toString(16),
    value: ethers.utils.parseEther(price.toString()),
  };
  await account.sendTransaction(tx);
};

const sendEthTo = async (to: string, price: number) => {
  await walletContract.transfer(to, ethers.utils.parseEther(price.toString()));
};

const withdrawAllEth = async () => {
  await walletContract.withdrawAll(wallet.address);
};

const main = async () => {
  // // await getViewFunctions();
  try {
    // await depositEth(0.01);
    // await sendEthTo(wallet.address, 0.005);
    // await withdrawAllEth();
    // await mintNFT();
    // await execute();
    await mintNftViaCall();
    // await erc20Transfer();
    const ether = await account.getBalance();
    console.log({ ether });
    // await genSignature();
  } catch (error) {
    console.error(error);
  }
};

main();
