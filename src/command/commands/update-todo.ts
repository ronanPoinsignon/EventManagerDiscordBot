import { Command } from '../command.js';
import { SlashCommandBuilder } from 'discord.js';
import { showTodoModal } from '../actions/show-todo-modal.js';
import { UserException } from '../../exception/bot-exception.js';
import { eventService } from '../../service/web-service/event-service.js';

export default new Command(
  new SlashCommandBuilder().setName('update-todo').setDescription('Modifier un todo existant')
    .addStringOption(option => option.setName("todo-name").setDescription("Le nom du todo").setAutocomplete(true).setRequired(true)),
  async (interaction) => {
    const todoId = interaction.options.getString("todo-name");

    if(!todoId) {
      throw new UserException("Le champ todo-name est obligatoire");
    }

    const event = await eventService.findByTodoId(todoId, interaction.user.id);
    const todo = event.todoList.find(todo => todo.id! + "" === todoId)!;

    const modal = await showTodoModal(interaction.user.id, { eventName: event.eventName, todo: todo, parentEventName: event.parentEvent?.eventName || null });
    await interaction.showModal(modal);
  }
)