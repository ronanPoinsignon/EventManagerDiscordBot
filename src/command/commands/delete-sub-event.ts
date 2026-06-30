import { Command } from '../command.js';
import { SlashCommandBuilder } from 'discord.js';
import { showDeleteSubEventModal } from '../actions/show-delete-sub-event-modal.js';

export const command =new Command(
  new SlashCommandBuilder().setName('delete-programme').setDescription('Supprimer un programme d\'un événement'),
  async (interaction) => {
    const modal = await showDeleteSubEventModal(interaction.user.id);
    await interaction.showModal(modal);
  }
)