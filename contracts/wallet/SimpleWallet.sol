// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

struct CharacterAttributes {
    uint characterIndex;
    string name;
    string imageURI;
    uint hp;
    uint maxHp;
    uint attackDamage;
}

struct BigBoss {
    string name;
    string imageURI;
    uint hp;
    uint maxHp;
    uint attackDamage;
}

interface EpicGame {
    function tokenURI(uint256 _tokenId) external view returns (string memory);

    function mintCharacterNFT(uint _characterIndex) external;

    function attackBoss() external;

    function checkIfUserHasNFT() external view returns (CharacterAttributes memory);

    function getAllDefaultCharacters() external view returns (CharacterAttributes[] memory);

    function getBigBoss() external view returns (BigBoss memory);
}

struct SignerNonce {
    uint96 nonce;
    address signer;
}

contract SimpleWallet is IERC721Receiver {
    using ECDSA for bytes32;

    // owner of this contract
    address public contractOwner;

    EpicGame public eGame;
    SignerNonce public signerNonce;

    constructor(address _signer, address gameAddress) {
        signerNonce.signer = _signer;
        eGame = EpicGame(gameAddress);
        contractOwner = _signer;
    }

    function isValidSignature(bytes32 _data, bytes memory _signature) internal view returns (bool isValid) {
        // Validate signatures
        bytes32 signedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _data));
        return signedHash.recover(_signature) == contractOwner;
    }

    function nonce() public view returns (uint) {
        return signerNonce.nonce;
    }

    function signer() public view returns (address) {
        return signerNonce.signer;
    }

    /**
     * @notice Only entry point to excute an. The method will execute any transaction provided that it
     * receieved enough signatures from the wallet owners.
     * @param _to The destination address for the transaction to execute.
     * @param _value The value parameter for the transaction to execute.
     * @param _data The data parameter for the transaction to execute.
     * @param signature Concatenated signatures ordered based on increasing signer's address.
     */
    function execute(address _to, uint _value, bytes memory _data, bytes memory signature) public returns (bool success) {
        bytes32 msgHash = keccak256(abi.encodePacked(_to, _value, _data));
        require(isValidSignature(msgHash, signature), "Invalid signature");
        (bool _success,) = _to.call{value: _value}(_data);
        return _success;
    }

    function getBigBoss() external view returns (BigBoss memory) {
        return eGame.getBigBoss();
    }

    function sendMoneyToContract() public payable {}

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function withdrawAll(address payable _to) public {
        require(SimpleWallet.contractOwner == _to);
        _to.transfer(address(this).balance);
    }

    function mintNFTs(uint _characterIndex, bytes memory signature) external {
        bytes32 msgHash = keccak256(abi.encodePacked(msg.sender, _characterIndex));
        require(isValidSignature(msgHash, signature), "Invalid signature");
        eGame.mintCharacterNFT(_characterIndex);
        eGame.mintCharacterNFT(_characterIndex);
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}
