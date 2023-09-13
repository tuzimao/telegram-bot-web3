"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var telegraf_1 = require("telegraf");
var dotenv = require("dotenv");
dotenv.config();
var BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN is not set in .env file");
}
var bot = new telegraf_1.Telegraf(BOT_TOKEN);
bot.start(function (ctx) { return ctx.reply('Hello, World!'); });
bot.launch();
