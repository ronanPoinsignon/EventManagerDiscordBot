import {
  LabelBuilder,
  ModalBuilder, StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  TextInputBuilder,
  TextInputStyle
} from 'discord.js';
import { MODALS } from '../../modal-workflow/modal-workflow-id.js';
import { userService } from '../../service/web-service/user-service/user-service.js';
import { eventService } from '../../service/web-service/event-service/event-service.js';
import { eventUtils } from '../../service/event-utils.js';
import { Todo } from '../../api/todo.js';
import { userUtils } from '../../service/user-utils.js';
import { UserException } from '../../exception/bot-exception.js';
export const showTodoModal = async (userId: string, todoInfo: { eventName: string, todo: Todo, parentEventName: string | null } | null) => {
  const todo = todoInfo?.todo;
  const users = await userService.getAllUsers(userId);
  const events = await eventService.findActive(userId)
    .then(events => eventUtils.getAllEventFromEventArray(events))
    .then(events => events.sort((evt1, evt2) => evt1.name.localeCompare(evt2.name)));

  if(events.length == 0) {
    throw new UserException("Aucun événement n'a été trouvé.")
  }
  const modal = new ModalBuilder().setCustomId(MODALS.createTodo.id).setTitle(todoInfo ? `Modification todo ${todoInfo.eventName}` : 'Nouveau todo');

  const eventNameInput = new StringSelectMenuBuilder()
    .setCustomId(MODALS.createTodo.eventId)
    .setPlaceholder('Mon événement')
    .addOptions(events.map(evt => {
      return new StringSelectMenuOptionBuilder()
        .setLabel(evt.name)
        .setValue(evt.value.id + "")
        .setDefault(evt.value.eventName == todoInfo?.eventName)
    }));
  const eventNameLabel = new LabelBuilder()
    .setLabel("Nom de l'événement")
    .setDescription("Ce nom doit être unique !")
    .setStringSelectMenuComponent(eventNameInput);

  const todoNameInput = new TextInputBuilder()
    .setCustomId(MODALS.createTodo.todoName)
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("Nom du todo");
  if(todo?.name) {
    todoNameInput.setValue(todo.name);
  }
  const todoNameLabel = new LabelBuilder()
    .setLabel("Nom du todo")
    .setTextInputComponent(todoNameInput);

  const todoValueInput = new TextInputBuilder()
    .setCustomId(MODALS.createTodo.todoValue)
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder("À faire");
  if(todo?.todoValue) {
    todoValueInput.setValue(todo.todoValue);
  }
  const todoValueLabel = new LabelBuilder()
    .setLabel("À faire")
    .setTextInputComponent(todoValueInput);

  const options = users.map(user => {
    return new StringSelectMenuOptionBuilder()
      .setLabel(userUtils.parseUserName(user))
      .setValue(user.id)
      .setDefault((todo?.participants?.map(user => user.discordId + "") || [ userId ]).indexOf(user.discordId + "") >= 0)
  });
  const participantInput = new StringSelectMenuBuilder()
    .setCustomId(MODALS.createTodo.participants)
    .setPlaceholder('Participants')
    .addOptions(options)
    .setMaxValues(users.length)
    .setRequired(false);

  const participantsLabel = new LabelBuilder()
    .setLabel("Liste des participants")
    .setStringSelectMenuComponent(participantInput);

  const doneNameInput = new StringSelectMenuBuilder()
    .setCustomId(MODALS.createTodo.todoDone)
    .setPlaceholder('Fait ?')
    .addOptions([
      new StringSelectMenuOptionBuilder()
        .setLabel("Fait")
        .setValue("true")
        .setDefault(todo?.done === true),
      new StringSelectMenuOptionBuilder()
        .setLabel("À faire")
        .setValue("false")
        .setDefault(todo?.done === false)
    ]);
  const doneNameLabel = new LabelBuilder()
    .setLabel("À faire ?")
    .setStringSelectMenuComponent(doneNameInput);

  modal.addLabelComponents(eventNameLabel, todoNameLabel, todoValueLabel, participantsLabel, doneNameLabel);

  return modal;
}
