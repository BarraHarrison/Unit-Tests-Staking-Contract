import { expect } from "chai";
import hre from "hardhat";
import { ethers } from "ethers";

describe("MockToken", function () {
    it("allows a user to receive minted tokens", async function () {
        const provider = new ethers.JsonRpcProvider(
            "http://127.0.0.1:8545"
        );

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

    it("increases totalSupply when tokens are minted", async function () {
        const provider = new ethers.JsonRpcProvider(
            "http://127.0.0.1:8545"
        );

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

        const initialSupply = await token.totalSupply();
        expect(initialSupply).to.equal(0n);

        const mintAmount = ethers.parseEther("250");

        await token.mint(await user.getAddress(), mintAmount);

        const finalSupply = await token.totalSupply();
        expect(finalSupply).to.equal(mintAmount);
    });

    it("accumulates totalSupply correctly across multiple mints", async function () {
        const provider = new ethers.JsonRpcProvider(
            "http://127.0.0.1:8545"
        );

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

        const mintAmount1 = ethers.parseEther("100");
        const mintAmount2 = ethers.parseEther("150");

        await token.mint(await user.getAddress(), mintAmount1);
        await token.mint(await user.getAddress(), mintAmount2);

        const expectedTotal = mintAmount1 + mintAmount2;

        const balance = await token.balanceOf(await user.getAddress());
        const totalSupply = await token.totalSupply();

        expect(balance).to.equal(expectedTotal);
        expect(totalSupply).to.equal(expectedTotal);
    });

    it("keeps balances isolated between different users", async function () {
        const provider = new ethers.JsonRpcProvider(
            "http://127.0.0.1:8545"
        );

        const deployer = await provider.getSigner(0);
        const userA = await provider.getSigner(1);
        const userB = await provider.getSigner(2);

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

        const mintA = ethers.parseEther("100");
        const mintB = ethers.parseEther("250");

        await token.mint(await userA.getAddress(), mintA);
        await token.mint(await userB.getAddress(), mintB);

        const balanceA = await token.balanceOf(await userA.getAddress());
        const balanceB = await token.balanceOf(await userB.getAddress());
        const totalSupply = await token.totalSupply();

        expect(balanceA).to.equal(mintA);
        expect(balanceB).to.equal(mintB);
        expect(totalSupply).to.equal(mintA + mintB);
    });

    it("reverts when minting to the zero address", async function () {
        const provider = new ethers.JsonRpcProvider(
            "http://127.0.0.1:8545"
        );

        const deployer = await provider.getSigner(0);

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

        const zeroAddress = ethers.ZeroAddress;
        const mintAmount = ethers.parseEther("100");

        let reverted = false;

        try {
            await token.mint(zeroAddress, mintAmount);
        } catch (error) {
            reverted = true;
        }

        expect(reverted).to.equal(true);
    });

    it("allows a user to approve a spender and sets allowance correctly", async function () {
        const provider = new ethers.JsonRpcProvider(
            "http://127.0.0.1:8545"
        );

        const deployer = await provider.getSigner(0);
        const user = await provider.getSigner(1);
        const spender = await provider.getSigner(2);

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

        const mintAmount = ethers.parseEther("500");
        await token.mint(await user.getAddress(), mintAmount);

        const approveAmount = ethers.parseEther("200");
        await token
            .connect(user)
            .approve(await spender.getAddress(), approveAmount);

        const allowance = await token.allowance(
            await user.getAddress(),
            await spender.getAddress()
        );

        expect(allowance).to.equal(approveAmount);

        const balance = await token.balanceOf(await user.getAddress());
        expect(balance).to.equal(mintAmount);
    });

});