const { Telegraf } = require("telegraf");

const BOT_TOKEN = "6664428098:AAFpDzmvmTNDETnkXgsdcC6UFt_TZsTrFWo";
if (!BOT_TOKEN) {
  console.error("TELEGRAM_BOT_TOKEN is missing!");
  throw new Error("TELEGRAM_BOT_TOKEN is not set in .env file");
}

console.log("Setting up the bot...");
const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  console.log("Received start command");
  ctx.reply("Hello, World!");
});

bot
  .launch()
  .then(() => {
    console.log("Bot has been launched!");
  })
  .catch((error) => {
    console.error("Error launching the bot:", error);
  });
