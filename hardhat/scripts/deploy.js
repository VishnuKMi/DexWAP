const hre = require('hardhat')

async function main () {
  const deployedContract = await ethers.deployContract('DexWAP')

  await deployedContract.waitForDeployment()

  console.log('Contract Address:', await deployedContract.getAddress())
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})

