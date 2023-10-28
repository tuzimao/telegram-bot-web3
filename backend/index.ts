// index.ts
import * as express from "express";
import * as cors from "cors";
import { Telegraf, Markup } from "telegraf";
import * as dotenv from "dotenv";
import * as http from "http";
import * as socketIo from "socket.io";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
declare module "telegraf" {
  interface Context {
    socket?: any;
  }
}

const Web3 = require("web3");
const LotteryManagerABI = require("./LotteryManagerV2ABI.json");
const userWallets: { [chatId: string]: string } = {};

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // 允许的源
    credentials: true,
  })
);
app.use(express.json());
const server = http.createServer(app);
const io = new socketIo.Server(server, {
  cors: {
    origin: "http://localhost:3000", // 允许的源
    methods: ["GET", "POST"], // 允许的 HTTP 方法
    allowedHeaders: ["my-custom-header"], // 允许的头部
    credentials: true, // 允许凭据
  },
});

let currentSocket: any = null;

const activeSockets: { [chatId: string]: any } = {};

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("setChatId", (chatId) => {
    console.log("setChatId received with chatId:", chatId);
    activeSockets[chatId] = socket;
  });

  socket.on("sendReceipt", async (data) => {
    const receipt = data.receipt;
    const chatID = data.chatId;

    try {
      await bot.telegram.sendMessage(
        chatID,
        `Purchase Successful! Here's your transaction receipt:\nTransaction Hash: ${receipt.transaction}\nBlock Number: ${receipt.blockNumber}\n...`, // 根据需要添加更多的收据详情
        Markup.inlineKeyboard([
          [Markup.button.callback("Back To Main Menu", "back_to_main_menu")],
        ])
      );
      await sendMainMenu(chatID);
    } catch (error) {
      console.error("Error sending receipt to Telegram:", error);
    }
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    // 删除这个 socket 从 activeSockets 对象
    for (let chatId in activeSockets) {
      if (activeSockets[chatId] === socket) {
        delete activeSockets[chatId];
      }
    }
  });
});
// const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string;
const BOT_TOKEN = "6664428098:AAFpDzmvmTNDETnkXgsdcC6UFt_TZsTrFWo";
if (!BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is not set in .env file");
}

function initializeWeb3Contract() {
  const web3 = new Web3(
    new Web3.providers.WebsocketProvider(
      "wss://sepolia.infura.io/ws/v3/73d62d6d12454a5d8866f12d641e9dc5"
    )
  );

  const abi = LotteryManagerABI;
  const contractAddress = "0xdcF6eF9fd2FcfE2125f23F6Fc0280fDfb9F9A819";
  const contract = new web3.eth.Contract(abi, contractAddress);

  return { web3, contract };
}

