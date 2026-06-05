import { Command } from '../command.js';
import { SlashCommandBuilder } from 'discord.js';
import { showSetEventParticipant } from '../actions/show-set-event-participant-modal.js';

export const command = new Command(
  new SlashCommandBuilder().setName('update-participants').setDescription('Modifier les participants d\'un événement ou d\'un programme'),
  async (interaction) => {
    const modal = await showSetEventParticipant(interaction.user.id);
    await interaction.showModal(modal);
  }
);