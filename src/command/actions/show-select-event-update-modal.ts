import {
  LabelBuilder,
  ModalBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} from 'discord.js';
import { MODALS } from '../../modal-workflow/modal-workflow-id.js';
import { eventService } from '../../service/web-service/event-service/event-service.js';
import { UserException } from '../../exception/bot-exception.js';

export const showSelectEventUpdate = async (userId: string) => {
  const events = await eventService.findActive(userId);
  if(events.length == 0) {
    throw new UserException("Aucun événement trouvé.");
  }

  const modal = new ModalBuilder().setCustomId(MODALS.selectEventUpdate.id).setTitle("Choisissez un événement à modifier");

  const eventNameInput = new StringSelectMenuBuilder()
    .setCustomId(MODALS.selectEventUpdate.eventId)
    .setPlaceholder('L\'événement à modifier')
    .addOptions(events.map(evt => {
      return new StringSelectMenuOptionBuilder()
        .setLabel(evt.eventName)
        .setValue(evt.id + "")
    }));
  const eventNameLabel = new LabelBuilder()
    .setLabel("L\'événement à modifier")
    .setStringSelectMenuComponent(eventNameInput);

  modal.addLabelComponents(eventNameLabel);

  return modal;
}