import { Command } from '../command.js';
import { SlashCommandBuilder } from 'discord.js';
import { showSetChannelInformation } from '../actions/show-set-channel-information.js';

export const command = new Command(
  new SlashCommandBuilder().setName("set-bot-salon-information").setDescription("Définir le salon de communication."),
  async (interaction) => {
    const modal = await showSetChannelInformation(interaction);
    await interaction.showModal(modal);
  }
);