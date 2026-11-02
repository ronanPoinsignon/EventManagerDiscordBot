import { Command } from '../command.js';
import { SlashCommandBuilder } from 'discord.js';
import { showTodoModal } from '../actions/show-todo-modal.js';
import { UserException } from '../../exception/bot-exception.js';
import { eventService } from '../../service/web-service/event-service.js';
import { eventNames } from '../../handler/autocomplete-handler.js';

export const command = new Command(
  new SlashCommandBuilder().setName('update-todo').setDescription('Modifier une tâche')
    .addStringOption(option => option.setName(eventNames.todoName).setDescription("Le nom du todo").setAutocomplete(true).setRequired(true)),
  async (interaction) => {
    const todoId = interaction.options.getString(eventNames.todoName);

    if(!todoId) {
      throw new UserException("Le champ todo-name est obligatoire");
    }

    const event = await eventService.findByTodoId(todoId, interaction.user.id);
    const todo = event.todoList.find(todo => todo.id! + "" === todoId)!;

    const modal = await showTodoModal(interaction.user.id, { eventName: event.eventName, todo: todo, parentEventName: event.parentEvent?.eventName || null });
    await interaction.showModal(modal);
  }
)