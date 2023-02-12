import { ethers } from "hardhat";
import { SimpleWallet, MyEpicGame } from "../typechain-types";
import { expect } from "chai";

describe("SimpleWallet", async () => {
  const [deployer, walletOwner, nobody] = await ethers.getSigners();
  let testWallet: SimpleWallet;
  let epicGame: MyEpicGame;
  beforeEach(async () => {
    // Get eth signers
    // prepare the contract for deployment
    const epicGameFactory = await ethers.getContractFactory(
      "MyEpicGame",
      deployer
    );

    const testWalletFactory = await ethers.getContractFactory(
      "SimpleWallet",
      deployer
    );

    // DEPLOY
    epicGame = (await epicGameFactory.deploy()) as MyEpicGame;
    await epicGame.deployed();
    testWallet = (await testWalletFactory.deploy(
      walletOwner.address,
      epicGame.address
    )) as SimpleWallet;
    await testWallet.deployed();
  });

  describe("mint", () => {
    it("Should mintNFTs with valid signature", async () => {
      const mintCharacterNumber = 1;
      const messageHash = ethers.utils.solidityKeccak256(
        ["address", "uint"],
        [nobody.address, mintCharacterNumber]
      );
      // STEP 2: 32 bytes of data in Uint8Array
      const messageHashBinary = ethers.utils.arrayify(messageHash);

      // STEP 3: To sign the 32 bytes of data, make sure you pass in the data
      const signature = await walletOwner.signMessage(messageHashBinary);

      await testWallet.connect(nobody).mintNFTs(mintCharacterNumber, signature);
    });
  });

  describe("execute", () => {
    it("Should call execute to mintNFT from the callData", async () => {
      const nonce1 = await testWallet.nonce();
      // await testWallet.connect(nobody)
      const value = 0;
      // data: callReceiver.interface.encodeFunctionData('testCall', [valA, valB])

      const data = epicGame.interface.encodeFunctionData("getBigBoss");
      // address _to, uint _value, bytes memory _data, bytes memory signature
      // type "address", "string"， “bytes”， "bool":
      const messageHash = ethers.utils.solidityKeccak256(
        ["address", "uint", "bytes", "uint"],
        [epicGame.address, value, data, nonce1]
      );
      // STEP 2: 32 bytes of data in Uint8Array
      const messageHashBinary = ethers.utils.arrayify(messageHash);
      // STEP 3: To sign the 32 bytes of data, make sure you pass in the data
      const signature = await walletOwner.signMessage(messageHashBinary);
      const returns = await testWallet
        .connect(nobody)
        .execute(epicGame.address, 0, data, signature);
      console.log({ returns });
    });

    it("Nonce should be updated", async () => {
      const nonce1 = await testWallet.nonce();
      // await testWallet.connect(nobody)
      const value = 0;
      // data: callReceiver.interface.encodeFunctionData('testCall', [valA, valB])

      const data = epicGame.interface.encodeFunctionData("getBigBoss");
      // address _to, uint _value, bytes memory _data, bytes memory signature
      // type "address", "string"， “bytes”， "bool":
      const messageHash = ethers.utils.solidityKeccak256(
        ["address", "uint", "bytes", "uint"],
        [epicGame.address, value, data, nonce1]
      );
      // STEP 2: 32 bytes of data in Uint8Array
      const messageHashBinary = ethers.utils.arrayify(messageHash);
      // STEP 3: To sign the 32 bytes of data, make sure you pass in the data
      const signature = await walletOwner.signMessage(messageHashBinary);
      await testWallet
        .connect(nobody)
        .execute(epicGame.address, 0, data, signature);
      const nonce2 = await testWallet.nonce();
      console.log({ nonce1, nonce2 });
      expect(nonce1.add(1)).equals(nonce2);
      // Do it and repeat again
      const messageHash2 = ethers.utils.solidityKeccak256(
        ["address", "uint", "bytes", "uint"],
        [epicGame.address, value, data, nonce2]
      );
      // STEP 2: 32 bytes of data in Uint8Array
      const messageHashBinary2 = ethers.utils.arrayify(messageHash2);
      // STEP 3: To sign the 32 bytes of data, make sure you pass in the data
      const signature2 = await walletOwner.signMessage(messageHashBinary2);
      await testWallet
        .connect(nobody)
        .execute(epicGame.address, 0, data, signature2);
      const nonce3 = await testWallet.nonce();
      expect(nonce2.add(1)).equals(nonce3);
    });
  });
});
