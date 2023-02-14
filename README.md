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

### Epic Game(ERC721)

##### Deploy to Local
```shell
npx hardhat node
npx hardhat run scripts/deployGame.ts --network localhost
```

### NinjaToken(ERC20)
```
npx hardhat run scripts/erc20/deploy.ts --network goerli
```

##### Deploy and Verify epicGame

[Deployed Contract](https://goerli.etherscan.io/address/0x3a1a9231656f4818ddd1c13518b752ccbff8e95B#readContract) 

```shell
npx hardhat run scripts/deployGame.ts --network goerli
npx hardhat verify --network goerli 0x3a1a9231656f4818ddd1c13518b752ccbff8e95B
```

##### Signature Verification

1. Verify Signed Message

```shell
npx hardhat run scripts/deployVerifySignature.ts --network localhost
npx ts-node client/signatureVerification.ts
``` 

```shell
npx hardhat compile
npx hardhat test
```

2. EIP712 Verify Message

```shell
npx hardhat run scripts/deployEIP712Mail.ts --network localhost
npx ts-node client/eip712Signature.ts
```

##### Caller
```shell
npx hardhat run scripts/deployCaller.ts --network localhost
```

##### Deploy with Create2

```shell
npx hardhat run scripts/deployFactory.ts --network localhost 
# 0x95401dc811bb5740090279Ba06cfA8fcF6113778
npx hardhat run scripts/deployGameWithCreate2.ts --network localhost 
```

### SimpleWallet

[Deployed Contract](https://goerli.etherscan.io/address/0x1f65d92Ef6C63734b5411fbECD99FEF5FFe18B2A#readContract) 


```
npx hardhat verify --network goerli 0x1f65d92Ef6C63734b5411fbECD99FEF5FFe18B2A 0xe612ef637130daab4284da3d70f89d3b883ed60f 0x3a1a9231656f4818ddd1c13518b752ccbff8e95B
npx ts-node client/simpleWalletManager.ts
```