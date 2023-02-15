import env from "./envConfig";

export const config = {
  localhost: {
    rpcUrl: "http://127.0.0.1:8545/",
    privateKey: env.privateKey,
    gameContractAddress: "0x68B1D87F95878fE05B998F19b66F4baba5De1aed",
    ninjaTokenContractAddress: "0xc3e53F4d16Ae77Db1c982e75a937B9f60FE63690",
    simpleWalletContractAddress: "0xb7278A61aa25c888815aFC32Ad3cC52fF24fE575",
  },
  goerli: {
    rpcUrl: "https://goerli.infura.io/v3/2e4149067ccd4116ab0ff144487e3b89",
    privateKey: env.goerliPrivateKey,
    gameContractAddress: "0x3a1a9231656f4818ddd1c13518b752ccbff8e95B",
    ninjaTokenContractAddress: "0x9557D0cE0C413EC4F1254e37Fe233989CeD2a86c",
    simpleWalletContractAddress: "0x1cA3EcC2b8379092F1cce681b1BFD2C1966c50ad",
  },
};
