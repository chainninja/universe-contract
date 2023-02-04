import { ethers } from "hardhat";

export const encoder = (types: Array<string>, values: Array<string>) => {
  const abiCoder = ethers.utils.defaultAbiCoder;
  console.log({ abiCoder });
  const encodedParams = abiCoder.encode(types, values);
  return encodedParams.slice(2);
};

export const create2Address = (
  factoryAddress: string,
  saltHex: string,
  initCode: string
) => {
  const create2Addr = ethers.utils.getCreate2Address(
    factoryAddress,
    saltHex,
    ethers.utils.keccak256(initCode)
  );
  return create2Addr;
};
