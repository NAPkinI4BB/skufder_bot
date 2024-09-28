import sqlite3 from 'sqlite3';
import { Middleware } from 'telegraf';
import { IBotContext } from '../context/context.interface';

interface SessionData {
    data: string;
}

export class SQLiteSession {
    private db: sqlite3.Database;

    constructor() {
        this.db = new sqlite3.Database('users.sqlite3', (err) => {
            if (err) {
                console.error('Error opening database', err);
            } else {
                this.db.run(`
                    CREATE TABLE IF NOT EXISTS users (
                        id TEXT PRIMARY KEY,
                        data TEXT
                    )
                `);
            }
        });
    }


    middleware(): Middleware<IBotContext> {
        return async (ctx, next) => {
            const key = this.getSessionKey(ctx);
            if (ctx.message && 'text' in ctx.message) {
                const command_text = ctx.message.text;
                console.log(`Получен текст сообщения: ${command_text}`);
                if (key) {
                    const loadedSession = await this.loadSession(key);
                    console.log("СЕССИЯ В НАЧАЛЕ", loadedSession);
                }
                if (command_text === '/start') {
                    if (key) {
                        // console.log(ctx.chat);
                        const loadedSession = await this.loadSession(key);
                        console.log("Загруженная сессия:", loadedSession);

                        ctx.session = Object.keys(loadedSession).length !== 0 ? loadedSession : Object.assign({}, ctx.chat, { isChoosing: false, 
                            isInDB: false, isAwaitingAge: false, age: 0 });
                        console.log("Получившаяся сессия:", ctx.session);
                        ctx.session.isInDB = await this.userExistsInDb(key);
                    }

                    await next();
    
                    if (key && ctx.chat) {
                        await this.saveData(key, ctx);
                    }
                } 
                else if (command_text === 'Да') {
                    if (key) {
                        const loadedSession = await this.loadSession(key);
                        console.log("Загруженная сессия:", loadedSession);
                        ctx.session = loadedSession;
                        await next();
                    }
                } else if (ctx.session.isAwaitingAge) {
                    const age = parseInt(command_text, 10);
                    console.log("AGE IN db", age);
                    if (!isNaN(age) && age > 0 && age < 120) {
                        ctx.session.age = age; // Сохраняем возраст в сессии
                        ctx.session.isAwaitingAge = false; // Сбрасываем состояние ожидания
                        await ctx.reply(`Ваш возраст: ${age} лет. Анкета обновлена.`);

                        // Сохраняем сессию с возрастом в БД
                        if (key) {
                            await this.saveData(key, ctx);
                        }
                    } else {
                        await ctx.reply("Пожалуйста, введите корректный возраст (число от 1 до 120).");
                    }
                } else {
                    console.log(`Обрабатываемое сообщение: ${command_text}`);
                    console.log(`isAwaitingAge: ${ctx.session.isAwaitingAge}`);
                    await next();
                }
            } else {
                await next();
            }
        };
    }
    
    

    public getSessionKey(ctx: IBotContext): string | null {
        return ctx.from ? `${ctx.from.id}` : null;
    }

    private loadSession(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log("loadSession reached");
            this.db.get('SELECT data FROM users WHERE id = ?', [key], 
                (err, row : SessionData | undefined) => {
                    console.log("Прочитано из БД:", row);
                if (err) {
                    return reject(err);
                }
                resolve(row ? JSON.parse(row.data) : {});
            });
        });
    }

    private saveData(key: string, ctx: any): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(
                'INSERT INTO users (id, data) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET data = ?',
                [key, JSON.stringify(ctx.session), JSON.stringify(ctx.session)],
                (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                }
            );
        });
    }

    private userExistsInDb(key: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT id FROM users WHERE id = ?', [key], (err, row) => {
                if (err) {
                    return reject(err);
                }
                // Если запись найдена, возвращаем true, иначе false
                resolve(!!row);
            });
        });
    }

}
