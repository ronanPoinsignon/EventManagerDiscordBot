import {
  ChatInputCommandInteraction,
  InteractionReplyOptions, MessageContextMenuCommandInteraction, APIEmbed, MessagePayload,
  ModalSubmitInteraction, PrimaryEntryPointCommandInteraction, UserContextMenuCommandInteraction, AttachmentBuilder
} from 'discord.js';
import { JSONEncodable } from '@discordjs/util';

class ReplyService {

  async reply(interaction: ModalSubmitInteraction | ChatInputCommandInteraction | MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction | PrimaryEntryPointCommandInteraction,
              value: string | MessagePayload | InteractionReplyOptions) {
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(value);
    } else {
      await interaction.reply(value);
    }
  }

  async replyEmbed(interaction: ModalSubmitInteraction | ChatInputCommandInteraction | MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction | PrimaryEntryPointCommandInteraction,
              value: { embed: (JSONEncodable<APIEmbed> | APIEmbed)[], attachment: AttachmentBuilder[] }) {
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp( { embeds: value.embed, files: value.attachment });
    } else {
      await interaction.reply({ embeds: value.embed, files: value.attachment });
    }
  }

}

export const replyService = new ReplyService();