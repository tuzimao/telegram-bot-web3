import * as express from "express";
import { Request, Response } from "express";
import { Telegraf, Markup } from "telegraf";
import { initializeWeb3Contract } from "../telegram/bot";
import { userWallets } from "../telegram/bot";

const router = express.Router();

router.get("/view_open_lottery", async (req, res) => {
  try {
    const { contract } = initializeWeb3Contract();
    const openLotteries = await contract.methods.getOpenLotteries().call();
    const remainingTickets = await Promise.all(
      openLotteries.map((lotteryId: number) =>
        contract.methods.getRemainingTicketsForLottery(lotteryId).call()
      )
    );

    const result = openLotteries.map((lotteryId: number, index: number) => ({
      lotteryId,
      remainingTickets: remainingTickets[index],
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching open lotteries:", error);
    res.status(500).send({ message: "Failed to fetch open lotteries." });
  }
});

router.get("/view_closed_lotteries", async (req, res) => {
  try {
    const { contract } = initializeWeb3Contract();
    const closedLotteriesDetails = await contract.methods
      .getClosedLotteriesDetails()
      .call();
    // 解析返回的数据
    const closedLotteries = closedLotteriesDetails[0].map(
      (id: any, index: number) => {
        return {
          id,
          winner: closedLotteriesDetails[1][index],
          participants: closedLotteriesDetails[2][index],
        };
      }
    );
    res.status(200).json({ closedLotteries });
  } catch (error) {
    console.error("Error fetching closed lotteries details:", error.message);
    res
      .status(500)
      .send({ message: "Failed to fetch closed lotteries details." });
  }
});

router.get("/view_my_ticket", async (req, res) => {
  try {
    const { contract } = initializeWeb3Contract();
    const chatID = req.query.chatID as string;
    const walletAddress = userWallets[chatID];
    const myTicket = await contract.methods
      .getTicketsBoughtByUser(walletAddress)
      .call();
    res.status(200).json({ myTicket });
    console.log("My Ticket:", myTicket);
  } catch (error) {
    console.error("Error fetching my ticket:", error.message);
    res.status(500).send({ message: "Failed to fetch my ticket." });
  }
});
