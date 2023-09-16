import express from 'express';
import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string;
if (!BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN is not set in .env file");
}

const bot = new Telegraf(BOT_TOKEN);
bot.start((ctx) => ctx.reply('Hello, World!'));
bot.launch();

const app = express();
const PORT = 4000;

// Middleware to parse JSON requests
app.use(express.json());

// Endpoint to receive wallet address
app.post('/wallet-address', (req, res) => {
    const address = req.body.address;

    // Here you can send the address to your Telegram bot
    bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID as string, `Wallet Address: ${address}`);

    res.status(200).send({ message: 'Address received!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
