import { WebException } from '../service/web-service/web-exception.js';
import {
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  MessageFlags,
  ModalSubmitInteraction, PrimaryEntryPointCommandInteraction, UserContextMenuCommandInteraction
} from 'discord.js';
import { BotException } from '../exception/bot-exception.js';

class ExceptionHandler {

  async handle(interaction: ModalSubmitInteraction | ChatInputCommandInteraction | MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction | PrimaryEntryPointCommandInteraction, error: any) {
    let message = 'There was an error while executing this command!';
    if(error instanceof WebException || error instanceof BotException) {
      message = error.message;
    } else {
      console.error(error);
    }

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: message,
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: message,
        flags: MessageFlags.Ephemeral,
      });
    }
  }

}

export const exceptionHandler = new ExceptionHandler();