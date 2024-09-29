import { Telegraf } from "telegraf";
import { ConfigService } from "./config/config.service";
import { IConfigService } from "./config/config.interface";
import { IBotContext } from "./context/context.interface";
import { Command } from "./commands/command.class";
import { CommandStart } from "./commands/command.start";
import { CommandAbout } from "./commands/command.about";
import { SQLiteSession } from "./tmp/db";
import { CommandNewform } from "./commands/command.newform";


class Bot {
    bot: Telegraf<IBotContext>;
    commands: Command[] = [];
    session: SQLiteSession;

    constructor(private readonly configService: IConfigService) {
        this.bot = new Telegraf<IBotContext>(this.configService.get("TOKEN"));
        this.session = new SQLiteSession();
        this.bot.use(this.session.middleware());
    }

    init() {
        this.commands = [new CommandStart(this.bot), 
            new CommandAbout(this.bot), 
            new CommandNewform(this.bot)];
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

export const dbSession = bot.session;