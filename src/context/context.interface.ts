import { Context } from "telegraf";

export interface ISessionData {
    isLiked?: boolean;
}

export interface IBotContext extends Context {
    session: ISessionData;
}