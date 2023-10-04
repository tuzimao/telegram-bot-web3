// index.ts
import * as express from "express";
import * as cors from "cors";
import { Telegraf, Markup } from "telegraf";
import * as dotenv from "dotenv";
const Web3 = require("web3");
const LotteryManagerABI = require("./LotteryManagerABI.json");

dotenv.config();

// const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string;
const BOT_TOKEN = "6664428098:AAFpDzmvmTNDETnkXgsdcC6UFt_TZsTrFWo";
if (!BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is not set in .env file");
}

function initializeWeb3Contract() {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      "https://sepolia.infura.io/v3/73d62d6d12454a5d8866f12d641e9dc5"
    )
  );

  const abi = LotteryManagerABI;
  const contractAddress = "0xce617a0Bc3a26A5F880AADEB70A6390CDb8fBfC4";
  const contract = new web3.eth.Contract(abi, contractAddress);

  return { web3, contract };
}

async function displayOpenLotteries(ctx: any) {
  try {
    const response = await fetch("http://localhost:4000/view_open_lottery");
    const data = await response.json();
    const openLotteries = data.openLotteries;

    const buttons = openLotteries.map((lotteryId: number) => {
      return [
        Markup.button.callback(
          `Buy Tickets for Lottery ${lotteryId}`,
          `buy_ticket_${lotteryId}`
        ),
      ];
    });

    ctx.reply(
      `Open Lotteries: ${openLotteries}`,
      Markup.inlineKeyboard(buttons)
    );
  } catch (error) {
    ctx.reply("Error fetching open lotteries. Please try again later.");
  }
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
      [Markup.button.callback("How To Play 😎", "how_to_play")],
      [Markup.button.callback("View Open Lottery 🔍", "view_open_lottery")],
      [Markup.button.callback("View My Lottery Ticket", "view_my_ticket")],
      [Markup.button.callback("View My Current Balance", "view_my_balance")],
      [Markup.button.callback("Transfer My NFT Into Pool", "transfer_nft_in")],
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
bot.action("view_open_lottery", async (ctx) => {
  // 这里你可以写代码来处理 "View Open Lottery" 的逻辑
  ctx.answerCbQuery("Fetching open lotteries..."); // 这只是一个示例回复
  await displayOpenLotteries(ctx);
});
const userQueries: { [key: string]: { type: string; lotteryId: string } } = {};
bot.action(/buy_ticket_(\d+)/, async (ctx) => {
  const lotteryId = ctx.match![1];
  const chatId = ctx.update.callback_query!.message!.chat.id.toString();

  // Store user query
  userQueries[chatId] = {
    type: "buyTicket",
    lotteryId,
  };

  ctx.reply(
    `How many tickets would you like to buy for Lottery ${lotteryId}? (1 to 10)`,
    {
      reply_markup: {
        keyboard: [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], ["10"]],
        one_time_keyboard: true,
        resize_keyboard: true,
      },
    }
  );
});

bot.on("text", async (ctx) => {
  const chatId = ctx.message!.chat.id.toString();
  const text = ctx.message!.text;
  const userQuery = userQueries[chatId];

  if (userQuery && userQuery.type === "buyTicket") {
    const numberOfTickets = parseInt(text, 10);

    if (numberOfTickets >= 1 && numberOfTickets <= 10) {
      // 提供确认和取消按钮
      ctx.reply(
        `Do you want to buy ${numberOfTickets} tickets for Lottery ${userQuery.lotteryId}?`,
        Markup.inlineKeyboard([
          [
            Markup.button.callback(
              `Confirm`,
              `confirm_buy_${numberOfTickets}_${userQuery.lotteryId}`
            ),
            Markup.button.callback("Cancel", "cancel_buy"),
          ],
        ])
      );
    } else {
      ctx.reply("Please enter a valid number between 1 and 10.");
    }
  }
});

bot.action(/confirm_buy_([0-9]+)_([0-9]+)/, async (ctx) => {
  const numberOfTickets = ctx.match![1];
  const lotteryId = ctx.match![2];

  // TODO: Send lotteryId and numberOfTickets to the frontend

  ctx.reply(
    `Confirmed purchase of ${numberOfTickets} tickets for Lottery ${lotteryId}. Processing...`
  );
});

bot.action("cancel_buy", async (ctx) => {
  // Return to the view_open_lottery level
  await ctx.reply("Purchase cancelled.");
  await displayOpenLotteries(ctx);
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
      `Congrets! Your Wallet Are Securely Connected!`
    );

    // 紧接着发送带有三个按钮的消息
    await bot.telegram.sendMessage(
      chatID,
      "Choose an option:",
      Markup.inlineKeyboard([
        [Markup.button.callback("How To Play 😎", "how_to_play")],
        [Markup.button.callback("View Open Lottery 🔍", "view_open_lottery")],
        [
          Markup.button.callback(
            "View Lottery Winner 🔍",
            "view_closed_lottery"
          ),
        ],
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

app.get("/view_open_lottery", async (req, res) => {
  try {
    const { contract } = initializeWeb3Contract();
    // 获取开放的彩票
    const openLotteries = await contract.methods.getOpenLotteries().call();
    console.log("Open Lotteries:", openLotteries);
    res.status(200).json({ openLotteries });
  } catch (error) {
    console.error("Error fetching open lotteries:", error);
    res.status(500).send({ message: "Failed to fetch open lotteries." });
  }
});

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
