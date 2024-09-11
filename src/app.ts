import { session, Telegraf } from "telegraf";
import { ConfigService } from "./config/config.service";
import { IConfigService } from "./config/config.interface";
import { IBotContext } from "./context/context.interface";
import { Command } from "./commands/command.class";
import { CommandStart } from "./commands/command.start";
import { SQLiteSession } from "./tmp/db";


class Bot {
    bot: Telegraf<IBotContext>;
    commands: Command[] = [];

    constructor(private readonly configService: IConfigService) {
        this.bot = new Telegraf<IBotContext>(this.configService.get("TOKEN"));
        const session = new SQLiteSession();
        this.bot.use(session.middleware());
    }

    init() {
        this.commands = [new CommandStart(this.bot)];
        for (const command of this.commands) {
            command.handle();
        }
        this.bot.launch().then(() => {
            console.log('Bot is running!');
        });
    }
}

const bot = new Bot(new ConfigService());
bot.init();