const hre = require("hardhat");
const { networks } = require("../hardhat.config");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();




async function main() {

  const accounts = await hre.ethers.getSigners();
  var add;
  var wethAdd;
  if (networks == networks.goerli) {
    add = process.env.address;
    wethAdd = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6';
  } else {
    add = accounts[0].address;
    const WETH9 = await hre.ethers.getContractFactory("WETH9");
    const wETH9 = await WETH9.deploy();
    await wETH9.deployed();
    wethAdd = wETH9.address;
  }


  const UniswapV2Pair = await hre.ethers.getContractFactory("UniswapV2Pair");
  const uniswapV2Pair = await UniswapV2Pair.deploy();
  await uniswapV2Pair.deployed();
  console.log("uniswapV2Pair deployed to:", uniswapV2Pair.address);

  const UniswapV2ERC20 = await hre.ethers.getContractFactory("UniswapV2Pair");
  const uniswapV2ERC20 = await UniswapV2ERC20.deploy();
  await uniswapV2ERC20.deployed();
  console.log("UniswapV2ERC20 deployed to:", uniswapV2ERC20.address);

  const UniswapV2Factory = await hre.ethers.getContractFactory("UniswapV2Factory");
  const uniswapV2Factory = await UniswapV2Factory.deploy(add);
  await uniswapV2Factory.deployed();
  console.log("uniswapV2Factory deployed to:", uniswapV2Factory.address);

  const UniswapV2Router = await hre.ethers.getContractFactory("UniswapV2Router02");
  const uniswapV2Router = await UniswapV2Router.deploy(uniswapV2Factory.address, wethAdd);
  await uniswapV2Router.deployed();
  console.log("UniswapV2Router deployed to:", uniswapV2Router.address);

  const TokenA = await hre.ethers.getContractFactory("Miteek");
  const tokenA = await TokenA.deploy();
  await tokenA.deployed();
  console.log("TokenA deployed to:", tokenA.address);


  const TokenB = await hre.ethers.getContractFactory("heuer");
  const tokenB = await TokenB.deploy();
  await tokenB.deployed();
  console.log("TokenB deployed to:", tokenB.address);

  console.log("approving a tokens ...");
  await tokenA.approve(uniswapV2Router.address, 10);
  console.log("approving b tokens ...");
  await tokenB.approve(uniswapV2Router.address, 5);

  await uniswapV2Router.addLiquidity(tokenA.address, tokenB.address, 10, 5, 10, 5, accounts[0].address, 1661391466, { gasLimit: 3000000 });

  if (networks == networks.goerli) {
    await hre.run("verify:verify", {
      address: uniswapV2Pair.address,
      constructorArguments: [],
    });
    await hre.run("verify:verify", {
      address: uniswapV2ERC20.address,
      constructorArguments: [],
    });
    await hre.run("verify:verify", {
      address: uniswapV2Factory.address,
      constructorArguments: [add],
    });
    await hre.run("verify:verify", {
      address: uniswapV2Router.address,
      constructorArguments: [uniswapV2Factory.address, wethAdd],
    });
  }




}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
