import { ModalSubmitInteraction } from 'discord.js';

export abstract class ModalWorkflow {

  abstract run(interaction: ModalSubmitInteraction): Promise<void>;

}