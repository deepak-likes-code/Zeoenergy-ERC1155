/* hardhat.config.js */
require('dotenv').config()

require("@nomiclabs/hardhat-waffle")



module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: process.env.URL,
      accounts: [process.env.PRIVATEKEY]
    }
  }
};