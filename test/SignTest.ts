import { ethers } from "hardhat";
import { SigTest } from "../typechain-types";
import { expect } from "chai";

describe("SigTest", () => {
  let sigTest: SigTest;

  beforeEach(async () => {
    // Get eth signers
    const signers = await ethers.getSigners();
    // prepare the contract for deployment
    const counterFactory = await ethers.getContractFactory(
      "SigTest",
      signers[0]
    );

    // DEPLOY
    sigTest = (await counterFactory.deploy(signers[0].address)) as SigTest;
    await sigTest.deployed();
  });

  describe("test", async () => {
    it("test basic signing from client", async () => {
      const [adminWallet, userWallet] = await ethers.getSigners();
      const timestamp = Date.now();

      // STEP 1:
      // building hash has to come from system address
      // 32 bytes of data
      const messageHash = ethers.utils.solidityKeccak256(
        ["address", "uint"],
        [userWallet.address, timestamp]
      );

      // STEP 2: 32 bytes of data in Uint8Array
      const messageHashBinary = ethers.utils.arrayify(messageHash);

      // STEP 3: To sign the 32 bytes of data, make sure you pass in the data
      const signature = await adminWallet.signMessage(messageHashBinary);

      // STEP 4: Fire off the transaction with the adminWallet signed data
      await sigTest.connect(userWallet).isDataValid(timestamp, signature);
    });
  });
});
