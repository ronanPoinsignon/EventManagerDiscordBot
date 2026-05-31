import { Command } from '../command.js';
import { SlashCommandBuilder } from 'discord.js';
import { showDeleteEventModal } from '../actions/show-delete-event-modal.js';

export default new Command(
  new SlashCommandBuilder().setName('delete-event').setDescription('Supprimer un événement'),
  async (interaction) => {
    const modal = await showDeleteEventModal(interaction.user.id);
    await interaction.showModal(modal);
  }
)