async function sendMainMenu(ctx: any) {
  return ctx.reply(
    "Choose an option:",
    Markup.inlineKeyboard([
      [Markup.button.callback("How To Play 😎", "how_to_play")],
      [Markup.button.callback("View Open Lottery 🔍", "view_open_lottery")],
      [Markup.button.callback("View Lottery Winner 🔍", "view_closed_lottery")],
      [Markup.button.callback("View My Lottery Ticket", "view_my_ticket")],
      [Markup.button.callback("View My Current Balance", "view_my_balance")],
      [Markup.button.callback("Transfer My NFT Into Pool", "transfer_nft_in")],
    ])
  );
}
const apiKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjU4NDZiMmMxLWY5MWYtNDA5NC1iN2JhLWIzYTMxMWE3N2EwNSIsIm9yZ0lkIjoiMzYyMDM4IiwidXNlcklkIjoiMzcyMDc4IiwidHlwZUlkIjoiNGQ0ODBkNDQtOThlZC00NGY4LWIxMmUtMjYxYjBkNTljMDc1IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTgxMjAyMDcsImV4cCI6NDg1Mzg4MDIwN30.Wn8jrHa5oZRYfFmePC8nO0Y9Uq-csfypfxnkgMZGWbM"; // replace with your actual key
Moralis.start({ apiKey });
const metadataCache: any = {};
async function displayOpenLotteries(ctx: any) {
  try {
    const response = await fetch("http://localhost:4000/view_open_lottery");
    const data = await response.json();
    let message = `Open Lotteries:\n`;

    const lotteryButtons = []; // Moved outside the loop to collect all buttons

    for (let lotteryInfo of data) {
      const lotteryDetails = await getLotteryDetails(lotteryInfo.lotteryId);
      const nftdata = await getNFTMetadata(
        lotteryDetails.nftContract,
        lotteryDetails.tokenId
      );

      message += `Lottery ${lotteryInfo.lotteryId} (${lotteryInfo.remainingTickets} tickets left) - NFT: ${nftdata.name} (${nftdata.symbol})\n`;

      // Add a button for each lottery
      lotteryButtons.push([
        Markup.button.callback(
          `Buy Tickets for Lottery ${lotteryInfo.lotteryId} (${lotteryInfo.remainingTickets} left)`,
          `buy_ticket_${lotteryInfo.lotteryId}`
        ),
      ]);

      // Check if NFT has metadata and add a button to view it
      if (nftdata.metadata && nftdata.metadata !== "No metadata") {
        metadataCache[lotteryInfo.lotteryId] = nftdata.metadata;
        lotteryButtons.push([
          Markup.button.callback(
            `View Metadata for Lottery ${lotteryInfo.lotteryId}`,
            `view_metadata_${lotteryInfo.lotteryId}`
          ),
        ]);
      } else {
        message += `Metadata: No metadata\n`;
      }
    }

    console.log("Open Lotteries:", message);
    ctx.reply(message);

    // Add the "Back To Main Menu" button
    lotteryButtons.push([
      Markup.button.callback("Back To Main Menu", "back_to_main_menu"),
    ]);

    ctx.reply(
      `Open Lotteries: ${data
        .map((lotteryInfo: any) => lotteryInfo.lotteryId)
        .join(", ")}`,
      Markup.inlineKeyboard(lotteryButtons)
    );
  } catch (error) {
    ctx.reply("Error fetching open lotteries. Please try again later.");
  }
}

// This function fetches the metadata of an NFT from Morails

async function getNFTMetadata(nftContract: string, tokenId: number) {
  try {
    const chains = [EvmChain.SEPOLIA];
    console.log("nftContract ::", nftContract); ///
    for (const chain of chains) {
      const response = await Moralis.EvmApi.nft.getNFTMetadata({
        address: nftContract,
        chain,
        tokenId: tokenId.toString(),
      });
      console.log("NFT:", response?.toJSON()); ///
      const NFT_tokenId = response?.toJSON().token_id;
      const NFT_address = response?.toJSON().token_address;
      console.log("NFT_tokenId:", NFT_tokenId); ///
      console.log("NFT_address:", NFT_address); ///

      const NFT_data = response?.toJSON();

      return {
        name: NFT_data.name || "Unknown",
        symbol: NFT_data.symbol || "No description",
        metadata: NFT_data.metadata || "No metadata",
      };
    }
  } catch (error) {
    console.error("Error fetching NFT metadata:", error);
    throw error;
  }
}
async function getLotteryDetails(lotteryId: number) {
  const { contract } = initializeWeb3Contract();
  try {
    const lottery = await contract.methods.lotteries(lotteryId).call();
    console.log("Lottery details:", lottery); ///
    console.log("Lottery details:", lottery.nftContract); ///
    console.log("Lottery details:", lottery.tokenId); ///
    return {
      nftContract: lottery.nftContract,
      tokenId: lottery.tokenId,
    };
  } catch (error) {
    console.error("Error fetching lottery details:", error);
    throw error;
  }
}

async function displayClosedLotteries(ctx: any) {
  try {
    const response = await fetch("http://localhost:4000/view_closed_lotteries");
    const data = await response.json();
    const closedLotteries = data.closedLotteries;

    // 格式化彩票详情以供显示
    const details = closedLotteries
      .map((lottery) => {
        return `Lottery ${lottery.id}: Winner - ${lottery.winner}`;
      })
      .join("\n");
    const backToMainMenuButton = [
      Markup.button.callback("Back To Main Menu", "back_to_main_menu"),
    ];

    ctx.reply(details, Markup.inlineKeyboard(backToMainMenuButton));
  } catch (error) {
    ctx.reply("Error fetching lottery winners. Please try again later.");
  }
}

