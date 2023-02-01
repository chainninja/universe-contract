import { ethers } from "ethers";
import env from "../envConfig";
import { abi as EIP712MailAbi } from "../artifacts/contracts/wallet/sign/EIP712Mail.sol/EIP712Mail.json";
import { EIP712Mail } from "../typechain-types";

// Local:
const rpcUrl = "http://127.0.0.1:8545/";
const privateKey = env.privateKey;
const MailContractAddress = "0x4A679253410272dd5232B3Ff7cF5dbB88f295319";

const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
const wallet = new ethers.Wallet(privateKey, provider);

// The data to sign
const mail = {
  from: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
  to: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
  contents: "Hello, Congrats to onboard",
};

async function sign() {
  const { chainId } = await provider.getNetwork();

  console.log({ chainId });

  const domain = {
    name: "EIP712Mail",
    version: "1",
    chainId,
    verifyingContract: MailContractAddress,
  };

  // The named list of all type definitions
  const types = {
    Mail: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "contents", type: "string" },
    ],
  };

  const signature = await wallet._signTypedData(domain, types, mail);

  // Splite the Signature to (v r s) format
  const signParts = ethers.utils.splitSignature(signature);
  const { r, s, v } = signParts;
  console.log(">>> Signature:", signParts);
  // Print the Signature
  console.log(signature);
  const isVerifiedSignature = await verify({ r, s, v });
  console.log({ isVerifiedSignature });
}

async function verify({ r, s, v }: any) {
  const mailContract = new ethers.Contract(
    MailContractAddress,
    EIP712MailAbi,
    provider
  ) as EIP712Mail;
  return mailContract.verify(
    mail,
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    v,
    r,
    s
  );
}

sign();
