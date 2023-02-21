// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "hardhat/console.sol";

contract CallErc20 {
    using ECDSA for bytes32;
    // owner of this contract
    address public contractOwner;

    event Received(address caller, uint amount, string message);

    constructor(address _signer) {
        contractOwner = _signer;
    }

    modifier onlyOwner() {
        _onlyOwner();
        _;
    }

    function _onlyOwner() internal view {
        //directly from EOA owner, or through the entryPoint (which gets redirected through execFromEntryPoint)
        require(msg.sender == contractOwner || msg.sender == address(this), "only owner");
    }

    /**
     * @notice Only entry point to excute an. The method will execute any transaction provided that it
     * receieved enough signatures from the wallet owners.
     * @param _to The destination address for the transaction to execute.
     * @param _value The value parameter for the transaction to execute.
     * @param _data The data parameter for the transaction to execute.
     */
    function execute(
        address _to,
        uint _value,
        bytes calldata _data
    ) public returns (bool success) {
        console.log("execute, call address: %s, with data", _to);
        (bool _success, ) = _to.call{value: _value, gas: 2100000}(_data);
        require(_success, "execute call failed");
        return _success;
    }

    function executeDelegate(
        address _to,
        bytes calldata _data
    ) public returns (bool success) {
        console.log("execute, call address: %s, with data", _to);
        (bool _success, ) = _to.delegatecall{gas: 5000}(_data);
        require(_success, "execute call failed");
        return _success;
    }

    // https://solidity-by-example.org/sending-ether/
    // Function to receive Ether. msg.data must be empty
    receive() external payable {
        emit Received(msg.sender, msg.value, "Received was called");
    }

    // Fallback function is called when msg.data is not empty
    fallback() external payable {
        emit Received(msg.sender, msg.value, "Fallback was called");
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}
