import { Command } from "./command.class";
import { Markup, Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { dbSession } from "../app";
import { error } from "console";

export class CommandStart extends Command {
    constructor(bot: Telegraf<IBotContext>){
        super(bot);
    }
 
    handle(): void {
        this.bot.start(async (ctx) => {
            const key = dbSession.getSessionKey(ctx);
            if (!ctx.session) {
                ctx.session = {isInDB: false, isChoosing: false, isAwaitingAge: false};
                console.log("session CREATED");
            } else {
                console.log("session ALREADY exists");
            }
            
            if (key) {
                dbSession.saveData(key, ctx);
                ctx.session.isInDB = true;
            } else {
                console.error("El problema");
            }

            await ctx.reply("Добро пожаловать в Skufder!");

            if (ctx.session.isInDB) {
                ctx.session.isChoosing = true;
                console.log(`isChoosing (в хендлере старта): ${ctx.session.isChoosing}`);
                
                await ctx.reply("У вас уже есть анкета в Skufder. Редактировать её?", 
                    Markup.keyboard([["Да", "Нет"]]).resize()
                );
            } else {
                await ctx.reply("У вас нет анкеты.");
            }
        });

        this.bot.hears("Да", async (ctx) => {
            console.log(`Значение isChoosing: ${ctx.session?.isChoosing}`);
            
            if (ctx.session?.isChoosing) {
                await ctx.reply("Сколько вам лет?", Markup.removeKeyboard());
                ctx.session.isChoosing = false; // Сбрасываем состояние
                ctx.session.isAwaitingAge = true;
                const key = dbSession.getSessionKey(ctx);
                if (key) {
                    dbSession.saveData(key, ctx);
                }
            } else {
                await ctx.reply("Вы не можете редактировать анкету.");
            }
        });


        this.bot.hears("Нет", async (ctx) => {
            console.log(`Пользователь отказался от редактирования анкеты`);
            await ctx.reply('Вы выбрали не редактировать анкету', Markup.removeKeyboard());
        });
    }
}
