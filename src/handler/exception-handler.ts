import { WebException } from '../service/web-service/web-exception.js';
import {
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  ModalSubmitInteraction, PrimaryEntryPointCommandInteraction, UserContextMenuCommandInteraction
} from 'discord.js';
import { BotException } from '../exception/bot-exception.js';
import { messageService } from '../service/message-service.js';
import { embedUtils } from '../utils/embed-utils.js';
import { loggerService } from '../service/log-service.js';

class ExceptionHandler {

  async handle(interaction: ModalSubmitInteraction | ChatInputCommandInteraction | MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction | PrimaryEntryPointCommandInteraction, error: any) {
    let message = 'There was an error while executing this command!';
    if(error instanceof WebException || error instanceof BotException) {
      message = error.message;
    } else {
      loggerService.error(error);
    }

    const embed = embedUtils.errorEmbed("Erreur", [], message);
    try {
      await messageService.replyEmbed(interaction, { embed: [ embed.embed ], attachment: embed.attachments });
    } catch (e) {
      loggerService.error(e);
    }
  }

}

export const exceptionHandler = new ExceptionHandler();