import { Client, ClientOptions, Collection } from "discord.js";
import { Command } from "./command/command.js";

export class BotClient extends Client {
    commands = new Collection<string, Command>();

    constructor(options: ClientOptions) {
        super(options);
    }
    
}