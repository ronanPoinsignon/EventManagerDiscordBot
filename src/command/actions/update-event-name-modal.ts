import {
  LabelBuilder,
  ModalBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder, TextInputBuilder, TextInputStyle
} from 'discord.js';
import { MODALS } from '../../modal-workflow/modal-workflow-id.js';
import { eventService } from '../../service/web-service/event-service.js';
import { eventUtils } from '../../utils/event-utils.js';

export const showUpdateEventNameModal = async (userId: string) => {
  const events = await eventService.findActive(userId)
    .then(events => eventUtils.getAllEventFromEventArray(events));

  const modal = new ModalBuilder().setCustomId(MODALS.updateEventName.id).setTitle("Modifier le nom d'un événement");

  const eventNameInput = new StringSelectMenuBuilder()
    .setCustomId(MODALS.updateEventName.eventId)
    .setPlaceholder('L\'événement à sélectionner')
    .addOptions(events.map(evt => {
      return new StringSelectMenuOptionBuilder()
        .setLabel(evt.name)
        .setValue(evt.value.id + "")
    }))
    .setMinValues(1)
    .setMaxValues(1);
  const eventNameLabel = new LabelBuilder()
    .setLabel("L'événement à modifier")
    .setStringSelectMenuComponent(eventNameInput);

  const subEventNameInput = new TextInputBuilder()
    .setCustomId(MODALS.updateEventName.newEventName)
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Modifier le nom');
  const subEventNameLabel = new LabelBuilder()
    .setLabel("Le nouveau nom")
    .setDescription("Ce nom doit être unique !")
    .setTextInputComponent(subEventNameInput);

  modal.addLabelComponents(eventNameLabel, subEventNameLabel);

  return modal;
}