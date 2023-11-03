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
var moralis_1 = require("moralis");
var common_evm_utils_1 = require("@moralisweb3/common-evm-utils");
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
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, bot.telegram.sendMessage(chatID, "Purchase Successful! Here's your transaction receipt:\nTransaction Hash: ".concat(receipt.transaction, "\nBlock Number: ").concat(receipt.blockNumber, "\n..."), // 根据需要添加更多的收据详情
                        telegraf_1.Markup.inlineKeyboard([
                            [telegraf_1.Markup.button.callback("Back To Main Menu", "back_to_main_menu")],
                        ]))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, sendMainMenu(chatID)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error("Error sending receipt to Telegram:", error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
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
    var web3 = new Web3(new Web3.providers.WebsocketProvider("wss://sepolia.infura.io/ws/v3/73d62d6d12454a5d8866f12d641e9dc5"));
    var abi = LotteryManagerABI;
    var contractAddress = "0xdcF6eF9fd2FcfE2125f23F6Fc0280fDfb9F9A819";
    var contract = new web3.eth.Contract(abi, contractAddress);
    return { web3: web3, contract: contract };
}
function sendMainMenu(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ctx.reply("Choose an option:", telegraf_1.Markup.inlineKeyboard([
                        [telegraf_1.Markup.button.callback("How To Play 😎", "how_to_play")],
                        [telegraf_1.Markup.button.callback("View Open Lottery 🔍", "view_open_lottery")],
                        [telegraf_1.Markup.button.callback("View Lottery Winner 🔍", "view_closed_lottery")],
                        [telegraf_1.Markup.button.callback("View My Lottery Ticket", "view_my_ticket")],
                        [telegraf_1.Markup.button.callback("View My Current Balance", "view_my_balance")],
                        [telegraf_1.Markup.button.callback("View My NFT", "view_my_nft")],
                        [telegraf_1.Markup.button.callback("Transfer My NFT Into Pool", "transfer_nft_in")],
                    ]))];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
var apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjU4NDZiMmMxLWY5MWYtNDA5NC1iN2JhLWIzYTMxMWE3N2EwNSIsIm9yZ0lkIjoiMzYyMDM4IiwidXNlcklkIjoiMzcyMDc4IiwidHlwZUlkIjoiNGQ0ODBkNDQtOThlZC00NGY4LWIxMmUtMjYxYjBkNTljMDc1IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2OTgxMjAyMDcsImV4cCI6NDg1Mzg4MDIwN30.Wn8jrHa5oZRYfFmePC8nO0Y9Uq-csfypfxnkgMZGWbM"; // replace with your actual key
moralis_1["default"].start({ apiKey: apiKey });
var metadataCache = {};
function displayOpenLotteries(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, allTasks, _loop_1, _i, data_1, lotteryInfo, backToMainMenuButton, error_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, fetch("http://localhost:4000/view_open_lottery")];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    allTasks = [];
                    _loop_1 = function (lotteryInfo) {
                        var task = (function () { return __awaiter(_this, void 0, void 0, function () {
                            var lotteryDetails, nftdata, message, lotteryButtons;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, getLotteryDetails(lotteryInfo.lotteryId)];
                                    case 1:
                                        lotteryDetails = _a.sent();
                                        return [4 /*yield*/, getNFTMetadata(lotteryDetails.nftContract, lotteryDetails.tokenId)];
                                    case 2:
                                        nftdata = _a.sent();
                                        message = "Lottery ".concat(lotteryInfo.lotteryId, " (").concat(lotteryInfo.remainingTickets, " tickets left) - NFT: ").concat(nftdata.name, " (").concat(nftdata.symbol, ")\n");
                                        lotteryButtons = [
                                            [
                                                telegraf_1.Markup.button.callback("Buy Lottery ".concat(lotteryInfo.lotteryId, " (").concat(lotteryInfo.remainingTickets, " left)"), "buy_ticket_".concat(lotteryInfo.lotteryId)),
                                            ],
                                        ];
                                        if (nftdata.metadata && nftdata.metadata !== "No metadata") {
                                            metadataCache[lotteryInfo.lotteryId] = nftdata.metadata;
                                            lotteryButtons.push([
                                                telegraf_1.Markup.button.callback("View Metadata Lottery ".concat(lotteryInfo.lotteryId), "view_metadata_".concat(lotteryInfo.lotteryId)),
                                            ]);
                                        }
                                        // 一起发送NFT信息和对应的按钮
                                        return [4 /*yield*/, ctx.reply(message, {
                                                reply_markup: { inline_keyboard: lotteryButtons },
                                                parse_mode: "Markdown"
                                            })];
                                    case 3:
                                        // 一起发送NFT信息和对应的按钮
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })();
                        allTasks.push(task);
                    };
                    for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                        lotteryInfo = data_1[_i];
                        _loop_1(lotteryInfo);
                    }
                    // 等待所有的异步任务完成
                    return [4 /*yield*/, Promise.all(allTasks)];
                case 3:
                    // 等待所有的异步任务完成
                    _a.sent();
                    backToMainMenuButton = [
                        [telegraf_1.Markup.button.callback("Back To Main Menu", "back_to_main_menu")],
                    ];
                    ctx.reply("Back to the main menu?", {
                        reply_markup: { inline_keyboard: backToMainMenuButton }
                    });
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    ctx.reply("Error fetching open lotteries. Please try again later.");
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function getNFTMetadata(nftContract, tokenId) {
    return __awaiter(this, void 0, void 0, function () {
        var chains, _i, chains_1, chain, response, NFT_tokenId, NFT_address, NFT_data, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    chains = [common_evm_utils_1.EvmChain.SEPOLIA];
                    console.log("nftContract ::", nftContract); ///
                    _i = 0, chains_1 = chains;
                    _a.label = 1;
                case 1:
                    if (!(_i < chains_1.length)) return [3 /*break*/, 4];
                    chain = chains_1[_i];
                    return [4 /*yield*/, moralis_1["default"].EvmApi.nft.getNFTMetadata({
                            address: nftContract,
                            chain: chain,
                            tokenId: tokenId.toString()
                        })];
                case 2:
                    response = _a.sent();
                    console.log("NFT:", response === null || response === void 0 ? void 0 : response.toJSON()); ///
                    NFT_tokenId = response === null || response === void 0 ? void 0 : response.toJSON().token_id;
                    NFT_address = response === null || response === void 0 ? void 0 : response.toJSON().token_address;
                    console.log("NFT_tokenId:", NFT_tokenId); ///
                    console.log("NFT_address:", NFT_address); ///
                    NFT_data = response === null || response === void 0 ? void 0 : response.toJSON();
                    return [2 /*return*/, {
                            name: NFT_data.name || "Unknown",
                            symbol: NFT_data.symbol || "No description",
                            metadata: NFT_data.metadata || "No metadata"
                        }];
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_3 = _a.sent();
                    console.error("Error fetching NFT metadata:", error_3);
                    throw error_3;
                case 6: return [2 /*return*/];
            }
        });
    });
}
// display User's NFT
function displayMyNFT(ctx) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var chatID, walletAddress, chains, allReplies, _i, chains_2, chain, response, NFTs, _d, _e, nft, message, buttons, backToMainMenuButton;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    chatID = ((_a = ctx.message) === null || _a === void 0 ? void 0 : _a.chat.id.toString()) ||
                        ((_c = (_b = ctx.update.callback_query) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.chat.id.toString());
                    walletAddress = userWallets[chatID];
                    console.log("walletAddress:", walletAddress);
                    return [4 /*yield*/, ctx.reply("NFT owned by address: " + walletAddress)];
                case 1:
                    _f.sent();
                    chains = [common_evm_utils_1.EvmChain.SEPOLIA];
                    allReplies = [];
                    _i = 0, chains_2 = chains;
                    _f.label = 2;
                case 2:
                    if (!(_i < chains_2.length)) return [3 /*break*/, 5];
                    chain = chains_2[_i];
                    return [4 /*yield*/, moralis_1["default"].EvmApi.nft.getWalletNFTs({
                            address: walletAddress,
                            chain: chain
                        })];
                case 3:
                    response = _f.sent();
                    NFTs = response === null || response === void 0 ? void 0 : response.toJSON();
                    console.log("NFTs:", NFTs);
                    if (NFTs &&
                        NFTs.result &&
                        Array.isArray(NFTs.result) &&
                        NFTs.result.length > 0) {
                        for (_d = 0, _e = NFTs.result; _d < _e.length; _d++) {
                            nft = _e[_d];
                            message = "\n          *Name:* ".concat(nft.name, "\n          *Symbol:* ").concat(nft.symbol, "\n          *Token ID:* ").concat(nft.token_id, "\n          *Token Address:* [").concat(nft.token_address, "](").concat(nft.token_uri, ")\n          *Token URI:* [Link](").concat(nft.token_uri, ")\n        ");
                            buttons = [];
                            if (nft.metadata && nft.metadata !== "No metadata") {
                                metadataCache[nft.token_id] = nft.metadata; // Store metadata for later retrieval
                                buttons.push([
                                    telegraf_1.Markup.button.callback("View Metadata for NFT ".concat(nft.token_id), "view_my_nft_metadata_".concat(nft.token_id)),
                                ]);
                            }
                            else {
                                message += "Metadata: No metadata\n";
                            }
                            allReplies.push(ctx.reply(message, { parse_mode: "Markdown" }));
                            if (buttons.length > 0) {
                                allReplies.push(ctx.reply("Actions:", telegraf_1.Markup.inlineKeyboard(buttons)));
                            }
                        }
                    }
                    else {
                        allReplies.push(ctx.reply("You don't have any NFTs yet."));
                    }
                    _f.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: 
                // 等待所有NFT消息发送完成
                return [4 /*yield*/, Promise.all(allReplies)];
                case 6:
                    // 等待所有NFT消息发送完成
                    _f.sent();
                    backToMainMenuButton = [
                        telegraf_1.Markup.button.callback("Back To Main Menu", "back_to_main_menu"),
                    ];
                    ctx.reply("Back to the main menu?", telegraf_1.Markup.inlineKeyboard(backToMainMenuButton));
                    return [2 /*return*/];
            }
        });
    });
}
function getLotteryDetails(lotteryId) {
    return __awaiter(this, void 0, void 0, function () {
        var contract, lottery, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    contract = initializeWeb3Contract().contract;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, contract.methods.lotteries(lotteryId).call()];
                case 2:
                    lottery = _a.sent();
                    console.log("Lottery details:", lottery); ///
                    console.log("Lottery details:", lottery.nftContract); ///
                    console.log("Lottery details:", lottery.tokenId); ///
                    return [2 /*return*/, {
                            nftContract: lottery.nftContract,
                            tokenId: lottery.tokenId
                        }];
                case 3:
                    error_4 = _a.sent();
                    console.error("Error fetching lottery details:", error_4);
                    throw error_4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function displayClosedLotteries(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, closedLotteries, details, backToMainMenuButton, error_5;
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
                    backToMainMenuButton = [
                        telegraf_1.Markup.button.callback("Back To Main Menu", "back_to_main_menu"),
                    ];
                    ctx.reply(details, telegraf_1.Markup.inlineKeyboard(backToMainMenuButton));
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
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
        var chatID, response, data, myTicket, backToMainMenuButton, message, i, error_6;
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
                    backToMainMenuButton = [
                        telegraf_1.Markup.button.callback("Back To Main Menu", "back_to_main_menu"),
                    ];
                    if (myTicket && myTicket.lotteryIds.length > 0) {
                        message = "Your Tickets:\n";
                        for (i = 0; i < myTicket.lotteryIds.length; i++) {
                            message += "Lottery ".concat(myTicket.lotteryIds[i], ": ").concat(myTicket.ticketCounts[i], " tickets\n");
                        }
                        ctx.reply(message, telegraf_1.Markup.inlineKeyboard(backToMainMenuButton));
                    }
                    else {
                        ctx.reply("You haven't bought any tickets yet.", telegraf_1.Markup.inlineKeyboard(backToMainMenuButton));
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _d.sent();
                    console.error("Error fetching user's tickets:", error_6);
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
        var chatID, walletAddress, backToMainMenuButton, web3, balanceWei, balanceEth, error_7;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 3]);
                    chatID = ((_a = ctx.message) === null || _a === void 0 ? void 0 : _a.chat.id.toString()) ||
                        ((_c = (_b = ctx.update.callback_query) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.chat.id.toString());
                    walletAddress = userWallets[chatID];
                    backToMainMenuButton = [
                        telegraf_1.Markup.button.callback("Back To Main Menu", "back_to_main_menu"),
                    ];
                    if (!walletAddress) {
                        return [2 /*return*/, ctx.reply("Please connect your wallet first.")];
                    }
                    web3 = initializeWeb3Contract().web3;
                    return [4 /*yield*/, web3.eth.getBalance(walletAddress)];
                case 1:
                    balanceWei = _d.sent();
                    balanceEth = web3.utils.fromWei(balanceWei, "ether");
                    ctx.reply("Your current balance is: ".concat(balanceEth, " ETH"), telegraf_1.Markup.inlineKeyboard(backToMainMenuButton));
                    return [3 /*break*/, 3];
                case 2:
                    error_7 = _d.sent();
                    console.error("Error fetching user's balance:", error_7);
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
        [telegraf_1.Markup.button.callback("View Lottery Winner 🔍", "view_closed_lottery")],
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
bot.action("back_to_main_menu", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, sendMainMenu(ctx)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
bot.action("how_to_play", function (ctx) {
    ctx.answerCbQuery("Fetching how to play...");
    return ctx.reply("How To Play\n    1. Buy a ticket for 0.0001 ETH\n    2. Wait for the lottery to end\n    3. If your ticket is drawn, you win the NFT!");
});
bot.action("view_open_lottery", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ctx.answerCbQuery("Fetching open lotteries...");
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
bot.action("view_my_nft", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ctx.answerCbQuery("Fetching your NFT...")];
            case 1:
                _a.sent();
                return [4 /*yield*/, displayMyNFT(ctx)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
var state = {};
bot.action("transfer_nft_in", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var userId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ctx.answerCbQuery("Fetching your NFT...")];
            case 1:
                _a.sent();
                return [4 /*yield*/, ctx.reply("Please send your NFT contract address.")];
            case 2:
                _a.sent();
                userId = ctx.from.id;
                state[userId] = { step: "awaiting_contract_address" };
                return [2 /*return*/];
        }
    });
}); });
bot.hears(/.*/, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, userState, contractAddress, tokenIdText, tokenId, contractAddress;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                userId = ctx.from.id;
                userState = state[userId];
                if (!(userState && userState.step === "awaiting_contract_address")) return [3 /*break*/, 5];
                contractAddress = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text;
                console.log("contractAddress:", contractAddress);
                if (!(contractAddress && Web3.utils.isAddress(contractAddress))) return [3 /*break*/, 2];
                return [4 /*yield*/, ctx.reply("Now, please enter your NFT token ID.")];
            case 1:
                _c.sent();
                userState.step = "awaiting_token_id";
                userState.contractAddress = contractAddress;
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, ctx.reply("That doesn't look like a valid Ethereum address. Please try again.")];
            case 3:
                _c.sent();
                _c.label = 4;
            case 4: return [3 /*break*/, 9];
            case 5:
                if (!(userState && userState.step === "awaiting_token_id")) return [3 /*break*/, 9];
                tokenIdText = (_b = ctx.message) === null || _b === void 0 ? void 0 : _b.text;
                tokenId = parseFloat(tokenIdText);
                console.log("tokenId:", tokenId);
                if (!!isNaN(tokenId)) return [3 /*break*/, 7];
                contractAddress = userState.contractAddress;
                return [4 /*yield*/, ctx.reply("The contract address and token ID you entered are " +
                        contractAddress +
                        " and " +
                        tokenIdText +
                        ", please confirm the process", telegraf_1.Markup.inlineKeyboard([
                        [
                            telegraf_1.Markup.button.callback("Confirm", "confirm_transfer_".concat(contractAddress, "_").concat(tokenId)),
                            telegraf_1.Markup.button.callback("Cancel", "cancel_transfer"),
                        ],
                    ]))];
            case 6:
                _c.sent();
                delete state[userId]; // 清除状态，因为已完成处理
                return [3 /*break*/, 9];
            case 7: return [4 /*yield*/, ctx.reply("That doesn't look like a valid token ID. Please try again.")];
            case 8:
                _c.sent();
                _c.label = 9;
            case 9: return [2 /*return*/];
        }
    });
}); });
bot.action(/view_metadata_(\d+)/, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var lotteryId, metadataString, metadata, formattedMetadata, ipfsGateway, imageUrl, backToOpenLotteryButton;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                lotteryId = ctx.match[1];
                metadataString = metadataCache[lotteryId];
                metadata = JSON.parse(metadataString);
                formattedMetadata = "\n  Name: ".concat(metadata.name, "\n\n  Description: ").concat(metadata.description, "\n\n  Image Link: ").concat(metadata.image, "\n\n  Attributes:\n  ").concat(metadata.attributes
                    .map(function (attr) { return "- ".concat(attr.trait_type, ": ").concat(attr.value); })
                    .join("\n"), "\n  ");
                return [4 /*yield*/, ctx.reply("Metadata for Lottery ".concat(lotteryId, " NFT:\n\n").concat(formattedMetadata))];
            case 1:
                _a.sent();
                console.log("metadata:", metadata);
                console.log("metadata image:", metadata.image);
                ipfsGateway = "https://nftstorage.link/ipfs/";
                imageUrl = "";
                if (!(metadata && metadata.image)) return [3 /*break*/, 3];
                imageUrl = metadata.image.replace("ipfs://", ipfsGateway);
                return [4 /*yield*/, ctx.replyWithPhoto(imageUrl)];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, ctx.reply("No image available for this NFT.")];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                backToOpenLotteryButton = [
                    telegraf_1.Markup.button.callback("Back to view lottery", "view_open_lottery"),
                ];
                ctx.reply("Back", telegraf_1.Markup.inlineKeyboard(backToOpenLotteryButton));
                return [2 /*return*/];
        }
    });
}); });
bot.action(/view_my_nft_metadata_(\d+)/, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var tokenId, metadataString, metadata, formattedMetadata, ipfsGateway, imageUrl, backToViewNFTButton;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tokenId = ctx.match[1];
                metadataString = metadataCache[tokenId];
                metadata = JSON.parse(metadataString);
                formattedMetadata = "\n    Name: ".concat(metadata.name, "\n\n    Description: ").concat(metadata.description, "\n\n    Image Link: ").concat(metadata.image, "\n\n    Attributes:\n    ").concat(metadata.attributes
                    .map(function (attr) { return "- ".concat(attr.trait_type, ": ").concat(attr.value); })
                    .join("\n"), "\n  ");
                return [4 /*yield*/, ctx.reply("Metadata for NFT ".concat(tokenId, ":\n\n").concat(formattedMetadata))];
            case 1:
                _a.sent();
                ipfsGateway = "https://nftstorage.link/ipfs/";
                imageUrl = "";
                if (!(metadata && metadata.image)) return [3 /*break*/, 3];
                imageUrl = metadata.image.replace("ipfs://", ipfsGateway);
                return [4 /*yield*/, ctx.replyWithPhoto(imageUrl)];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, ctx.reply("No image available for this NFT.")];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                backToViewNFTButton = [
                    telegraf_1.Markup.button.callback("Back to view NFTs", "view_my_nft"),
                ];
                ctx.reply("Back", telegraf_1.Markup.inlineKeyboard(backToViewNFTButton));
                return [2 /*return*/];
        }
    });
}); });
var userQueries = {};
bot.action(/buy_ticket_(\d+)/, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var lotteryId, chatId, response, data, lotteryData, remainingTickets, maxRows, keyboard, counter, i, row, j, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                lotteryId = ctx.match[1];
                chatId = ctx.update.callback_query.message.chat.id.toString();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, fetch("http://localhost:4000/view_open_lottery")];
            case 2:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 3:
                data = _a.sent();
                lotteryData = data.find(function (item) { return item.lotteryId == lotteryId; });
                remainingTickets = lotteryData ? lotteryData.remainingTickets : 10;
                maxRows = Math.ceil(remainingTickets / 3);
                keyboard = [];
                counter = 1;
                for (i = 0; i < maxRows; i++) {
                    row = [];
                    for (j = 0; j < 3; j++) {
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
                    lotteryId: lotteryId
                };
                keyboard.push(["Cancel"]);
                ctx.reply("How many tickets would you like to buy for Lottery ".concat(lotteryId, "? (1 to ").concat(remainingTickets, ")"), {
                    reply_markup: {
                        keyboard: keyboard,
                        one_time_keyboard: true,
                        resize_keyboard: true
                    }
                });
                return [3 /*break*/, 5];
            case 4:
                error_8 = _a.sent();
                console.error("Error fetching remaining tickets:", error_8);
                ctx.reply("Error fetching remaining tickets. Please try again later.");
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
bot.hears("Cancel", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // Handle the cancellation here
            return [4 /*yield*/, ctx.reply("Purchase cancelled.")];
            case 1:
                // Handle the cancellation here
                _a.sent();
                return [4 /*yield*/, displayOpenLotteries(ctx)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
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
bot.action(/confirm_transfer_(.+?)_(.+)/, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var NFT_address, NFT_tokenId;
    return __generator(this, function (_a) {
        NFT_address = ctx.match[1];
        NFT_tokenId = ctx.match[2];
        if (ctx.socket) {
            console.log("Emitting Transfer NFT to frontend with data:", {
                NFT_address: NFT_address,
                NFT_tokenId: NFT_tokenId
            });
            ctx.socket.emit("buyTicketRequest", { NFT_address: NFT_address, NFT_tokenId: NFT_tokenId });
        }
        else {
            console.error("No active socket connection to send data to frontend.");
        }
        ctx.reply("Confirmed transfer Processing...");
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
bot.action("cancel_transfer", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                delete state[ctx.from.id];
                return [4 /*yield*/, ctx.reply("Transfer cancelled.")];
            case 1:
                _a.sent();
                return [4 /*yield*/, sendMainMenu(ctx)];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
app.post("/wallet-address", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var walletAddress, chatID, error_9;
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
                return [4 /*yield*/, sendMainMenu({
                        reply: function (text, markup) {
                            return bot.telegram.sendMessage(chatID, text, markup);
                        }
                    })];
            case 3:
                _a.sent();
                res.status(200).send({ message: "Address received and sent to Telegram!" });
                return [3 /*break*/, 5];
            case 4:
                error_9 = _a.sent();
                console.error("Error sending message to Telegram:", error_9);
                res.status(500).send({ message: "Failed to send message to Telegram." });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.get("/view_open_lottery", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var contract_1, openLotteries, remainingTickets_1, result, error_10;
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
                error_10 = _a.sent();
                console.error("Error fetching open lotteries:", error_10);
                res.status(500).send({ message: "Failed to fetch open lotteries." });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get("/view_closed_lotteries", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var contract, closedLotteriesDetails_1, closedLotteries, error_11;
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
                error_11 = _a.sent();
                console.error("Error fetching closed lotteries details:", error_11.message);
                res
                    .status(500)
                    .send({ message: "Failed to fetch closed lotteries details." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get("/view_my_ticket", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var contract, chatID, walletAddress, myTicket, error_12;
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
                error_12 = _a.sent();
                console.error("Error fetching my ticket:", error_12.message);
                res.status(500).send({ message: "Failed to fetch my ticket." });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
bot.launch();
server.listen(4000, function () {
    console.log("Server is running on http://localhost:4000");
    var _a = initializeWeb3Contract(), web3 = _a.web3, contract = _a.contract;
    contract.events
        .LotteryClosed({})
        .on("data", function (event) {
        handleLotteryClosed(event.returnValues);
    })
        .on("error", console.error);
    function handleLotteryClosed(returnValues) {
        return __awaiter(this, void 0, void 0, function () {
            var lotteryId, winner, response, data, closedLottery, participants, notifiedChatIDs, _loop_2, _i, participants_1, participant, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lotteryId = returnValues.lotteryId;
                        winner = returnValues.winner;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        return [4 /*yield*/, fetch("http://localhost:4000/view_closed_lotteries")];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 3:
                        data = _a.sent();
                        closedLottery = data.closedLotteries.find(function (lottery) { return lottery.id == lotteryId; });
                        participants = closedLottery ? closedLottery.participants : [];
                        notifiedChatIDs = new Set();
                        _loop_2 = function (participant) {
                            var chatID;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        chatID = Object.keys(userWallets).find(function (key) { return userWallets[key] === participant; });
                                        if (!(chatID && !notifiedChatIDs.has(chatID))) return [3 /*break*/, 2];
                                        return [4 /*yield*/, bot.telegram.sendMessage(chatID, "Lottery ".concat(lotteryId, " has ended! The winner is ").concat(winner, "."))];
                                    case 1:
                                        _b.sent();
                                        notifiedChatIDs.add(chatID);
                                        _b.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        };
                        _i = 0, participants_1 = participants;
                        _a.label = 4;
                    case 4:
                        if (!(_i < participants_1.length)) return [3 /*break*/, 7];
                        participant = participants_1[_i];
                        return [5 /*yield**/, _loop_2(participant)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        error_13 = _a.sent();
                        console.error("Error sending lottery closed notifications:", error_13);
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    }
});
