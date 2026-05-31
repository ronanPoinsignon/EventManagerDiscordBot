import {
  LabelBuilder,
  ModalBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} from 'discord.js';
import { MODALS } from '../../modal-workflow/modal-workflow-id.js';
import { eventService } from '../../service/web-service/event-service/event-service.js';
import { eventUtils } from '../../service/event-utils.js';
import { UserException } from '../../exception/bot-exception.js';

export const showRemoveSubEventModal = async (userId: string) => {
  const events = await eventService.findActive(userId)
    .then(events => eventUtils.getAllEventFromEventArray(events))
    .then(events => events.filter(event => event.level > 0));
  if(events.length == 0) {
    throw new UserException("Aucun sous programme existant.");
  }

  const modal = new ModalBuilder().setCustomId(MODALS.deleteSubEvent.id).setTitle("Supprimer un programme");

  const eventNameInput = new StringSelectMenuBuilder()
    .setCustomId(MODALS.deleteSubEvent.eventId)
    .setPlaceholder('Le programme à supprimer')
    .addOptions(events.map(evt => {
      return new StringSelectMenuOptionBuilder()
        .setLabel(evt.name)
        .setValue(evt.value.id + "")
    }));
  const eventNameLabel = new LabelBuilder()
    .setLabel("Le programme à supprimer")
    .setStringSelectMenuComponent(eventNameInput);

  modal.addLabelComponents(eventNameLabel);

  return modal;
}