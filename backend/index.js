"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const telegraf_1 = require("telegraf");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
//const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string;
const BOT_TOKEN = '6664428098:AAFpDzmvmTNDETnkXgsdcC6UFt_TZsTrFWo';
if (!BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN is not set in .env file");
}
const bot = new telegraf_1.Telegraf(BOT_TOKEN);
bot.start((ctx) => ctx.reply('Hello, World!'));
bot.launch();
const app = (0, express_1.default)();
const PORT = 4000;
// Middleware to parse JSON requests
app.use(express_1.default.json());
// Endpoint to receive wallet address
app.post('/wallet-address', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Received request with body:', req.body);
    const walletAddress = req.body.walletAddress;
    try {
        // Try sending the message to Telegram
        yield bot.telegram.sendMessage(BOT_TOKEN, `Wallet Address: ${walletAddress}`);
        res.status(200).send({ message: 'Address received and sent to Telegram!' });
    }
    catch (error) {
        console.error('Error sending message to Telegram:', error);
        res.status(500).send({ message: 'Failed to send message to Telegram.' });
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
