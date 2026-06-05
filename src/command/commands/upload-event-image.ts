import { Command } from '../command.js';
import { SlashCommandBuilder } from 'discord.js';
import { showUploadEventImageModal } from '../actions/show-upload-event-image-modal.js';

export const command = new Command(
  new SlashCommandBuilder().setName('upload-image').setDescription('Définir l\'image d\'un événement'),
  async (interaction) => {
    const modal = await showUploadEventImageModal(interaction.user.id);
    await interaction.showModal(modal);
  }
)