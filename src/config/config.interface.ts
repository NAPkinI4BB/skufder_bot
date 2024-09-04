import { DotenvConfigOutput } from "dotenv";

export interface IConfigService {
    get(key: string): string;
}