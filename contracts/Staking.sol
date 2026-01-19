// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IERC20 {
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    function transfer(
        address to,
        uint256 amount
    ) external returns (bool);
}

contract Staking {
    IERC20 public immutable stakingToken;

    mapping(address => uint256) public balances;
    uint256 public totalStaked;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);

    constructor(address _stakingToken) {
        require(_stakingToken != address(0), "Invalid token");
        stakingToken = IERC20(_stakingToken);
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Cannot stake zero");

        bool success = stakingToken.transferFrom(
            msg.sender,
            address(this),
            amount
        );
        require(success, "Transfer failed");

        balances[msg.sender] += amount;
        totalStaked += amount;

        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) external {
        require(amount > 0, "Cannot unstake zero");
        require(balances[msg.sender] >= amount, "Insufficient stake");

        balances[msg.sender] -= amount;
        totalStaked -= amount;

        bool success = stakingToken.transfer(
            msg.sender,
            amount
        );
        require(success, "Transfer failed");

        emit Unstaked(msg.sender, amount);
    }
}