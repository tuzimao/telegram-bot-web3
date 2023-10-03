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
dotenv.config();
// const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string;
var BOT_TOKEN = "6664428098:AAFpDzmvmTNDETnkXgsdcC6UFt_TZsTrFWo";
if (!BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN is not set in .env file");
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
        [telegraf_1.Markup.button.callback("How To Play😎", "how_to_play")],
        [telegraf_1.Markup.button.callback("View Open Lottery🔍", "open_lottery")],
        [telegraf_1.Markup.button.callback("View My Lottery Ticket", "my_ticket")],
        [telegraf_1.Markup.button.callback("View My Current Balance", "my_balance")],
        [telegraf_1.Markup.button.callback("Transfer My NFT Into Pool", "transfer_nft")],
    ]));
});
bot.action("how_to_play", function (ctx) {
    // 这里你可以写代码来处理 "How To Play" 的逻辑
    ctx.answerCbQuery("Fetching how to play..."); // 这只是一个示例回复
    return ctx.reply("How To Play\n    1. Buy a ticket for 0.0001 ETH\n    2. Wait for the lottery to end\n    3. If your ticket is drawn, you win the NFT!");
});
bot.action("open_lottery", function (ctx) {
    // 这里你可以写代码来处理 "View Open Lottery" 的逻辑
    ctx.answerCbQuery("Fetching open lotteries..."); // 这只是一个示例回复
});
bot.action("my_ticket", function (ctx) {
    // 这里你可以写代码来处理 "View My Lottery Ticket" 的逻辑
    ctx.answerCbQuery("Fetching your lottery ticket..."); // 这只是一个示例回复
});
bot.action("my_balance", function (ctx) {
    // 这里你可以写代码来处理 "View My Current Balance" 的逻辑
    ctx.answerCbQuery("Fetching your balance..."); // 这只是一个示例回复
});
bot.action("transfer_nft", function (ctx) {
    // 这里你可以写代码来处理 "Transfer My NFT Into Pool" 的逻辑
    ctx.answerCbQuery("Transferring your NFT into the pool..."); // 这只是一个示例回复
});
bot.launch();
var app = express();
app.use(cors());
app.use(express.json());
app.post("/wallet-address", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var walletAddress, chatID, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                walletAddress = req.body.walletAddress;
                chatID = req.body.chatID;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, bot.telegram.sendMessage(chatID, "Congrets! Your Wallet Are Securely Connected\n         Wallet Address: ".concat(walletAddress))];
            case 2:
                _a.sent();
                // 紧接着发送带有三个按钮的消息
                return [4 /*yield*/, bot.telegram.sendMessage(chatID, "Choose an option:", telegraf_1.Markup.inlineKeyboard([
                        [telegraf_1.Markup.button.callback("How To Play 😎", "how_to_play")],
                        [telegraf_1.Markup.button.callback("View Open Lottery 🔍", "open_lottery")],
                        [telegraf_1.Markup.button.callback("View My Lottery Ticket", "my_ticket")],
                        [telegraf_1.Markup.button.callback("View My Current Balance", "my_balance")],
                        [telegraf_1.Markup.button.callback("Transfer My NFT Into Pool", "transfer_nft")],
                    ]))];
            case 3:
                // 紧接着发送带有三个按钮的消息
                _a.sent();
                res.status(200).send({ message: "Address received and sent to Telegram!" });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                console.error("Error sending message to Telegram:", error_1);
                res.status(500).send({ message: "Failed to send message to Telegram." });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.listen(4000, function () {
    console.log("Server is running on http://localhost:4000");
});