async function displayMyTicket(ctx: any) {
  try {
    const chatID =
      ctx.message?.chat.id.toString() ||
      ctx.update.callback_query?.message?.chat.id.toString();

    const response = await fetch(
      `http://localhost:4000/view_my_ticket?chatID=${chatID}`
    );
    const data = await response.json();
    const myTicket = data.myTicket;
    const backToMainMenuButton = [
      Markup.button.callback("Back To Main Menu", "back_to_main_menu"),
    ];

    if (myTicket && myTicket.lotteryIds.length > 0) {
      let message = "Your Tickets:\n";
      for (let i = 0; i < myTicket.lotteryIds.length; i++) {
        message += `Lottery ${myTicket.lotteryIds[i]}: ${myTicket.ticketCounts[i]} tickets\n`;
      }
      ctx.reply(message, Markup.inlineKeyboard(backToMainMenuButton));
    } else {
      ctx.reply(
        "You haven't bought any tickets yet.",
        Markup.inlineKeyboard(backToMainMenuButton)
      );
    }
  } catch (error) {
    console.error("Error fetching user's tickets:", error);
    ctx.reply("Error fetching your tickets. Please try again later.");
  }
}
async function displayMyBalance(ctx: any) {
  try {
    const chatID =
      ctx.message?.chat.id.toString() ||
      ctx.update.callback_query?.message?.chat.id.toString();
    const walletAddress = userWallets[chatID];
    const backToMainMenuButton = [
      Markup.button.callback("Back To Main Menu", "back_to_main_menu"),
    ];

    if (!walletAddress) {
      return ctx.reply("Please connect your wallet first.");
    }

    const { web3 } = initializeWeb3Contract();
    const balanceWei = await web3.eth.getBalance(walletAddress);
    const balanceEth = web3.utils.fromWei(balanceWei, "ether");

    ctx.reply(
      `Your current balance is: ${balanceEth} ETH`,
      Markup.inlineKeyboard(backToMainMenuButton)
    );
  } catch (error) {
    console.error("Error fetching user's balance:", error);
    ctx.reply("Error fetching your balance. Please try again later.");
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
bot.use((ctx, next) => {
  let chatId;
  if ("callback_query" in ctx.update) {
    chatId = (ctx.update as any).callback_query.message.chat.id.toString();
  } else if ("message" in ctx.update) {
    chatId = (ctx.update as any).message.chat.id.toString();
  }

  ctx.socket = activeSockets[chatId];
  console.log("Active sockets chatIds:", Object.keys(activeSockets));
  console.log("Socket for current chatId:", ctx.socket);

  // if (ctx.socket) {
  //   console.log("Emitting buyTicketRequest to frontend with data:");
  //   ctx.socket.emit("buyTicketRequest", { numberOfTickets: 1, lotteryId: 1 });
  // } else {
  //   console.error("No active socket connection to send data to frontend.");
  // }

  return next();
});

bot.action("back_to_main_menu", async (ctx) => {
  await sendMainMenu(ctx);
});

bot.action("how_to_play", (ctx) => {
  ctx.answerCbQuery("Fetching how to play...");
  return ctx.reply(
    `How To Play
    1. Buy a ticket for 0.0001 ETH
    2. Wait for the lottery to end
    3. If your ticket is drawn, you win the NFT!`
  );
});
bot.action("view_open_lottery", async (ctx) => {
  ctx.answerCbQuery("Fetching open lotteries...");
  await displayOpenLotteries(ctx);
});
bot.action("view_closed_lottery", async (ctx) => {
  ctx.answerCbQuery("Fetching closed lotteries..."); // 这只是一个示例回复
  await displayClosedLotteries(ctx);
});
bot.action("view_my_ticket", async (ctx) => {
  ctx.answerCbQuery("Fetching your ticket..."); // 这只是一个示例回复
  await displayMyTicket(ctx);
});
bot.action("view_my_balance", async (ctx) => {
  await ctx.answerCbQuery("Fetching your balance...");
  await displayMyBalance(ctx);
});

bot.action(/view_metadata_(\d+)/, async (ctx) => {
  const lotteryId = ctx.match[1];
  const metadata = metadataCache[lotteryId];
  await ctx.reply(`Metadata for Lottery ${lotteryId} NFT:\n\n${metadata}`);
  const imageUrl = `https://nftstorage.link/ipfs/bafybeigjmc4xnw53joidylrv3dnrmyjpd6ampuxkq6hujgkhoe3u35aguq`;
  await ctx.replyWithPhoto(imageUrl);
  const backToOpenLotteryButton = [
    Markup.button.callback("Back to view lottery", "view_open_lottery"),
  ];
  ctx.reply("Back", Markup.inlineKeyboard(backToOpenLotteryButton));
});

const userQueries: { [key: string]: { type: string; lotteryId: string } } = {};
bot.action(/buy_ticket_(\d+)/, async (ctx) => {
  const lotteryId = ctx.match![1];
  const chatId = ctx.update.callback_query!.message!.chat.id.toString();

  try {
    // Fetch all open lotteries and their remaining tickets
    const response = await fetch("http://localhost:4000/view_open_lottery");
    const data = await response.json();

    // Find the remaining tickets for the specific lottery
    const lotteryData = data.find((item: any) => item.lotteryId == lotteryId);
    const remainingTickets = lotteryData ? lotteryData.remainingTickets : 10;

    // Create a dynamic keyboard based on the remaining tickets
    const maxRows = Math.ceil(remainingTickets / 3);
    const keyboard: string[][] = [];
    let counter = 1;
    for (let i = 0; i < maxRows; i++) {
      const row: string[] = [];
      for (let j = 0; j < 3; j++) {
        if (counter <= remainingTickets) {
          row.push(String(counter));
          counter++;
        }
      }
      keyboard.push(row);
    }

    // Store user query
    userQueries[chatId] = {
      type: "buyTicket",
      lotteryId,
    };

    keyboard.push(["Cancel"]);
    ctx.reply(
      `How many tickets would you like to buy for Lottery ${lotteryId}? (1 to ${remainingTickets})`,
      {
        reply_markup: {
          keyboard: keyboard,
          one_time_keyboard: true,
          resize_keyboard: true,
        },
      }
    );
  } catch (error) {
    console.error("Error fetching remaining tickets:", error);
    ctx.reply("Error fetching remaining tickets. Please try again later.");
  }
});

bot.hears("Cancel", async (ctx) => {
  // Handle the cancellation here
  await ctx.reply("Purchase cancelled.");
  await displayOpenLotteries(ctx);
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

  if (ctx.socket) {
    console.log("Emitting buyTicketRequest to frontend with data:", {
      numberOfTickets,
      lotteryId,
    });
    ctx.socket.emit("buyTicketRequest", { numberOfTickets, lotteryId });
  } else {
    console.error("No active socket connection to send data to frontend.");
  }

  ctx.reply(
    `Confirmed purchase of ${numberOfTickets} tickets for Lottery ${lotteryId}. Processing...`
  );
});

bot.action("cancel_buy", async (ctx) => {
  // Return to the view_open_lottery level
  await ctx.reply("Purchase cancelled.");
  await displayOpenLotteries(ctx);
});

bot.action("transfer_nft", (ctx) => {
  // 这里你可以写代码来处理 "Transfer My NFT Into Pool" 的逻辑
  ctx.answerCbQuery("Transferring your NFT into the pool..."); // 这只是一个示例回复
});

app.post("/wallet-address", async (req, res) => {
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

app.get("/view_open_lottery", async (req, res) => {
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

app.get("/view_closed_lotteries", async (req, res) => {
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

app.get("/view_my_ticket", async (req, res) => {
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

bot.launch();
server.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
  const { web3, contract } = initializeWeb3Contract();

  contract.events
    .LotteryClosed({})
    .on("data", (event: any) => {
      handleLotteryClosed(event.returnValues);
    })
    .on("error", console.error);
  async function handleLotteryClosed(returnValues: any) {
    const lotteryId = returnValues.lotteryId;
    const winner = returnValues.winner;

    try {
      const response = await fetch(
        `http://localhost:4000/view_closed_lotteries`
      );
      const data = await response.json();
      const closedLottery = data.closedLotteries.find(
        (lottery: any) => lottery.id == lotteryId
      );
      const participants = closedLottery ? closedLottery.participants : [];

      const notifiedChatIDs = new Set<string>();

      for (let participant of participants) {
        const chatID = Object.keys(userWallets).find(
          (key) => userWallets[key] === participant
        );

        if (chatID && !notifiedChatIDs.has(chatID)) {
          await bot.telegram.sendMessage(
            chatID,
            `Lottery ${lotteryId} has ended! The winner is ${winner}.`
          );
          notifiedChatIDs.add(chatID);
        }
      }
    } catch (error) {
      console.error("Error sending lottery closed notifications:", error);
    }
  }
});
