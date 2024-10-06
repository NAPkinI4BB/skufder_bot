import { Command } from "./command.class";
import { Context, Markup, Telegraf } from "telegraf";
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

            function saveProfile(): void {
                if (key) {
                    dbSession.saveData(key, ctx);
                    ctx.session.isInDB = true;
                    console.log("SAVED");
                } else {
                    console.error("El problema");
                }
            } 

            if (!ctx.session) {
                ctx.session = {isInDB: false, isChoosing: false, isAwaitingAge: false};
                console.log("session CREATED");
            } else {
                console.log("session ALREADY exists");
            }
            
            await ctx.reply("Добро пожаловать в Skufder!");

            let isExist: boolean;
            if (key) {
                isExist = await dbSession.userExistsInDb(key);
                if (!isExist) {
                    await ctx.reply("У вас нет анкеты, счас создадим");
                    //createProfile
                    dbSession.saveData(key, ctx);
                } else {
                    await ctx.reply("Анкета есть, редактировать?");

                }
    
            } else {
                console.error("Key is unavaliable");
            };
            
        

    });
    }

}
