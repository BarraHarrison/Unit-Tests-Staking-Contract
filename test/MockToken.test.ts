import { expect } from "chai";
import hre from "hardhat";

const viem = (hre as any).viem;

describe("MockToken", function () {
    it("allows a user to receive minted tokens", async function () {
        const [deployer, user] = await viem.getWalletClients();

        const token = await viem.deployContract("MockToken", [
            "Mock Token",
            "MOCK",
        ]);

        const mintAmount = 100n * 10n ** 18n;
        await token.write.mint([user.account.address, mintAmount]);

        const balance = await token.read.balanceOf([user.account.address]);

        expect(balance).to.equal(mintAmount);
    });
});
