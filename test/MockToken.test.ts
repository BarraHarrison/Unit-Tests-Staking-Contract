import { expect } from "chai";
import hre from "hardhat";

const ethers = (hre as any).ethers;

describe("MockToken", function () {
    it("allows a user to receive minted tokens", async function () {
        const [, user] = await ethers.getSigners();

        const MockToken = await ethers.getContractFactory("MockToken");
        const token = await MockToken.deploy("Mock Token", "MOCK");

        const mintAmount = ethers.parseEther("100");
        await token.mint(user.address, mintAmount);

        const balance = await token.balanceOf(user.address);
        expect(balance).to.equal(mintAmount);
    });
});
