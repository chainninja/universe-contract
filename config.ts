import env from "./envConfig";

export const config = {
  localhost: {
    rpcUrl: "http://127.0.0.1:8545/",
    privateKey: env.privateKey,
    gameContractAddress: "0x68B1D87F95878fE05B998F19b66F4baba5De1aed",
    ninjaTokenContractAddress: "0xc3e53F4d16Ae77Db1c982e75a937B9f60FE63690",
    simpleWalletContractAddress: "0x7969c5eD335650692Bc04293B07F5BF2e7A673C0",
  },
  goerli: {
    rpcUrl: "https://goerli.infura.io/v3/2e4149067ccd4116ab0ff144487e3b89",
    privateKey: env.goerliPrivateKey,
    gameContractAddress: "0x3a1a9231656f4818ddd1c13518b752ccbff8e95B",
    ninjaTokenContractAddress: "0x9557D0cE0C413EC4F1254e37Fe233989CeD2a86c",
    simpleWalletContractAddress: "0x1aC093e6Cb2D90d5db7683CC959104D2b29F9898",
  },
};
