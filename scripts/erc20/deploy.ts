import { BigNumber } from "ethers";
import { ethers } from "hardhat";

async function main() {
  // Local:
  const SimpleContractAddress = "0x68B1D87F95878fE05B998F19b66F4baba5De1aed";
  // Goerli:
  // const SimpleContractAddress = "0x1f65d92Ef6C63734b5411fbECD99FEF5FFe18B2A";

  const NinjaTokenFactory = await ethers.getContractFactory("NinjaToken");

  // When dealing with cryptocurrencies you may want to be able to send arbitrary amounts,
  // like 0.004ETH. Unfortunately, Solidity and the Ethereum Virtual Machine do not support decimals:
  // only integer numbers can be used. This means that only whole numbers can be sent (1, 4, 5), and this, of course, poses an issue.

  // So what’s the workaround?

  // It’s very simple, a token contract can use larger integer values
  // (the EVM supports 256-bit integers) so that a balance of 1000000000000000000 represents 1 ETH with 18 decimal places,
  // hence a transfer of 4000000000000000 will correspond to 0.004ETH being sent.

  // We that in mind, when calculating our total supply, we have to take account of the total amount of tokens, including the decimal places we want to have.

  // If you want a total max supply of 1.000.000.000 tokens, with 18 decimal places, like Ethereum and many other cryptocurrencies have,
  // you want to pass 1000000000*10**18 that is (1000000000000000000000000000).

  const HundredToken = 100 * 10 ** 18;
  const TenTokens = 10 * 10 ** 18;
  const hundred = BigNumber.from(HundredToken.toString());
  console.log({ HundredToken, hundred });
  const NinjaToken = await NinjaTokenFactory.deploy(hundred);

  await NinjaToken.deployed();

  console.log(`Deployed to ${NinjaToken.address}`);
  await NinjaToken.transfer(
    SimpleContractAddress,
    BigNumber.from(TenTokens.toString())
  );
  // https://goerli.etherscan.io/address/0x4852396e5476dc546d94f9389e9eb9c276e93d06
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
