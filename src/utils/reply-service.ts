import {
  ChatInputCommandInteraction,
  Interaction, InteractionReplyOptions,
  MessageContextMenuCommandInteraction, MessageFlags, MessagePayload,
  ModalSubmitInteraction, PrimaryEntryPointCommandInteraction, UserContextMenuCommandInteraction
} from 'discord.js';

class ReplyService {

  async reply(interaction: ModalSubmitInteraction | ChatInputCommandInteraction | MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction | PrimaryEntryPointCommandInteraction,
              value: string | MessagePayload | InteractionReplyOptions) {
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(value);
    } else {
      await interaction.reply(value);
    }
  }

}

export const replyService = new ReplyService();