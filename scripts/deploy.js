const { ethers } = require("hardhat");

async function main() {
    const NFT = await ethers.getContractFactory("MyToken")
    const PriceFeed = await ethers.getContractFactory("PriceFeed");
    // Start deployment, returning a promise that resolves to a contract object
    const nft = await NFT.deploy("Zeonergy", 2);

    const price = await PriceFeed.deploy();

    const currentPrice = await price.getLatestPrice()

    console.log("NFT Contract deployed to address:", nft.address);
    console.log("PriceFeed Contract deployed to address:", price.address);
    console.log("Current Price is ", currentPrice);
}
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });