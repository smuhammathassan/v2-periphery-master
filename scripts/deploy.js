const hre = require("hardhat");
const { networks } = require("../hardhat.config");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

async function main() {

    var USDTFactory = await hre.ethers.getContractFactory("Miteek");
    var mockToken1Factory = await hre.ethers.getContractFactory("heuer");
    const [admin1, admin2, admin3] = await hre.ethers.getSigners();
    var weth = await hre.ethers.getContractFactory("WETH9");
    var uniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");
    var uniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
    var uniswapV2Router01 = await hre.ethers.getContractFactory("UniswapV2Router01")
    var uniswapV2Router02 = await hre.ethers.getContractFactory("UniswapV2Router02");
    var V2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");


    weth = await weth.deploy();
    uniswapV2Pair = await uniswapV2Pair.deploy();
    uniswapV2Factory = await uniswapV2Factory.deploy(admin1.address);
    uniswapV2Router01 = await uniswapV2Router01.deploy(uniswapV2Factory.address, weth.address);
    uniswapV2Router02 = await uniswapV2Router02.deploy(uniswapV2Factory.address, weth.address);
    mockToken1 = await mockToken1Factory.deploy()
    stable = await USDTFactory.deploy()


    const liquidityAltcoin = ethers.utils.parseUnits("1000000", 18)
    const liquidityAmountStable = ethers.utils.parseUnits("1000000", 18);

    //approving tokens to UniswapV2Router02
    await stable.approve(uniswapV2Router02.address, ethers.utils.parseUnits("10000000000000000000", 18));
    await mockToken1.approve(uniswapV2Router02.address, ethers.utils.parseUnits("10000000000000000000", 18));
    // current time
    let currentTime = Math.round(new Date().getTime() / 1000);

    //Adding Liquidity of Miteek and heuer erc20 tokens. 
    console.log("Adding liquidity TOKEN TO TOKEN");
    await uniswapV2Router02.addLiquidity(
        mockToken1.address, stable.address, liquidityAltcoin, liquidityAmountStable, 0, 0, admin1.address, currentTime + 9000000000, { gasLimit: 3000000 });
    console.log("TOKEN TO TOKEN LIQUIDITY ADDED!");

    //Swaping exact tokens for tokens
    console.log("swaping exact token for token");
    await uniswapV2Router02.swapExactTokensForTokens(100, 0, [mockToken1.address, stable.address], admin1.address, currentTime + 9000000000, { gasLimit: 3000000 });
    console.log("swaped!");

    //Swaping tokens for exact tokens
    console.log("swaping tokens for exact tokens");
    await uniswapV2Router02.swapTokensForExactTokens(100, 1000, [mockToken1.address, stable.address], admin1.address, currentTime + 9000000000, { gasLimit: 3000000 });
    console.log("done!");

    //Adding Liquidity Eth
    console.log("Adding liquidity Eth");
    await uniswapV2Router02.addLiquidityETH(stable.address, liquidityAmountStable, liquidityAmountStable, ethers.utils.parseEther('0.1'), admin1.address, currentTime + 9000000000, { value: ethers.utils.parseEther('0.1'), gasLimit: 3000000 });
    console.log("Liquidity added!");

    //Swaping eth for tokens
    console.log("Doing Exact Eth for token Swap");
    await uniswapV2Router02.swapExactETHForTokens(0, [weth.address, stable.address], admin1.address, currentTime + 9000000000, { value: ethers.utils.parseEther('0.01'), gasLimit: 3000000 })
    console.log("Done!");

    //Getting the LP count
    /* 
        This thing will not work on main net or test net will only work on hh,
        cauz when we try to save the return value of solidity function to js var 
        it just dun work, letme know about the way around, on this one. 
    */
    let tx = await uniswapV2Factory.getPair(weth.address, stable.address);
    let uV2pair = V2Pair.attach(tx);
    let balanceOf = await uV2pair.balanceOf(admin1.address);
    console.log(ethers.utils.formatUnits(balanceOf, 18), "balance of");
    await uV2pair.approve(uniswapV2Router02.address, balanceOf);


    //Removing Liquidity
    console.log("Removing Liquidity");
    await uniswapV2Router02.removeLiquidityETH(stable.address, ethers.utils.parseUnits("316.227766016837932199", 18), ethers.utils.parseUnits("0", 18), ethers.utils.parseEther('0'), admin1.address, currentTime + 9000000000, { gasLimit: 3000000 });
    console.log("removed!");


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
