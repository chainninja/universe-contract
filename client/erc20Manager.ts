import { ethers, Wallet, BigNumber } from "ethers";
import { SimpleWallet, NinjaToken } from "../typechain-types";
import { abi as SimpleWalletAbi } from "../artifacts/contracts/wallet/SimpleWallet.sol/SimpleWallet.json";
import { abi as ERC20Abi } from "../artifacts/contracts/erc20/ERC20.sol/ERC20.json";
import { config } from "../config";

const {
  ninjaTokenContractAddress,
  simpleWalletContractAddress,
  rpcUrl,
  privateKey,
} = config.goerli;

const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
const wallet = new Wallet(privateKey);
const account = wallet.connect(provider);

const walletContract = new ethers.Contract(
  simpleWalletContractAddress,
  SimpleWalletAbi,
  account
) as SimpleWallet;

const ninjaTokenContract = new ethers.Contract(
  ninjaTokenContractAddress,
  ERC20Abi,
  account
) as NinjaToken;

const main = async () => {
  try {
    const totalSupply = await ninjaTokenContract.totalSupply();
    console.log({ totalSupply });
    const TenToken = 10 * 10 ** 18;
    await ninjaTokenContract.transfer(
      walletContract.address,
      BigNumber.from(TenToken.toString())
    );
  } catch (error) {
    console.error(error);
  }
};

main();
