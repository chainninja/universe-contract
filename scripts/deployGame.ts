import { ethers } from "hardhat";

async function main() {
  const gameContractFactory = await ethers.getContractFactory("MyEpicGame");
  const gameContract = await gameContractFactory.deploy();

  await gameContract.deployed();
  console.log("Contract Deployed to:", gameContract.address);

  let txn;
  txn = await gameContract.mintCharacterNFT(0);
  await txn.wait();
  console.log("Minted NFT #1");

  txn = await gameContract.mintCharacterNFT(1);
  await txn.wait();
  console.log("Minted NFT #2");

  txn = await gameContract.mintCharacterNFT(2);
  await txn.wait();
  console.log("Minted NFT #3");

  txn = await gameContract.mintCharacterNFT(1);
  await txn.wait();
  console.log("Minted NFT #4");

  console.log("Done deploying and minting!");
  // let txn;
  // txn = await gameContract.mintCharacterNFT(2);
  // await txn.wait();

  // // // Get the value of the NFT's URI.
  // const returnedTokenUri = await gameContract.tokenURI(1);
  // console.log("Token URI:", returnedTokenUri);

  // txn = await gameContract.attackBoss();
  // await txn.wait();

  // txn = await gameContract.attackBoss();
  // await txn.wait();
  // // // Get the value of the NFT's URI.
  // const returnedTokenUri2 = await gameContract.tokenURI(1);
  // console.log("Token URI", returnedTokenUri2);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
