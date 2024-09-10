import { Command } from "./command.class";
import { Markup, Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";

export class CommandStart extends Command {
    constructor(bot: Telegraf<IBotContext>){
        super(bot);
    }

    handle(): void {
        this.bot.start((ctx) => {
            console.log(ctx.session);
            Markup.keyboard
            ctx.reply("Choose", Markup.keyboard([
                ["Scoof", "Poshel nahui"]
            ]))
        })

        this.bot.action("like", (ctx)=>{
            ctx.session.isLiked = true;
            ctx.sendMessage("TOP");
        })
        this.bot.action("dis", (ctx)=>{
            ctx.session.isLiked = false;
            ctx.sendMessage("LOL");
        })
    }
}