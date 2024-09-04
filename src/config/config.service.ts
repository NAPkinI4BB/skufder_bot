import { config, DotenvParseOutput } from "dotenv";
import { IConfigService } from "./config.interface";

export class ConfigService implements IConfigService {
    private cfg: DotenvParseOutput;

    constructor() {
        const { error, parsed } = config();
        if (error || !parsed) {
            throw new Error("Reading .env file error");
        }
        this.cfg = parsed;
    }

    get(key: string): string {
        const res: string | void = this.cfg[key];
        if (!res) {
            throw new Error("Key not found");
        }
        return res;
    }
}