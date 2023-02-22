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
    gameContractAddress: "0x48cb138B32A8D87FE8DE67c87657739021814660",
    ninjaTokenContractAddress: "0xe8996cA6F74E802C57fEB88E84b610CaEF03b691",
    simpleWalletContractAddress: "0x9941ddB9577f025B7EA536B703de4D3143e9BA6E",
  },
};
