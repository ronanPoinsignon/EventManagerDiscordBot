import { Command } from '../command.js';
import { SlashCommandBuilder } from 'discord.js';
import { showTodoModal } from '../actions/show-todo-modal.js';

export const command = new Command(
  new SlashCommandBuilder().setName('add-todo').setDescription('Créer une nouvelle tâche'),
  async (interaction) => {
    const modal = await showTodoModal(interaction.user.id, null);
    await interaction.showModal(modal);
  }
)