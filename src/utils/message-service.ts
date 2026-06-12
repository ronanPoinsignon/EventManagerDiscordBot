import {
  ChatInputCommandInteraction,
  InteractionReplyOptions, MessageContextMenuCommandInteraction, APIEmbed, MessagePayload,
  ModalSubmitInteraction, PrimaryEntryPointCommandInteraction, UserContextMenuCommandInteraction, AttachmentBuilder,
  Message, BooleanCache, NewsChannel, StageChannel, TextChannel, PublicThreadChannel, PrivateThreadChannel, VoiceChannel
} from 'discord.js';
import { JSONEncodable } from '@discordjs/util';
import { exceptionHandler } from '../handler/exception-handler.js';
import { loggerService } from '../service/log-service.js';

class MessageService {

  async sendMessage(channel: NewsChannel | StageChannel | TextChannel | PublicThreadChannel<boolean> | PrivateThreadChannel | VoiceChannel, message: string) {
    try {
      await channel.send(message);
    } catch (e) {
      loggerService.error(e);
    }
  }

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
    const message = { embeds: value.embed, files: value.attachment };
    if (interaction.replied || interaction.deferred) {
      await this.sendmessage(interaction.followUp, message);
    } else {
      await this.sendmessage(interaction.reply, message);
    }
  }

  private async sendmessage<T extends string | MessagePayload | InteractionReplyOptions>(sendFunction: (options: T) => any, options: T) {
    try {
      await sendFunction(options);
    } catch(e) {
      loggerService.error(e);
    }
  }

}

export const messageService = new MessageService();