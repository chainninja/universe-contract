import * as dotenv from "dotenv";
dotenv.config();

export default {
  etherScan: process.env.ETHER_SCAN || "",
  alchemyApiKey: process.env.ALCHEMY_API_KEY || "",
  goerliPrivateKey: process.env.GOERLI_PRIVATE_KEY || "",
  privateKey: process.env.PRIVATE_KEY || "",
};
