import { Command } from '../command.js';
import { SlashCommandBuilder } from 'discord.js';
import { showEventModal } from '../actions/show-event-modal.js';

export default new Command(
  new SlashCommandBuilder().setName('create-event').setDescription('Créer un nouvel événement'),
  async (interaction) => {
    const modal = await showEventModal(null);
    await interaction.showModal(modal);
  }
)