import { embedUtils } from '../../utils/embed-utils.js';
import { ChatInputCommandInteraction } from 'discord.js';
import { messageService } from '../../service/message-service.js';
import { commandUtils } from '../../utils/command-utils.js';

export const showAllCommands = async (interaction: ChatInputCommandInteraction) => {
  const commands = await commandUtils.getCommandList();

  const fields = commands.map(command => {
    return {
      name: command.data.name,
      value: command.data.description
    }
  });

  const embed = embedUtils.informationEmbed("Liste des commandes disponibles", fields);

  await messageService.reply(interaction, { embeds: [embed.embed], files: embed.attachments });
}