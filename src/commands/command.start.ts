import { Command } from "./command.class";
import { Markup, Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";

export class CommandStart extends Command {
    constructor(bot: Telegraf<IBotContext>){
        super(bot);
    }

    handle(): void {
        this.bot.start((ctx) => {
            if (!ctx.session) {
                ctx.session = {isLiked: true};
            }
            console.log(ctx.message.chat);
            console.log("PEEEEENIS!");
            console.log(ctx.message.from);
            Markup.keyboard
            ctx.reply("Choose", Markup.keyboard([
                ["1", "2"]
            ]))
        })


    }
}