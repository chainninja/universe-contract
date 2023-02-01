import { ethers } from "ethers";
import env from "../envConfig";
import { abi as VerifySignatureAbi } from "../artifacts/contracts/wallet/sign/VerifySignature.sol/VerifySignature.json";
import { VerifySignature } from "../typechain-types";

// Local:
const rpcUrl = "http://127.0.0.1:8545/";
const privateKey = env.privateKey;
const SignMessageContractAddress = "0x67d269191c92Caf3cD7723F116c85e6E9bf55933";

const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
const wallet = new ethers.Wallet(privateKey, provider);

async function sign() {
  const message = "Hello World";
  const walletAddress = wallet.address.toLowerCase();
  // STEP 1:
  // building hash has to come from system address
  // 32 bytes of data
  const messageHash = ethers.utils.solidityKeccak256(["string"], [message]);

  // STEP 2: 32 bytes of data in Uint8Array
  const messageHashBinary = ethers.utils.arrayify(messageHash);

  // STEP 3: To sign the 32 bytes of data, make sure you pass in the data
  const signature = await wallet.signMessage(messageHashBinary);

  console.log({ messageHash, messageHashBinary, signature });
  // Splite the Signature to (v r s) format
  const signParts = ethers.utils.splitSignature(signature);

  console.log(">>> Signature:", signParts);
  // Print the Signature
  console.log(signature);
  const verified = ethers.utils.verifyMessage(messageHashBinary, signature);
  const isVerifiedSignature = await verify({
    walletAddress,
    message,
    signature,
  });
  console.log({
    verified,
    walletAddress,
    isSameAddress: verified == wallet.address,
    isVerifiedSignature,
  });
}

async function verify({ walletAddress, message, signature }: any) {
  const contract = new ethers.Contract(
    SignMessageContractAddress,
    VerifySignatureAbi,
    provider
  ) as VerifySignature;
  return contract.verify(walletAddress, message, signature);
}

sign();
