import { expect } from "chai";
import hre from "hardhat";
import { ethers } from "ethers";

describe("MockToken", function () {
    it("allows a user to receive minted tokens", async function () {
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545")

        const deployer = await provider.getSigner(0);
        const user = await provider.getSigner(1);

        const artifact = await hre.artifacts.readArtifact("MockToken");

        const factory = new ethers.ContractFactory(
            artifact.abi,
            artifact.bytecode,
            deployer
        );

        const token = (await factory.deploy(
            "Mock Token",
            "MOCK"
        )) as any;

        await token.waitForDeployment();

        const mintAmount = ethers.parseEther("100");
        await token.mint(await user.getAddress(), mintAmount);

        const balance = await token.balanceOf(await user.getAddress());
        expect(balance).to.equal(mintAmount);
    });
});