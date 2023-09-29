// scripts/buyTickets.ts
import { ethers } from "hardhat";

async function main() {
  const [sender] = await ethers.getSigners();

  const lotteryManagerAddress = "0xce617a0Bc3a26A5F880AADEB70A6390CDb8fBfC4";
  const LotteryManager = await ethers.getContractAt(
    "LotteryManager",
    lotteryManagerAddress
  );

  const lotteryId = 1;
  const numberOfTickets = BigInt(5);
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
