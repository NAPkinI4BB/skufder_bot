import { Command } from "./command.class";
import { Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { dbSession } from "../app";


export async function createNewForm(ctx: IBotContext): Promise<void> {
    const key = dbSession.getSessionKey(ctx);
    if (!key) {
        console.error("KEY error");
        return;
    } else {
        
    }
}

export class CommandNewform extends Command {
    constructor(bot: Telegraf<IBotContext>){
        super(bot);
    }

    handle(): void {
        this.bot.command("newform", async (ctx) => {
            ctx.reply("Сoздание анкеты");
        })


    }
}

