import {
  LabelBuilder,
  ModalBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} from 'discord.js';
import { MODALS } from '../../modal-workflow/modal-workflow-id.js';
import { eventService } from '../../service/web-service/event-service/event-service.js';
import { eventUtils } from '../../service/event-utils.js';
import { userService } from '../../service/web-service/user-service/user-service.js';
import { userUtils } from '../../service/user-utils.js';

export const showSetEventParticipant = async (userId: string) => {
  const events = await eventService.findActive(userId)
    .then(events => eventUtils.getAllEventFromEventArray(events));
  const users = await userService.getAllUsers(userId);

  const modal = new ModalBuilder().setCustomId(MODALS.addEventParticipant.id).setTitle("Ajouter des participants");

  const eventNameInput = new StringSelectMenuBuilder()
    .setCustomId(MODALS.addEventParticipant.eventId)
    .setPlaceholder('L\'événement à sélectionner')
    .addOptions(events.map(evt => {
      return new StringSelectMenuOptionBuilder()
        .setLabel(evt.name)
        .setValue(evt.value.id + "")
    }));
  const eventNameLabel = new LabelBuilder()
    .setLabel("L'événement à modifier")
    .setStringSelectMenuComponent(eventNameInput);

  const userNameInput = new StringSelectMenuBuilder()
    .setCustomId(MODALS.addEventParticipant.participants)
    .setPlaceholder('Les participants à définir')
    .addOptions(users.map(user => {
      return new StringSelectMenuOptionBuilder()
        .setLabel(userUtils.parseUserName(user))
        .setValue(user.id + "")
    }))
    .setMaxValues(users.length)
    .setRequired(false);
  const userNameLabel = new LabelBuilder()
    .setLabel("Les participants")
    .setStringSelectMenuComponent(userNameInput);

  modal.addLabelComponents(eventNameLabel, userNameLabel);

  return modal;
}