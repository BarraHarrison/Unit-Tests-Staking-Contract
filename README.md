# Unit Tests – Staking Contract

This repository contains a comprehensive unit test suite for an ERC-20 token and a staking contract, implemented using **Hardhat**, **Mocha**, and **Chai**.
The focus of this project is correctness, safety, and audit-ready behavior, ensuring that all token mechanics and staking logic are thoroughly validated before being integrated into a production-level decentralized application.

This work represents the completion of **Week 11 – Testing & Auditing** in the blockchain study roadmap.

---

## MockToken Unit Tests

The `MockToken` contract is tested to ensure full compliance with ERC-20 standards and to guarantee correct behavior when used as the underlying asset in a staking protocol.
The tests validate supply accounting, balance isolation, allowance mechanics, and critical failure conditions.

1. **Minting assigns balances correctly**
   Confirms that minted tokens are correctly credited to the intended recipient.

2. **Minting increases total supply**
   Ensures that `totalSupply` is accurately updated whenever new tokens are minted.

3. **Multiple mints accumulate correctly**
   Verifies that repeated mint operations accumulate supply rather than overwrite existing values.

4. **Balances remain isolated between users**
   Ensures that minting tokens to one address does not affect the balances of other users.

5. **Minting to the zero address reverts**
   Confirms that the contract safely rejects minting to the zero address to prevent token loss.

6. **Approvals set allowances correctly**
   Verifies that calling `approve` correctly sets the allowance for a specified spender.

7. **transferFrom reduces allowance correctly**
   Ensures that delegated transfers correctly decrement the approved allowance.

8. **transferFrom reverts with insufficient allowance**
   Confirms that delegated transfers fail when the spender’s allowance is insufficient.

9. **approve overwrites existing allowances**
   Verifies that calling `approve` again replaces the previous allowance rather than incrementing it, in accordance with ERC-20 semantics.

---

## Staking Contract Unit Tests

The `Staking` contract is tested to validate correct staking behavior, accurate accounting, secure token custody, and essential safety guards.
These tests ensure predictable behavior for both staking and unstaking operations under all supported conditions.

1. **Users can stake tokens**
   Confirms that a user can successfully stake tokens after approving the staking contract.

2. **Staking balances and totalStaked accumulate correctly**
   Ensures that repeated staking operations correctly update per-user balances and the global `totalStaked` value.

3. **Staking transfers tokens to the contract**
   Verifies that staking operations transfer ERC-20 tokens to the staking contract, preventing phantom staking.

4. **Unstaking returns tokens to the user**
   Confirms that unstaking correctly returns tokens to the user and updates internal staking state.

5. **Users cannot unstake more than they have staked**
   Ensures the contract reverts when a user attempts to withdraw more tokens than they have deposited.

6. **Users cannot stake zero tokens**
   Confirms that zero-amount staking attempts are rejected to prevent invalid state transitions.

7. **Users cannot unstake zero tokens**
   Ensures that zero-amount unstaking attempts revert and do not affect contract state.

---

## Outcome

* **16 passing unit tests**
* Full validation of ERC-20 behavior required for staking
* Full coverage of staking entry, exit, and safety conditions
* Audit-ready foundation for reward logic and a full-stack decentralized application

This repository serves as a stable and verified base for the **Week 12 full-stack dApp capstone project**, which will integrate smart contracts, a frontend interface, and backend services.
