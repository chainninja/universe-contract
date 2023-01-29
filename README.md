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
