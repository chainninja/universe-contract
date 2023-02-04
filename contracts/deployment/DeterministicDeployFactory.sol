// https://github.com/thegostep/solidity-create2-deployer
// https://solidity-by-example.org/app/create2/
// https://docs.alchemy.com/docs/create2-an-alternative-to-deriving-contract-addresses
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract DeterministicDeployFactory {
    event Deploy(address addr);

    function deploy(bytes memory bytecode, uint _salt) external {
        address addr;
        assembly {
            addr := create2(0, add(bytecode, 0x20), mload(bytecode), _salt)
            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }

        emit Deploy(addr);
    }
}
