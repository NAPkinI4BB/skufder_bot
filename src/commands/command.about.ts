import { Command } from "./command.class";
import { Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";

export class CommandAbout extends Command {
    constructor(bot: Telegraf<IBotContext>){
        super(bot);
    }

    handle(): void {
        this.bot.command("about", (ctx) => {
            ctx.reply("INFORMATION")
        })


    }
}