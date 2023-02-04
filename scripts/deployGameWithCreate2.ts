import { ethers } from "hardhat";
import { bytecode } from "../artifacts/contracts/games/MyEpicGame.sol/MyEpicGame.json";
import { create2Address } from "./utils/utils";

async function main() {
  const factoryAddr = "0x95401dc811bb5740090279Ba06cfA8fcF6113778";
  const saltHex = ethers.utils.id("112");
  const initCode = bytecode;

  const create2Addr = create2Address(factoryAddr, saltHex, initCode);
  console.log("precomputed address:", create2Addr);

  console.log({ initCode, saltHex });

  // // Actual Deployment
  const Factory = await ethers.getContractFactory("DeterministicDeployFactory");
  const factory = await Factory.attach(factoryAddr);

  const gameDeploy = await factory.deploy(initCode, saltHex);
  const txReceipt = await gameDeploy.wait();
  console.log("Deployed to:", {
    events: (txReceipt.events && (txReceipt.events[0] as any)).args[0],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
