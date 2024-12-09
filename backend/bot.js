const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();
// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_BOT_TOKEN;
const FB_URL = process.env.FRONTEND_LINK;
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Matches "/echo [whatever]"
bot.onText(/\/start/, async (msg) => {
  console.log("start");
  const chatId = msg.chat.id;
  const telegramId = msg.from.id;
  try {
    await bot.sendMessage(chatId, "Welcome to my bot", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Open web app",
              web_app: {
                url: FB_URL,
              },
            },
          ],
        ],
      },
    });
  } catch (e) {
    console.log(e);
  }
});
// Listen for any kind of message. There are different kinds of
// messages.
