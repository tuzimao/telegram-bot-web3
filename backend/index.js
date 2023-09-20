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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const telegraf_1 = require("telegraf");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string;
const BOT_TOKEN = '6664428098:AAFpDzmvmTNDETnkXgsdcC6UFt_TZsTrFWo';
if (!BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN is not set in .env file");
}
const bot = new telegraf_1.Telegraf(BOT_TOKEN);
bot.start((ctx) => {
    const chatID = ctx.message.chat.id;
    ctx.reply(`Hello, World! Click http://localhost:3000/${chatID} to connect your wallet.`);
});
bot.launch();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post('/wallet-address', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const walletAddress = req.body.walletAddress;
    const chatID = req.body.chatID;
    try {
        yield bot.telegram.sendMessage(chatID, `Wallet Address: ${walletAddress}`);
        res.status(200).send({ message: 'Address received and sent to Telegram!' });
    }
    catch (error) {
        console.error('Error sending message to Telegram:', error);
        res.status(500).send({ message: 'Failed to send message to Telegram.' });
    }
}));
app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});
