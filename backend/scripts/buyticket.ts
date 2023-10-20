// scripts/buyTickets.ts
import { ethers } from "hardhat";

async function main() {
  const [sender] = await ethers.getSigners();

  const lotteryManagerAddress = "0xdcF6eF9fd2FcfE2125f23F6Fc0280fDfb9F9A819";
  const LotteryManager = await ethers.getContractAt(
    "LotteryManagerV2",
    lotteryManagerAddress
  );

  const lotteryId = 1;
  const numberOfTickets = BigInt(1);
  const ticketPrice = ethers.parseEther("0.0001");
  const totalCost = ticketPrice * numberOfTickets;

  console.log(
    `Buying ${numberOfTickets} tickets for lottery ID: ${lotteryId}...`
  );

  const tx = await LotteryManager.buyTickets(lotteryId, numberOfTickets, {
    value: totalCost,
  });

  const receipt = await tx.wait();

  console.log(`Transaction hash: ${receipt.transactionHash}`);
  console.log(`Bought ${numberOfTickets} tickets for lottery ID: ${lotteryId}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
