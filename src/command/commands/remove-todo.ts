import { Command } from '../command.js';
import { SlashCommandBuilder } from 'discord.js';
import { showRemoveTodo } from '../actions/show-remove-todo-modal.js';

export const command = new Command(
  new SlashCommandBuilder().setName('remove-todo').setDescription('Supprimer une tâche d\' un événement'),
  async (interaction) => {
    const modal = await showRemoveTodo(interaction.user.id);
    await interaction.showModal(modal);
  }
)