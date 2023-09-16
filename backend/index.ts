import express from 'express';
import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';

dotenv.config();

//const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string;
const BOT_TOKEN = '6664428098:AAFpDzmvmTNDETnkXgsdcC6UFt_TZsTrFWo';
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
app.post('/wallet-address', async (req, res) => {
    console.log('Received request with body:', req.body);
    const walletAddress = req.body.walletAddress;

    try {
        // Try sending the message to Telegram
        await bot.telegram.sendMessage(BOT_TOKEN, `Wallet Address: ${walletAddress}`);
        res.status(200).send({ message: 'Address received and sent to Telegram!' });
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
        res.status(500).send({ message: 'Failed to send message to Telegram.' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
