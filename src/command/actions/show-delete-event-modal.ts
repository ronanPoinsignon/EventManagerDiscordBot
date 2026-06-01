import {
  LabelBuilder,
  ModalBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} from 'discord.js';
import { MODALS } from '../../modal-workflow/modal-workflow-id.js';
import { eventService } from '../../service/web-service/event-service.js';

export const showDeleteEventModal = async (userId: string) => {
  const events = await eventService.findActive(userId)
    .then(events => events.sort((evt1, evt2) => evt1.eventName.localeCompare(evt2.eventName)));

  const modal = new ModalBuilder().setCustomId(MODALS.deleteEvent.id).setTitle("Supprimer un événement");

  const eventNameInput = new StringSelectMenuBuilder()
    .setCustomId(MODALS.deleteEvent.eventId)
    .setPlaceholder('Mon événement à supprimer')
    .addOptions(events.map(evt => {
      return new StringSelectMenuOptionBuilder()
        .setLabel(evt.eventName)
        .setValue(evt.id + "")
    }));
  const eventNameLabel = new LabelBuilder()
    .setLabel("L'événement à supprimer")
    .setStringSelectMenuComponent(eventNameInput);

  modal.addLabelComponents(eventNameLabel);

  return modal;
}