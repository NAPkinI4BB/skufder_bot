import { Context } from "telegraf";

export interface ISessionData {
    isLiked?: boolean;
    isInDB?: boolean;
    isChoosing?: boolean;
    isAwaitingAge?: boolean;
    age?: number
}

export interface IBotContext extends Context {
    session: ISessionData;
}