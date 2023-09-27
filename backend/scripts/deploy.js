"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
async function main() {
    const currentTimestampInSeconds = Math.round(Date.now() / 1000);
    const unlockTime = currentTimestampInSeconds + 60;
    const lockedAmount = hardhat_1.ethers.parseEther("0.001");
    const lock = await hardhat_1.ethers.deployContract("Lock", [unlockTime], {
        value: lockedAmount,
    });
    await lock.waitForDeployment();
    console.log(`Lock with ${hardhat_1.ethers.formatEther(lockedAmount)}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`);
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
