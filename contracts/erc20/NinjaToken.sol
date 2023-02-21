// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./ERC20.sol";
import "hardhat/console.sol";

contract NinjaToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Ninja", "NIN") {
        _mint(msg.sender, initialSupply);
    }
}
