"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// index.ts
var express = require("express");
var cors = require("cors");
var telegraf_1 = require("telegraf");
var dotenv = require("dotenv");
var http = require("http");
var socketIo = require("socket.io");
var Web3 = require("web3");
var LotteryManagerABI = require("./LotteryManagerV2ABI.json");
var userWallets = {};
dotenv.config();
var app = express();
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
var server = http.createServer(app);
var io = new socketIo.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});
var currentSocket = null;
var activeSockets = {};
io.on("connection", function (socket) {
    console.log("A user connected");
    socket.on("setChatId", function (chatId) {
        console.log("setChatId received with chatId:", chatId);
        activeSockets[chatId] = socket;
    });
    socket.on("sendReceipt", function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var receipt, chatID, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    receipt = data.receipt;
                    chatID = data.chatId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, bot.telegram.sendMessage(chatID, "Purchase Successful! Here's your transaction receipt:\nTransaction Hash: ".concat(receipt.transactionHash, "\nBlock Number: ").concat(receipt.blockNumber, "\n...") // 根据需要添加更多的收据详情
                        )];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error sending receipt to Telegram:", error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    socket.on("disconnect", function () {
        console.log("A user disconnected");
        // 删除这个 socket 从 activeSockets 对象
        for (var chatId in activeSockets) {
            if (activeSockets[chatId] === socket) {
                delete activeSockets[chatId];
            }
        }
    });
});
// const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string;
var BOT_TOKEN = "6664428098:AAFpDzmvmTNDETnkXgsdcC6UFt_TZsTrFWo";
if (!BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN is not set in .env file");
}
function initializeWeb3Contract() {
    var web3 = new Web3(new Web3.providers.HttpProvider("https://sepolia.infura.io/v3/73d62d6d12454a5d8866f12d641e9dc5"));
    var abi = LotteryManagerABI;
    var contractAddress = "0xdcF6eF9fd2FcfE2125f23F6Fc0280fDfb9F9A819";
    var contract = new web3.eth.Contract(abi, contractAddress);
    return { web3: web3, contract: contract };
}
function displayOpenLotteries(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, buttons, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("http://localhost:4000/view_open_lottery")];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    buttons = data.map(function (lotteryInfo) {
                        return [
                            telegraf_1.Markup.button.callback("Buy Tickets for Lottery ".concat(lotteryInfo.lotteryId, " (").concat(lotteryInfo.remainingTickets, " left)"), "buy_ticket_".concat(lotteryInfo.lotteryId)),
                        ];
                    });
                    ctx.reply("Open Lotteries: ".concat(data
                        .map(function (lotteryInfo) { return lotteryInfo.lotteryId; })
                        .join(", ")), telegraf_1.Markup.inlineKeyboard(buttons));
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    ctx.reply("Error fetching open lotteries. Please try again later.");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function displayClosedLotteries(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, closedLotteries, details, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("http://localhost:4000/view_closed_lotteries")];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    closedLotteries = data.closedLotteries;
                    details = closedLotteries
                        .map(function (lottery) {
                        return "Lottery ".concat(lottery.id, ": Winner - ").concat(lottery.winner);
                    })
                        .join("\n");
                    ctx.reply(details);
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    ctx.reply("Error fetching lottery winners. Please try again later.");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function displayMyTicket(ctx) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var chatID, response, data, myTicket, message, i, error_4;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 3, , 4]);
                    chatID = ((_a = ctx.message) === null || _a === void 0 ? void 0 : _a.chat.id.toString()) ||
                        ((_c = (_b = ctx.update.callback_query) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.chat.id.toString());
                    return [4 /*yield*/, fetch("http://localhost:4000/view_my_ticket?chatID=".concat(chatID))];
                case 1:
                    response = _d.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _d.sent();
                    myTicket = data.myTicket;
                    if (myTicket && myTicket.lotteryIds.length > 0) {
                        message = "Your Tickets:\n";
                        for (i = 0; i < myTicket.lotteryIds.length; i++) {
                            message += "Lottery ".concat(myTicket.lotteryIds[i], ": ").concat(myTicket.ticketCounts[i], " tickets\n");
                        }
                        ctx.reply(message);
                    }
                    else {
                        ctx.reply("You haven't bought any tickets yet.");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _d.sent();
                    console.error("Error fetching user's tickets:", error_4);
                    ctx.reply("Error fetching your tickets. Please try again later.");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function displayMyBalance(ctx) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var chatID, walletAddress, web3, balanceWei, balanceEth, error_5;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 3]);
                    chatID = ((_a = ctx.message) === null || _a === void 0 ? void 0 : _a.chat.id.toString()) ||
                        ((_c = (_b = ctx.update.callback_query) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.chat.id.toString());
                    walletAddress = userWallets[chatID];
                    if (!walletAddress) {
                        return [2 /*return*/, ctx.reply("Please connect your wallet first.")];
                    }
                    web3 = initializeWeb3Contract().web3;
                    return [4 /*yield*/, web3.eth.getBalance(walletAddress)];
                case 1:
                    balanceWei = _d.sent();
                    balanceEth = web3.utils.fromWei(balanceWei, "ether");
                    ctx.reply("Your current balance is: ".concat(balanceEth, " ETH"));
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _d.sent();
                    console.error("Error fetching user's balance:", error_5);
                    ctx.reply("Error fetching your balance. Please try again later.");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
var bot = new telegraf_1.Telegraf(BOT_TOKEN);
bot.use(telegraf_1.Telegraf.log());
bot.start(function (ctx) {
    var chatID = ctx.message.chat.id;
    var firstName = ctx.message.from.first_name;
    ctx.reply("Hello,".concat(firstName, " Click http://localhost:3000/").concat(chatID, " to connect your wallet."));
});
bot.command("menu", function (ctx) {
    return ctx.reply("Choose an option:", telegraf_1.Markup.inlineKeyboard([
        [telegraf_1.Markup.button.callback("How To Play 😎", "how_to_play")],
        [telegraf_1.Markup.button.callback("View Open Lottery 🔍", "view_open_lottery")],
        [telegraf_1.Markup.button.callback("View My Lottery Ticket", "view_my_ticket")],
        [telegraf_1.Markup.button.callback("View My Current Balance", "view_my_balance")],
        [telegraf_1.Markup.button.callback("Transfer My NFT Into Pool", "transfer_nft_in")],
    ]));
});
bot.use(function (ctx, next) {
    var chatId;
    if ("callback_query" in ctx.update) {
        chatId = ctx.update.callback_query.message.chat.id.toString();
    }
    else if ("message" in ctx.update) {
        chatId = ctx.update.message.chat.id.toString();
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
bot.action("how_to_play", function (ctx) {
    // 这里你可以写代码来处理 "How To Play" 的逻辑
    ctx.answerCbQuery("Fetching how to play..."); // 这只是一个示例回复
    return ctx.reply("How To Play\n    1. Buy a ticket for 0.0001 ETH\n    2. Wait for the lottery to end\n    3. If your ticket is drawn, you win the NFT!");
});
bot.action("view_open_lottery", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // 这里你可以写代码来处理 "View Open Lottery" 的逻辑
                ctx.answerCbQuery("Fetching open lotteries..."); // 这只是一个示例回复
                return [4 /*yield*/, displayOpenLotteries(ctx)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
bot.action("view_closed_lottery", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ctx.answerCbQuery("Fetching closed lotteries..."); // 这只是一个示例回复
                return [4 /*yield*/, displayClosedLotteries(ctx)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
bot.action("view_my_ticket", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ctx.answerCbQuery("Fetching your ticket..."); // 这只是一个示例回复
                return [4 /*yield*/, displayMyTicket(ctx)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
bot.action("view_my_balance", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ctx.answerCbQuery("Fetching your balance...")];
            case 1:
                _a.sent();
                return [4 /*yield*/, displayMyBalance(ctx)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
var userQueries = {};
bot.action(/buy_ticket_(\d+)/, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var lotteryId, chatId;
    return __generator(this, function (_a) {
        lotteryId = ctx.match[1];
        chatId = ctx.update.callback_query.message.chat.id.toString();
        // Store user query
        userQueries[chatId] = {
            type: "buyTicket",
            lotteryId: lotteryId
        };
        ctx.reply("How many tickets would you like to buy for Lottery ".concat(lotteryId, "? (1 to 10)"), {
            reply_markup: {
                keyboard: [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], ["10"]],
                one_time_keyboard: true,
                resize_keyboard: true
            }
        });
        return [2 /*return*/];
    });
}); });
bot.on("text", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var chatId, text, userQuery, numberOfTickets;
    return __generator(this, function (_a) {
        chatId = ctx.message.chat.id.toString();
        text = ctx.message.text;
        userQuery = userQueries[chatId];
        if (userQuery && userQuery.type === "buyTicket") {
            numberOfTickets = parseInt(text, 10);
            if (numberOfTickets >= 1 && numberOfTickets <= 10) {
                // 提供确认和取消按钮
                ctx.reply("Do you want to buy ".concat(numberOfTickets, " tickets for Lottery ").concat(userQuery.lotteryId, "?"), telegraf_1.Markup.inlineKeyboard([
                    [
                        telegraf_1.Markup.button.callback("Confirm", "confirm_buy_".concat(numberOfTickets, "_").concat(userQuery.lotteryId)),
                        telegraf_1.Markup.button.callback("Cancel", "cancel_buy"),
                    ],
                ]));
            }
            else {
                ctx.reply("Please enter a valid number between 1 and 10.");
            }
        }
        return [2 /*return*/];
    });
}); });
bot.action(/confirm_buy_([0-9]+)_([0-9]+)/, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var numberOfTickets, lotteryId;
    return __generator(this, function (_a) {
        numberOfTickets = ctx.match[1];
        lotteryId = ctx.match[2];
        if (ctx.socket) {
            console.log("Emitting buyTicketRequest to frontend with data:", {
                numberOfTickets: numberOfTickets,
                lotteryId: lotteryId
            });
            ctx.socket.emit("buyTicketRequest", { numberOfTickets: numberOfTickets, lotteryId: lotteryId });
        }
        else {
            console.error("No active socket connection to send data to frontend.");
        }
        ctx.reply("Confirmed purchase of ".concat(numberOfTickets, " tickets for Lottery ").concat(lotteryId, ". Processing..."));
        return [2 /*return*/];
    });
}); });
bot.action("cancel_buy", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // Return to the view_open_lottery level
            return [4 /*yield*/, ctx.reply("Purchase cancelled.")];
            case 1:
                // Return to the view_open_lottery level
                _a.sent();
                return [4 /*yield*/, displayOpenLotteries(ctx)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
bot.action("transfer_nft", function (ctx) {
    // 这里你可以写代码来处理 "Transfer My NFT Into Pool" 的逻辑
    ctx.answerCbQuery("Transferring your NFT into the pool..."); // 这只是一个示例回复
});
app.post("/wallet-address", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var walletAddress, chatID, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                walletAddress = req.body.walletAddress;
                chatID = req.body.chatID;
                userWallets[chatID] = walletAddress;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, bot.telegram.sendMessage(chatID, "Congrets! Your Wallet Are Securely Connected!")];
            case 2:
                _a.sent();
                return [4 /*yield*/, bot.telegram.sendMessage(chatID, "Choose an option:", telegraf_1.Markup.inlineKeyboard([
                        [telegraf_1.Markup.button.callback("How To Play 😎", "how_to_play")],
                        [telegraf_1.Markup.button.callback("View Open Lottery 🔍", "view_open_lottery")],
                        [
                            telegraf_1.Markup.button.callback("View Lottery Winner 🔍", "view_closed_lottery"),
                        ],
                        [telegraf_1.Markup.button.callback("View My Lottery Ticket", "view_my_ticket")],
                        [telegraf_1.Markup.button.callback("View My Current Balance", "view_my_balance")],
                        [
                            telegraf_1.Markup.button.callback("Transfer My NFT Into Pool", "transfer_nft_in"),
                        ],
                    ]))];
            case 3:
                _a.sent();
                res.status(200).send({ message: "Address received and sent to Telegram!" });
                return [3 /*break*/, 5];
            case 4:
                error_6 = _a.sent();
                console.error("Error sending message to Telegram:", error_6);
                res.status(500).send({ message: "Failed to send message to Telegram." });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.get("/view_open_lottery", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var contract_1, openLotteries, remainingTickets_1, result, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                contract_1 = initializeWeb3Contract().contract;
                return [4 /*yield*/, contract_1.methods.getOpenLotteries().call()];
            case 1:
                openLotteries = _a.sent();
                return [4 /*yield*/, Promise.all(openLotteries.map(function (lotteryId) {
                        return contract_1.methods.getRemainingTicketsForLottery(lotteryId).call();
                    }))];
            case 2:
                remainingTickets_1 = _a.sent();
                result = openLotteries.map(function (lotteryId, index) { return ({
                    lotteryId: lotteryId,
                    remainingTickets: remainingTickets_1[index]
                }); });
                res.status(200).json(result);
                return [3 /*break*/, 4];
            case 3:
                error_7 = _a.sent();
                console.error("Error fetching open lotteries:", error_7);
                res.status(500).send({ message: "Failed to fetch open lotteries." });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get("/view_closed_lotteries", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var contract, closedLotteriesDetails_1, closedLotteries, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                contract = initializeWeb3Contract().contract;
                return [4 /*yield*/, contract.methods
                        .getClosedLotteriesDetails()
                        .call()];
            case 1:
                closedLotteriesDetails_1 = _a.sent();
                closedLotteries = closedLotteriesDetails_1[0].map(function (id, index) {
                    return {
                        id: id,
                        winner: closedLotteriesDetails_1[1][index],
                        participants: closedLotteriesDetails_1[2][index]
                    };
                });
                res.status(200).json({ closedLotteries: closedLotteries });
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                console.error("Error fetching closed lotteries details:", error_8.message);
                res
                    .status(500)
                    .send({ message: "Failed to fetch closed lotteries details." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get("/view_my_ticket", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var contract, chatID, walletAddress, myTicket, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                contract = initializeWeb3Contract().contract;
                chatID = req.query.chatID;
                walletAddress = userWallets[chatID];
                return [4 /*yield*/, contract.methods
                        .getTicketsBoughtByUser(walletAddress)
                        .call()];
            case 1:
                myTicket = _a.sent();
                res.status(200).json({ myTicket: myTicket });
                console.log("My Ticket:", myTicket);
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                console.error("Error fetching my ticket:", error_9.message);
                res.status(500).send({ message: "Failed to fetch my ticket." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
bot.launch();
server.listen(4000, function () {
    console.log("Server is running on http://localhost:4000");
});
