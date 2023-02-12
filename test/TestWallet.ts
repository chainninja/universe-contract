import { ethers } from "hardhat";
import { TestWallet, MyEpicGame } from "../typechain-types";
import { expect } from "chai";

describe("TestWallet", async () => {
  const [deployer, walletOwner, nobody] = await ethers.getSigners();
  let testWallet: TestWallet;
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
    const epicGame = (await epicGameFactory.deploy()) as MyEpicGame;
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
});
