import { ModalSubmitInteraction } from 'discord.js';
import { ModalWorkflow } from '../modal-workflow.js';
import { registerModal } from '../../handler/modal-handler.js';
import { MODALS } from '../modal-workflow-id.js';
import { BotException } from '../../exception/bot-exception.js';
import { messageService } from '../../service/message-service.js';
import { embedUtils } from '../../utils/embed-utils.js';
import { discordGuildService } from '../../service/web-service/discord-guild-service.js';

@registerModal(MODALS.setChannelCommunication.id)
export class DeleteTodoModalWorkflow extends ModalWorkflow {

  async run(interaction:  ModalSubmitInteraction): Promise<void> {
    const fields = interaction.fields;

    const channelId: string | undefined = fields.getStringSelectValues(MODALS.setChannelCommunication.channelId)[0];

    if(channelId == null) {
      throw new BotException('Le salon est obligatoire.');
    }

    const result = await discordGuildService.setDiscordGuildMessageChannel(interaction.guildId!, channelId, interaction.user.id);
    const channel = interaction.guild!.channels.cache.find(channel => channel.id === channelId)

    const embed = embedUtils.validationEmbed("Spécification du salon de communication du bot", [], `Le salon ${channel?.name} est défini comme le salon de communication.`);
    await messageService.replyEmbed(interaction, { embed: [ embed.embed ], attachment: embed.attachments });
  }
}