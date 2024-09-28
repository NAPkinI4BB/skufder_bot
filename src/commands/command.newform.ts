import { Command } from "./command.class";
import { Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";

export class CommandNewform extends Command {
    constructor(bot: Telegraf<IBotContext>){
        super(bot);
    }

    handle(): void {
        this.bot.command("newform", (ctx) => {
            ctx.reply("Сo")
        })


    }
}