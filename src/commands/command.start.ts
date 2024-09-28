import { Command } from "./command.class";
import { Markup, Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";

export class CommandStart extends Command {
    constructor(bot: Telegraf<IBotContext>){
        super(bot);
    }

    handle(): void {
        this.bot.start(async (ctx) => {
            if (!ctx.session) {
                ctx.session = {isInDB: false, isChoosing: false};
                console.log("session CREATED");
            } else {
                console.log("session ALREADY exists");
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
