import {
  LabelBuilder,
  ModalBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} from 'discord.js';
import { MODALS } from '../../modal-workflow/modal-workflow-id.js';
import { eventService } from '../../service/web-service/event-service.js';
import { eventUtils } from '../../utils/event-utils.js';

export const showDeleteTodo = async (userId: string) => {
  const events = await eventService.findActive(userId)
    .then(events => eventUtils.getAllTodoFromEventArray(events));

  const modal = new ModalBuilder().setCustomId(MODALS.deleteTodo.id).setTitle("Supprimer un événement");

  const eventNameInput = new StringSelectMenuBuilder()
    .setCustomId(MODALS.deleteTodo.todoId)
    .setPlaceholder('Le todo à supprimer')
    .addOptions(events.map(evt => {
      return new StringSelectMenuOptionBuilder()
        .setLabel(evt.name)
        .setValue(evt.value.id + "")
    }));
  const eventNameLabel = new LabelBuilder()
    .setLabel("L'événement à supprimer")
    .setStringSelectMenuComponent(eventNameInput);

  modal.addLabelComponents(eventNameLabel);

  return modal;
}