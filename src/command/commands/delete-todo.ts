import { Command } from '../command.js';
import { SlashCommandBuilder } from 'discord.js';
import { showDeleteTodo } from '../actions/show-delete-todo-modal.js';

export const command = new Command(
  new SlashCommandBuilder().setName('delete-todo').setDescription('Supprimer une tâche d\' un événement'),
  async (interaction) => {
    const modal = await showDeleteTodo(interaction.user.id);
    await interaction.showModal(modal);
  }
)