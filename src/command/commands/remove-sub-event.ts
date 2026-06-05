import { Command } from '../command.js';
import { SlashCommandBuilder } from 'discord.js';
import { showRemoveSubEventModal } from '../actions/show-remove-sub-event-modal.js';

export const command =new Command(
  new SlashCommandBuilder().setName('remove-programme').setDescription('Supprimer un programme d\'un événement'),
  async (interaction) => {
    const modal = await showRemoveSubEventModal(interaction.user.id);
    await interaction.showModal(modal);
  }
)