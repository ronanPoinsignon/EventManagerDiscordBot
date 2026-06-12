import { ChatInputCommandInteraction } from 'discord.js';
import { commandUtils } from '../../utils/command-utils.js';
import { embedUtils } from '../../utils/embed-utils.js';
import { messageService } from '../../utils/message-service.js';
import { loggerService } from '../../service/log-service.js';

export const showCommand = async (interaction: ChatInputCommandInteraction, commandName: string) => {
  const commands = await commandUtils.getCommandList();
  const command = commands.find(command => commandName == command.data.name);
  const fields = command?.data.options.map(option => {
    const optionInfo = option.toJSON();
    loggerService.info(optionInfo)
    return {
      name: optionInfo.name + (optionInfo.required ? " [required]" : " [optional]"),
      value: optionInfo.description
    };
  }) || [];
  const embed = embedUtils.informationEmbed("Commande " + commandName, fields, command?.data.description);

  await messageService.reply(interaction, { embeds: [embed.embed], files: embed.attachments });
}