// index.ts
import * as express from "express";
import * as cors from "cors";
import { Telegraf, Markup } from "telegraf";
import * as dotenv from "dotenv";

dotenv.config();

// const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string;
const BOT_TOKEN = "6664428098:AAFpDzmvmTNDETnkXgsdcC6UFt_TZsTrFWo";
if (!BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is not set in .env file");
}

const bot = new Telegraf(BOT_TOKEN);
bot.use(Telegraf.log());
bot.start((ctx) => {
  const chatID = ctx.message.chat.id;
  const firstName = ctx.message.from.first_name;
  ctx.reply(
    `Hello,${firstName} Click http://localhost:3000/${chatID} to connect your wallet.`
  );
});
bot.command("menu", (ctx) => {
  return ctx.reply(
    "Choose an option:",
    Markup.inlineKeyboard([
      [Markup.button.callback("How To Play😎", "how_to_play")],
      [Markup.button.callback("View Open Lottery🔍", "open_lottery")],
      [Markup.button.callback("View My Lottery Ticket", "my_ticket")],
      [Markup.button.callback("View My Current Balance", "my_balance")],
      [Markup.button.callback("Transfer My NFT Into Pool", "transfer_nft")],
    ])
  );
});
bot.action("how_to_play", (ctx) => {
  // 这里你可以写代码来处理 "How To Play" 的逻辑
  ctx.answerCbQuery("Fetching how to play..."); // 这只是一个示例回复
  return ctx.reply(
    `How To Play
    1. Buy a ticket for 0.0001 ETH
    2. Wait for the lottery to end
    3. If your ticket is drawn, you win the NFT!`
  );
});
bot.action("open_lottery", (ctx) => {
  // 这里你可以写代码来处理 "View Open Lottery" 的逻辑
  ctx.answerCbQuery("Fetching open lotteries..."); // 这只是一个示例回复
});

bot.action("my_ticket", (ctx) => {
  // 这里你可以写代码来处理 "View My Lottery Ticket" 的逻辑
  ctx.answerCbQuery("Fetching your lottery ticket..."); // 这只是一个示例回复
});

bot.action("my_balance", (ctx) => {
  // 这里你可以写代码来处理 "View My Current Balance" 的逻辑
  ctx.answerCbQuery("Fetching your balance..."); // 这只是一个示例回复
});
bot.action("transfer_nft", (ctx) => {
  // 这里你可以写代码来处理 "Transfer My NFT Into Pool" 的逻辑
  ctx.answerCbQuery("Transferring your NFT into the pool..."); // 这只是一个示例回复
});

bot.launch();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/wallet-address", async (req, res) => {
  const walletAddress = req.body.walletAddress;
  const chatID = req.body.chatID;

  try {
    await bot.telegram.sendMessage(
      chatID,
      `Congrets! Your Wallet Are Securely Connected
         Wallet Address: ${walletAddress}`
    );

    // 紧接着发送带有三个按钮的消息
    await bot.telegram.sendMessage(
      chatID,
      "Choose an option:",
      Markup.inlineKeyboard([
        [Markup.button.callback("How To Play 😎", "how_to_play")],
        [Markup.button.callback("View Open Lottery 🔍", "view_open_lottery")],
        [Markup.button.callback("View My Lottery Ticket", "view_my_ticket")],
        [Markup.button.callback("View My Current Balance", "view_my_balance")],
        [
          Markup.button.callback(
            "Transfer My NFT Into Pool",
            "transfer_nft_in"
          ),
        ],
      ])
    );

    res.status(200).send({ message: "Address received and sent to Telegram!" });
  } catch (error) {
    console.error("Error sending message to Telegram:", error);
    res.status(500).send({ message: "Failed to send message to Telegram." });
  }
});

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
