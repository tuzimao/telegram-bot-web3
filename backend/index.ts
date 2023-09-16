import express from 'express';
import { Context, Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';
import cors from 'cors';

let chatID: number | null = null;

dotenv.config();

//const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN as string;
const BOT_TOKEN = '6664428098:AAFpDzmvmTNDETnkXgsdcC6UFt_TZsTrFWo';
if (!BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN is not set in .env file");
}

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply('Hello, World!');
    chatID = ctx.message.chat.id;  // 当用户发送/start时，存储chat.id
    ctx.reply(`Your chat ID is ${chatID}`);
});
bot.launch();

const app = express();
const PORT = 4000;

app.use(cors());
// Middleware to parse JSON requests
app.use(express.json());


// Endpoint to receive wallet address
app.post('/wallet-address', async (req, res) => {
    console.log('Received request with body:', req.body);
    const walletAddress = req.body.walletAddress;

    if (!chatID) {
        res.status(500).send({ message: 'Chat ID is not set. Please start the bot in Telegram first.' });
        return;
    }

    try {
        // Try sending the message to Telegram
        await bot.telegram.sendMessage(chatID, `Wallet Address: ${walletAddress}`);
        res.status(200).send({ message: 'Address received and sent to Telegram!' });
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
        res.status(500).send({ message: 'Failed to send message to Telegram.' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
