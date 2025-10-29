// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0; //Do not change the solidity version as it negativly impacts submission grading

import "hardhat/console.sol";
import "./ExampleExternalContract.sol";

contract Staker {
    ExampleExternalContract public exampleExternalContract;

    constructor(address exampleExternalContractAddress) {
        exampleExternalContract = ExampleExternalContract(
            exampleExternalContractAddress
        );
    }

    mapping(address => uint256) public balances;

    uint256 public constant threshold = 1 ether;

    uint256 public deadline = block.timestamp + 72 hours;

    modifier notCompleted() {
        require(
            !exampleExternalContract.completed(),
            "The contract has already been completed."
        );
        _;
    }

    error ZeroAddressDetected();
    error ZeroAmount();

    event Stake(address, uint256);

    function stake() public payable {
        if (msg.sender == address(0)) {
            revert ZeroAddressDetected();
        }

        if (msg.value == 0) {
            revert ZeroAmount();
        }
        balances[msg.sender] += msg.value;
        emit Stake(msg.sender, msg.value);
    }

    // Collect funds in a payable `stake()` function and track individual `balances` with a mapping:
    // (Make sure to add a `Stake(address,uint256)` event and emit it for the frontend `All Stakings` tab to display)

    function withdraw() public notCompleted {
        if (block.timestamp > deadline) {
            if (address(this).balance != threshold) {
                uint256 amount = balances[msg.sender];
                payable(msg.sender).transfer(amount);
            }
        }
    }

    function execute() public notCompleted {
        if (block.timestamp > deadline) {
            if (address(this).balance >= threshold) {
                exampleExternalContract.complete{
                    value: address(this).balance
                }();
            }
        }
    }

    // contracts/Staker.sol
    function timeLeft() public view returns (uint256) {
        // Ensure that the deadline is set correctly
        if (deadline <= block.timestamp) {
            return 0;
        } // Check if the deadline has already passed

        // Calculate the time left
        uint256 timeRemaining = deadline - block.timestamp; // This will not overflow since we checked above
        return timeRemaining;
    }

    receive() external payable {
        stake();
    }

    // After some `deadline` allow anyone to call an `execute()` function
    // If the deadline has passed and the threshold is met, it should call `exampleExternalContract.complete{value: address(this).balance}()`

    // If the `threshold` was not met, allow everyone to call a `withdraw()` function to withdraw their balance

    // Add a `timeLeft()` view function that returns the time left before the deadline for the frontend

    // Add the `receive()` special function that receives eth and calls stake()
}
