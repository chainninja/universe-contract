import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import env from "./envConfig";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  etherscan: {
    apiKey: env.etherScan
  },
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${env.alchemyApiKey}`,
      accounts: [env.goerliPrivateKey],
    },
  },
}
export default config;
