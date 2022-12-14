require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('hardhat-contract-sizer');
require("hardhat-gas-reporter");


require("dotenv").config();


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const { API_URL, ETH_SCAN, PRIVATE_KEY, GOERLI_API } = process.env;

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.13",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    rinkeby: {
      url: `${API_URL}`,
      accounts: [`${PRIVATE_KEY}`]
    },
    goerli: {
      url: `${GOERLI_API}`,
      accounts: [`${PRIVATE_KEY}`]
    }
  },
  etherscan: {
    apiKey: ETH_SCAN
  },
  gasReporter: {
    currency: 'CHF',
    gasPrice: 21
  }

};
