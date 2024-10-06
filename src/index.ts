import dotenv from "dotenv";
import {Bot, InlineKeyboard, Keyboard} from "grammy";
import DatabaseConnection from "./database";
import {step1ReplyText, step2ReplyText, step3ReplyText, step4ReplyText, usersCollection} from "./config/constants";
import {User} from "./types/dbCollections";
import {ObjectId} from "mongodb";
dotenv.config();

const bot = new Bot(process.env.BOT_TOKEN);
const dbConnection = DatabaseConnection.getInstance();
dbConnection.init();

bot.api.setMyCommands([
    {
        command: 'start', description: 'Запуск бота'
    }
]);

bot.command("start", async (ctx) => {
    const message = ctx.message;
    console.log('message', message);
    const user = await dbConnection.getOneByFilterQuery(usersCollection, { botUserId: message.from.id });
    console.log('user', user);

    if (!user) {
        await ctx.reply("Привет! Это тестовый бот сервиса IQ-Cook, тут вы можете посмотреть функционал приложения для сферы ресторанов и кафе.\n" +
            "\n" +
            step1ReplyText);
        await dbConnection.create(usersCollection, {
            botUserId: message.from.id,
            name: message.from.first_name,
            isActivate: false,
            step: 1,
            phone: ''
        } as User);
    } else {
        if (user.isActivate) {
            await ctx.reply("Вы уже завершили регистрацию.\n" +
                "\n" +
                "Для перехода в приложение воспользуйтесь кнопкой.");
        } else if (user.step === 1) {
            await ctx.reply(step1ReplyText);
        } else if (user.step === 2) {
            const shareKeyboard = new Keyboard().requestContact('Поделиться').oneTime().resized();
            // const shareKeyboard = new InlineKeyboard().text('Поделиться', 'get-user-phone');
            await ctx.reply(step2ReplyText, { reply_markup: shareKeyboard });
        }
    }
});

bot.hears(['Открыть приложение'], async (ctx) => {
    const message = ctx.message;
    const user = await dbConnection.getOneByFilterQuery(usersCollection, { botUserId: message.from.id });

    if (user) {
        // const myRestaurantKeyboard = new InlineKeyboard().text('Твой ресторан', 'open-my-restaurant');
        const myRestaurantKeyboard = new InlineKeyboard().webApp('Твой ресторан', process.env.WEB_APP_URL);
        await ctx.reply(step4ReplyText, { reply_markup: myRestaurantKeyboard });
    } else {
        await ctx.reply("Пользователь не найден");
    }
});

// bot.callbackQuery(['get-user-phone'], async (ctx) => {
//    // await ctx.answerCallbackQuery();
//
// });

bot.on('message:text', async (ctx) => {
    const message = ctx.message;
    // console.log('message:text');
    const user = await dbConnection.getOneByFilterQuery(usersCollection, { botUserId: message.from.id });
    // console.log('user', user);

    if (user) {
        if (user.step === 1) { // Пользователь ввел имя
            // console.log('user name', message.text);
            await dbConnection.updateOneByObject(
                usersCollection,
                { botUserId: message.from.id }, // _id: new ObjectId(user.id) почему-то не работает
                {
                    name: message.text,
                    step: 2
                },
            );
            await ctx.reply("Спасибо!");
            const shareKeyboard = new Keyboard().requestContact('Поделиться').oneTime().resized();
            // const shareKeyboard = new InlineKeyboard().text('Поделиться', 'get-user-phone');
            await ctx.reply(step2ReplyText, { reply_markup: shareKeyboard });
        }
    }
});

bot.on(':contact', async (ctx) => {
    const message = ctx.message;
    // console.log(':contact', message);
    const user = await dbConnection.getOneByFilterQuery(usersCollection, { botUserId: message.from.id });

    if (user) {
        await dbConnection.updateOneByObject(
            usersCollection,
            { botUserId: message.from.id }, // _id: new ObjectId(user.id) почему-то не работает
            {
                phone: message.contact.phone_number,
                step: 3,
                isActivate: true
            },
        );
        const appKeyboard = new Keyboard().text('Открыть приложение').resized();
        await ctx.reply(step3ReplyText, { reply_markup: appKeyboard });
    }
});





bot.start();

// Enable graceful stop (from Telegraf!).
// process.once('SIGINT', () => bot.stop('SIGINT'))
// process.once('SIGTERM', () => bot.stop('SIGTERM'))