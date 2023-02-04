// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "hardhat/console.sol";

contract EIP712Mail {
    // Mail Signable Struct
    struct Mail {
        address from;
        address to;
        string contents;
    }

    struct EIP712Domain {
        string name;
        string version;
        uint256 chainId;
        address verifyingContract;
    }

    bytes32 public immutable DOMAIN_SEPARATOR;

    bytes32 public constant EIP712DOMAIN_TYPEHASH =
        keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");

    // Sign Hash
    bytes32 internal constant TYPE_HASH = keccak256("Mail(address from,address to,string contents)");

    constructor() {
        DOMAIN_SEPARATOR = keccak256(
            // Calculate DOMAIN_SEPARATOR Hash
            // name : EIP712Mail，Contract Name
            // version : 1
            abi.encode(EIP712DOMAIN_TYPEHASH, keccak256("EIP712Mail"), keccak256("1"), block.chainid, address(this))
        );
    }

    // 计算待签名的结构体的哈希
    function hashStruct(Mail memory mail) public view returns (bytes32) {
        console.log("Verifyed mail contents: %s", mail.contents);
        return keccak256(abi.encode(TYPE_HASH, mail.from, mail.to, keccak256(bytes(mail.contents))));
    }

    function verify(Mail memory mail, address signer, uint8 v, bytes32 r, bytes32 s) public view returns (bool) {
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, hashStruct(mail)));
        console.logBytes32(digest);

        address verifyAddress = ecrecover(digest, v, r, s);
        console.log("verified aDDRESS %S", verifyAddress);

        return verifyAddress == signer;
    }
}
