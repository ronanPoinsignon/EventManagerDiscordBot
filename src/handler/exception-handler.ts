import { WebException } from '../service/web-service/web-exception.js';
import {
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  ModalSubmitInteraction, PrimaryEntryPointCommandInteraction, UserContextMenuCommandInteraction
} from 'discord.js';
import { BotException } from '../exception/bot-exception.js';
import { replyService } from '../utils/reply-service.js';
import { embedUtils } from '../utils/embed-utils.js';

class ExceptionHandler {

  async handle(interaction: ModalSubmitInteraction | ChatInputCommandInteraction | MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction | PrimaryEntryPointCommandInteraction, error: any) {
    let message = 'There was an error while executing this command!';
    if(error instanceof WebException || error instanceof BotException) {
      message = error.message;
    } else {
      console.error(error);
    }

    const embed = embedUtils.errorEmbed("Erreur", [], message);
    try {
      await replyService.replyEmbed(interaction, { embed: [ embed.embed ], attachment: embed.attachments });
    } catch (e) {
      console.error(e);
    }
  }

}

export const exceptionHandler = new ExceptionHandler();