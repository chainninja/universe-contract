// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

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

contract EpicGameManager is IERC721Receiver {
    // owner of this contract
    address public contractOwner;

    EpicGame public eGame;

    constructor(address gameAddress) {
        eGame = EpicGame(gameAddress);
        contractOwner = msg.sender;
    }

    function getBigBoss() external view returns (BigBoss memory) {
        return eGame.getBigBoss();
    }

    function sendMoneyToContract() public payable {}

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function withdrawAll(address payable _to) public {
        require(EpicGameManager.contractOwner == _to);
        _to.transfer(address(this).balance);
    }

    function mintNFTs() external {
        eGame.mintCharacterNFT(1);
        eGame.mintCharacterNFT(2);
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}
