import { expect } from "chai";
import hre from "hardhat";

const ethers = (hre as any).ethers;

describe("Staking", function () {
    it("allows a user to stake tokens", async function () {
        const [deployer, user] = await ethers.getSigners();

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
});
