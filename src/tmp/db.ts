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
           

            await next();
    
            if (key && ctx.chat) {
                await this.saveData(key, ctx);
                }
            } 
                
        };
    
    

    public getSessionKey(ctx: IBotContext): string | null {
        return ctx.from ? `${ctx.from.id}` : null;
    }

    public loadSession(key: string): Promise<any> {
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

    public saveData(key: string, ctx: any): Promise<void> {
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

    public userExistsInDb(key: string): Promise<boolean> {
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
