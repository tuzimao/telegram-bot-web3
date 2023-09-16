import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const BOT_TOKEN = '6664428098:AAFpDzmvmTNDETnkXgsdcC6UFt_TZsTrFWo';
console.log("Loaded BOT_TOKEN:", BOT_TOKEN);
if (!BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN is not set in .env file");
}
const bot = new Telegraf(BOT_TOKEN);


bot.start((ctx) => ctx.reply('Hello, World!'));

bot.launch();
