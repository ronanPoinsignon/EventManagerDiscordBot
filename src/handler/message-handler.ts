import { ChatInputCommandInteraction } from 'discord.js';
import { exceptionHandler } from './exception-handler.js';
import { loggerService } from '../service/log-service.js';
import { commandUtils } from '../utils/command-utils.js';

let commandMap = new Map();
commandUtils.getCommandMap().then(map => {
  commandMap = map;
});

class MessageHandler {

  async handle(interaction: ChatInputCommandInteraction) {
    const command = commandMap.get(interaction.commandName);

    if (!command) {
      loggerService.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    await interaction.deferReply();

    try {
      await command.execute(interaction);
    } catch (error: any) {
      await exceptionHandler.handle(interaction, error);
    }
  }

}

export const messageHandler = new MessageHandler();