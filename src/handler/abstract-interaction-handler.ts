import { BaseInteraction } from 'discord.js';

export abstract class AbstractInteractionHandler<T extends BaseInteraction> {

  public abstract handle(interaction: T): void;

}