import {
  ChatInputCommandInteraction,
  LabelBuilder,
  ModalBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ChannelType
} from 'discord.js';
import { MODALS } from '../../modal-workflow/modal-workflow-id.js';

export const showSetChannelInformation = async (interaction: ChatInputCommandInteraction) => {
  const channels = interaction.guild!.channels.cache.filter(channel => channel.type ==  ChannelType.GuildText).sort((c1, c2) => c1.name.localeCompare(c2.name));

  const modal = new ModalBuilder().setCustomId(MODALS.setChannelCommunication.id).setTitle("Définir le salon de communication");

  const eventNameInput = new StringSelectMenuBuilder()
    .setCustomId(MODALS.setChannelCommunication.channelId)
    .setPlaceholder('Le salon de communication')
    .addOptions(channels.map(channel => {
      const name = channel.name;
      const cutName = name.length <= 25 ? name : (name.substring(0, 22) + "...");
      return new StringSelectMenuOptionBuilder()
        .setLabel(cutName)
        .setValue(channel.id)
    }));
  const eventNameLabel = new LabelBuilder()
    .setLabel("Le salon de communication")
    .setStringSelectMenuComponent(eventNameInput);

  modal.addLabelComponents(eventNameLabel);

  return modal;
}