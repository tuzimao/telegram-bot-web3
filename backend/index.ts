// index.ts
import * as express from "express";
import * as cors from "cors";
import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";

dotenv.config();

// const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string;
const BOT_TOKEN = "6664428098:AAFpDzmvmTNDETnkXgsdcC6UFt_TZsTrFWo";
if (!BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is not set in .env file");
}

const bot = new Telegraf(BOT_TOKEN);
bot.start((ctx) => {
  const chatID = ctx.message.chat.id;
  ctx.reply(
    `Hello, World! Click http://localhost:3000/${chatID} to connect your wallet.`
  );
});
bot.launch();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/wallet-address", async (req, res) => {
  const walletAddress = req.body.walletAddress;
  const chatID = req.body.chatID;

  try {
    await bot.telegram.sendMessage(chatID, `Wallet Address: ${walletAddress}`);
    res.status(200).send({ message: "Address received and sent to Telegram!" });
  } catch (error) {
    console.error("Error sending message to Telegram:", error);
    res.status(500).send({ message: "Failed to send message to Telegram." });
  }
});

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
