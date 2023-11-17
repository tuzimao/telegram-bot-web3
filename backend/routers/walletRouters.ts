import * as express from "express";
import { Request, Response } from "express";
import { Telegraf, Markup } from "telegraf";
import { sendMainMenu } from "../telegram/botcommands";
import { userWallets } from "../telegram/bot";
import { bot } from "../telegram/bot";

const router = express.Router();

router.post("/wallet-address", async (req, res) => {
  const walletAddress = req.body.walletAddress;
  const chatID = req.body.chatID;

  userWallets[chatID] = walletAddress;

  try {
    await bot.telegram.sendMessage(
      chatID,
      `Congrets! Your Wallet Are Securely Connected!`
    );

    await sendMainMenu({
      reply: (text: string, markup: any) =>
        bot.telegram.sendMessage(chatID, text, markup),
    });

    res.status(200).send({ message: "Address received and sent to Telegram!" });
  } catch (error) {
    console.error("Error sending message to Telegram:", error);
    res.status(500).send({ message: "Failed to send message to Telegram." });
  }
});
