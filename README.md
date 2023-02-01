# Universe

This project is a smart contract playground for me

## Command

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

##### deploy lock and verify it

```shell
npx hardhat run scripts/deployLock.ts --network goerli
npx hardhat verify --network goerli 0xF2b64d776723b181A5EE92d3064bd021F935dC70 1706505759
```

### Epic Game

##### Deploy to Local
```shell
npx hardhat node
npx hardhat run scripts/deployGame.ts --network localhost
```


##### Deploy and Verify epicGame

[Deployed Contract](https://goerli.etherscan.io/address/0x3a1a9231656f4818ddd1c13518b752ccbff8e95B#readContract) 

```shell
npx hardhat run scripts/deployGame.ts --network goerli
npx hardhat verify --network goerli 0x3a1a9231656f4818ddd1c13518b752ccbff8e95B
```

##### Signature Verification

1. Verify A Ether Signed Message

```shell
npx hardhat run scripts/deployVerifySignature.ts --network localhost
npx ts-node client/signatureVerification.ts
``` 

```shell
npx hardhat compile
npx hardhat test
```