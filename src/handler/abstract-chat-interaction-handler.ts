import { ChatInputCommandInteraction } from 'discord.js';
import { messageService } from '../service/message-service.js';
import { AbstractInteractionHandler } from './abstract-interaction-handler.js';

export abstract class AbstractChatInteractionHandler<T extends ChatInputCommandInteraction> extends AbstractInteractionHandler<T> {

  public async handle(interaction: T) {
    if(!interaction.inGuild()) {
      await messageService.reply(interaction, "Les commandes doivent être pour le moment faites dans un serveur.");
      return;
    }

    await this.handleInternal(interaction);
  }

  public abstract handleInternal(interaction: T): Promise<void>;

}