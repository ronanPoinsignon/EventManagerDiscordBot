import { ChatInputCommandInteraction } from 'discord.js';
import { commandUtils } from '../../utils/command-utils.js';
import { embedUtils } from '../../utils/embed-utils.js';
import { replyService } from '../../utils/reply-service.js';

export const showCommand = async (interaction: ChatInputCommandInteraction, commandName: string) => {
  const commands = await commandUtils.getCommandList();
  const command = commands.find(command => commandName == command.data.name);
  const fields = command?.data.options.map(option => {
    const optionInfo = option.toJSON();
    console.log(optionInfo)
    return {
      name: optionInfo.name + (optionInfo.required ? " [required]" : " [optional]"),
      value: optionInfo.description
    };
  }) || [];
  const embed = embedUtils.createEmbed("Liste des commandes disponibles", fields);

  await replyService.reply(interaction, { embeds: [embed.embed], files: embed.attachments });
}