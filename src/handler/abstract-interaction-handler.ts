import { BaseInteraction } from 'discord.js';
import { messageService } from '../service/message-service.js';

export abstract class AbstractInteractionHandler<T extends BaseInteraction> {

  public async handle(interaction: T) {
    await this.handleInternal(interaction);
  }

  protected abstract handleInternal(interaction: T): Promise<void>;

}