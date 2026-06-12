import { ChatInputCommandInteraction } from 'discord.js';
import { BotClient } from '../botClient.js';
import { exceptionHandler } from './exception-handler.js';
import { loggerService } from '../service/log-service.js';

class MessageHandler {

  async handle(client: BotClient, interaction: ChatInputCommandInteraction) {
    const command = client.commands.get(interaction.commandName);

    if (!command) {
      loggerService.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error: any) {
      await exceptionHandler.handle(interaction, error);
    }
  }

}

export const messageHandler = new MessageHandler();