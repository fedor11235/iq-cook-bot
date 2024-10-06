const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
import dotenv from "dotenv";
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply('Привет! Это тестовый бот сервиса IQ-Cook, тут вы можете посмотреть функионал приложения для сферы ресторанов и кафе \n' +
    '\n' +
    ' Для продолжения необходимо зарегистрироваться. Как к вам обращаться?'));

bot.on('message', (ctx) => {
    console.log(111, ctx.message.text);
    if (ctx.message.text) {

    }
})



bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))