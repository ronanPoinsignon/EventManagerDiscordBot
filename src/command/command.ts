import { ChatInputCommandInteraction } from 'discord.js';
import { SharedSlashCommand } from '@discordjs/builders';

export class Command {

    constructor(public data: SharedSlashCommand, private runnable: (interaction: ChatInputCommandInteraction) => Promise<void>, public permissions: bigint[] = []) {
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        return await this.runnable(interaction);
    }
}