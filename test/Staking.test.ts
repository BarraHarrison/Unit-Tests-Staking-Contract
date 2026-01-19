import { expect } from "chai";
import hre from "hardhat";
import { ethers } from "ethers";

describe("Staking", function () {
    it("allows a user to stake tokens", async function () {
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

        const deployer = await provider.getSigner(0);
        const user = await provider.getSigner(1);

        const tokenArtifact = await hre.artifacts.readArtifact("MockToken");
        const tokenFactory = new ethers.ContractFactory(
            tokenArtifact.abi,
            tokenArtifact.bytecode,
            deployer
        );

        const token = (await tokenFactory.deploy(
            "Mock Token",
            "MOCK"
        )) as any;

        await token.waitForDeployment();

        const stakingArtifact = await hre.artifacts.readArtifact("Staking");
        const stakingFactory = new ethers.ContractFactory(
            stakingArtifact.abi,
            stakingArtifact.bytecode,
            deployer
        );

        const staking = (await stakingFactory.deploy(
            await token.getAddress()
        )) as any;

        await staking.waitForDeployment();

        const stakeAmount = ethers.parseEther("100");

        await token.mint(await user.getAddress(), stakeAmount);
        await token
            .connect(user)
            .approve(await staking.getAddress(), stakeAmount);


        await staking
            .connect(user)
            .stake(stakeAmount);

        const userStake = await staking.balances(
            await user.getAddress()
        );

        const totalStaked = await staking.totalStaked();

        expect(userStake).to.equal(stakeAmount);
        expect(totalStaked).to.equal(stakeAmount);
    });

    it("updates user balance and totalStaked correctly across multiple stakes", async function () {
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

        const deployer = await provider.getSigner(0);
        const user = await provider.getSigner(1);

        const tokenArtifact = await hre.artifacts.readArtifact("MockToken");
        const tokenFactory = new ethers.ContractFactory(
            tokenArtifact.abi,
            tokenArtifact.bytecode,
            deployer
        );

        const token = (await tokenFactory.deploy(
            "Mock Token",
            "MOCK"
        )) as any;

        await token.waitForDeployment();

        const stakingArtifact = await hre.artifacts.readArtifact("Staking");
        const stakingFactory = new ethers.ContractFactory(
            stakingArtifact.abi,
            stakingArtifact.bytecode,
            deployer
        );

        const staking = (await stakingFactory.deploy(
            await token.getAddress()
        )) as any;

        await staking.waitForDeployment();


        const totalMint = ethers.parseEther("500");
        await token.mint(await user.getAddress(), totalMint);

        await token
            .connect(user)
            .approve(await staking.getAddress(), totalMint);


        const firstStake = ethers.parseEther("150");
        const secondStake = ethers.parseEther("200");

        await staking.connect(user).stake(firstStake);
        await staking.connect(user).stake(secondStake);

        const userStake = await staking.balances(await user.getAddress());
        const totalStaked = await staking.totalStaked();

        expect(userStake).to.equal(firstStake + secondStake);
        expect(totalStaked).to.equal(firstStake + secondStake);
    });
});
