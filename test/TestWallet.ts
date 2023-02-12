import { ethers } from "hardhat";
import { TestWallet, MyEpicGame } from "../typechain-types";
import { expect } from "chai";

describe("TestWallet", async () => {
  const [deployer, walletOwner, nobody] = await ethers.getSigners();
  let testWallet: TestWallet;
  let epicGame: MyEpicGame;
  beforeEach(async () => {
    // Get eth signers
    // prepare the contract for deployment
    const epicGameFactory = await ethers.getContractFactory(
      "MyEpicGame",
      deployer
    );

    const testWalletFactory = await ethers.getContractFactory(
      "TestWallet",
      deployer
    );

    // DEPLOY
    epicGame = (await epicGameFactory.deploy()) as MyEpicGame;
    await epicGame.deployed();
    testWallet = (await testWalletFactory.deploy(
      walletOwner.address,
      epicGame.address
    )) as TestWallet;
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
      // await testWallet.connect(nobody)
      const value = 0;
      // data: callReceiver.interface.encodeFunctionData('testCall', [valA, valB])

      const data = epicGame.interface.encodeFunctionData("getBigBoss");
      // address _to, uint _value, bytes memory _data, bytes memory signature
      // type "address", "string"， “bytes”， "bool":
      const messageHash = ethers.utils.solidityKeccak256(
        ["address", "uint", "bytes"],
        [epicGame.address, value, data]
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
  });
});
