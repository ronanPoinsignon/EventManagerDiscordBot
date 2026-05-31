import { Command } from '../command.js';
import { SlashCommandBuilder } from 'discord.js';
import { showSubEventModal } from '../actions/show-sub-event-modal.js';

export default new Command(
  new SlashCommandBuilder().setName('add-program').setDescription('Ajouter un programme sur un événement'),
  async (interaction) => {
    const modal = await showSubEventModal(interaction.user.id, null);
    await interaction.showModal(modal);
  }
)