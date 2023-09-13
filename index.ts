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
