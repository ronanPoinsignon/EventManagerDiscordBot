import { Command } from '../command.js';
import { SlashCommandBuilder } from 'discord.js';
import { showEventModal } from '../actions/show-event-modal.js';
import { showUpdateEventNameModal } from '../actions/update-event-name-modal.js';

export default new Command(
  new SlashCommandBuilder().setName('update-event-name').setDescription('Modifier le nom d\'un événement ou d\'un programme'),
  async (interaction) => {
    const modal = await showUpdateEventNameModal(interaction.user.id);
    await interaction.showModal(modal);
  }
)