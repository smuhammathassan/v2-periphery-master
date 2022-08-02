
// testing of  Price Consumer Smart Contract
const hre = require("hardhat");
const ethers = hre.ethers;
const chai = require("chai");
const { solidity } = require("ethereum-waffle");
const { expect } = chai;
const fs = require("fs");
const path = require("path");
chai.use(solidity);
const network = hre.hardhatArguments.network;
describe(" PriceConsumer Testing :: DEPLOY, Get Prices ::", function () {

  beforeEach("setup", async function () {
    timeout(200000);
    [admin1, admin2, admin3, admin4, admin5, alice] = await hre.ethers.getSigners()

    const USDTFactory = await hre.ethers.getContractFactory("Miteek");
    const mockToken1Factory = await hre.ethers.getContractFactory("heuer");

    const contractAddresses = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "../../config.json"), "utf8")
    );


    // deploy  admin registry smart contract
    const deployedGovAdminRegistry = await upgrades.deployProxy(RegistryAdminFactory, [
      admin1.address, admin2.address, admin3.address, admin4.address
    ])
    const weth = await hre.ethers.getContractFactory("WETH9");
    const uniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");
    const uniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
    const uniswapV2Router01 = await hre.ethers.getContractFactory("UniswapV2Router01")
    const uniswapV2Router02 = await hre.ethers.getContractFactory("UniswapV2Router02");

    weth = await weth.deploy();
    uniswapV2Pair = await uniswapV2Pair.deploy();
    uniswapV2Factory = await uniswapV2Factory.deploy(admin1.address);
    uniswapV2Router01 = await uniswapV2Router01.deploy(uniswapV2Factory.address, weth.address);
    uniswapV2Router02 = await uniswapV2Router02.deploy(uniswapV2Factory.address, weth.address);
    mockToken1 = await mockToken1Factory.deploy()
    stable = await USDTFactory.deploy()




    const liquidityAltcoin = ethers.utils.parseUnits("10000000", 18)
    const liquidityAmountStable = ethers.utils.parseUnits("10000000", 18);
    /** adding liquidity of mocktoken with stable coin USDT */
    await stable.approve(uniswapV2Router02.address, ethers.utils.parseUnits("10000000000000000000", 18));
    await mockToken1.approve(uniswapV2Router02.address, ethers.utils.parseUnits("10000000000000000000", 18));
    await claimToken.approve(uniswapV2Router02.address, ethers.utils.parseUnits("10000000000000000000", 18));
    // current time
    let currentTime = Math.round(new Date().getTime() / 1000);
    await uniswapV2Router02.addLiquidity(
      mockToken1.address, stable.address, liquidityAltcoin, liquidityAmountStable, 0, 0, admin1.address, currentTime + 9000000000);

    await uniswapV2Router02.addLiquidityETH(stable.address, liquidityAmountStable, liquidityAmountStable, ethers.utils.parseEther('100'), admin1.address, currentTime + 9000000000, { value: ethers.utils.parseEther('100') });

    await mockToken1.approve(uniswapV2Router02.address, liquidityAltcoin);
    await uniswapV2Router02.addLiquidityETH(mockToken1.address, liquidityAltcoin, liquidityAltcoin, ethers.utils.parseEther('100'), admin1.address, currentTime + 9000000000, { value: ethers.utils.parseEther('100') });
    await uniswapV2Router02.addLiquidity(
      claimToken.address, stable.address, liquidityAltcoin, liquidityAmountStable, 0, 0, admin1.address, currentTime + 9000000000);
    await uniswapV2Router02.addLiquidityETH(claimToken.address, liquidityAltcoin, liquidityAltcoin, ethers.utils.parseEther('100'), admin1.address, currentTime + 9000000000, { value: ethers.utils.parseEther('100') });

  )
};
};
