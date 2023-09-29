// scripts/deploy.ts

import { ethers } from "hardhat";

async function main() {
  const SimpleNFTFactory = await ethers.getContractFactory("SimpleNFT");

  console.log("Deploying SimpleNFT...");
  const simpleNFT = await SimpleNFTFactory.deploy();

  console.log("SimpleNFT deployed to:", simpleNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
