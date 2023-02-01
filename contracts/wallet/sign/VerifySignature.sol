// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.16;
import "hardhat/console.sol";

/* Signature Verification

How to Sign and Verify
# Signing
1. Create message to sign
2. Hash the message
3. Sign the hash (off chain, keep your private key secret)

# Verify
1. Recreate hash from the original message
2. Recover signer from signature and hash
3. Compare recovered signer to claimed signer
*/
contract VerifySignature {
    /* 4. Verify signature
    signer = 0xB273216C05A8c0D4F0a4Dd0d7Bae1D2EfFE636dd
    to = 0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C
    message = "coffee and donuts"
    sig="sigature"
    */
    function verify(address _signer, string memory _message, bytes memory _sig) external view returns (bool) {
        bytes32 messageHash = getMessageHash(_message);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
        address verifyAddress = recover(ethSignedMessageHash, _sig);
        console.log("VerifyAddress: %s, signer: %s", verifyAddress, _signer);
        return verifyAddress == _signer;
    }

    /* 1. Unlock MetaMask account
    ethereum.enable()
    */

    /* 2. Get message hash to sign
    getMessageHash(
        "coffee and donuts",
    )

    */
    function getMessageHash(string memory _message) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_message));
    }

    /* 3. Sign message hash
    # using browser
    account = "copy paste account of signer here"
    ethereum.request({ method: "personal_sign", params: [account, hash]}).then(console.log)

    Signature will be different for different accounts
    */
    function getEthSignedMessageHash(bytes32 _messageHash) public pure returns (bytes32) {
        /*
        Signature is produced by signing a keccak256 hash with the following format:
        "\x19Ethereum Signed Message\n" + len(msg) + msg
        */
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash));
    }

    function recover(bytes32 _ethSignedMessageHash, bytes memory _sig) public pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = _split(_sig);
        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function _split(bytes memory _sig) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(_sig.length == 65, "invalid signature length");
        assembly {
            /*
            First 32 bytes stores the length of the signature

            add(sig, 32) = pointer of sig + 32
            effectively, skips first 32 bytes of signature

            mload(p) loads next 32 bytes starting at the memory address p into memory
            */

            // first 32 bytes, after the length prefix
            r := mload(add(_sig, 32))
            // second 32 bytes
            s := mload(add(_sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(_sig, 96)))
        }
        // return (r, s, v)
    }
}
