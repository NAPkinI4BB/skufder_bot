import sqlite3 from 'sqlite3';
import { Middleware } from 'telegraf';
import { IBotContext } from '../context/context.interface';

interface SessionData {
    data: string;
}

export class SQLiteSession {
    private db: sqlite3.Database;

    constructor() {
        this.db = new sqlite3.Database('sessions.sqlite3', (err) => {
            if (err) {
                console.error('Error opening database', err);
            } else {
                this.db.run(`
                    CREATE TABLE IF NOT EXISTS users (
                        id TEXT PRIMARY KEY,
                        first_name TEXT,
                        username TEXT
                    )
                `);
            }
        });
    }

    middleware(): Middleware<IBotContext> {
        return async (ctx, next) => {
            const key = this.getSessionKey(ctx);

            if (key) {
                ctx.session = await this.loadSession(key);
            }

            await next();

            if (key && ctx.from) {
                await this.saveData(key, ctx.from);
            }
        };
    }

    private getSessionKey(ctx: IBotContext): string | null {
        return ctx.from ? `${ctx.from.id}` : null;
    }

    private loadSession(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT username FROM users WHERE id = ?', [key], 
                (err, row : SessionData | undefined) => {
                if (err) {
                    return reject(err);
                }
                resolve(row ? JSON.parse(row.data) : {});
            });
        });
    }

    private saveData(key: string, fromData: any): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run(
                'INSERT INTO users (id, first_name, username) VALUES (?, ?, ?)', //ON CONFLICT(id) DO UPDATE SET data = ?',
                [key, JSON.stringify(fromData.first_name), JSON.stringify(fromData.username)],
                (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                }
            );
        });
    }
}
