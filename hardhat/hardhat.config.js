require('@nomicfoundation/hardhat-toolbox')
/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: '0.8.18',
  defaultNetwork: 'sepolia',
  networks: {
    hardhat: {},
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`,
      accounts: [process.env.REACT_APP_PRIVATE_KEY]
    }
  }
}
