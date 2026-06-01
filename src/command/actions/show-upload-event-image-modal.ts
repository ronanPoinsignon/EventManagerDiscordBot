import {
  FileUploadBuilder,
  LabelBuilder,
  ModalBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} from 'discord.js';
import { MODALS } from '../../modal-workflow/modal-workflow-id.js';
import { eventService } from '../../service/web-service/event-service.js';

export const showUploadEventImageModal = async (userId: string) => {
  const events = await eventService.findActive(userId)
    .then(events => events.sort((evt1, evt2) => evt1.eventName.localeCompare(evt2.eventName)));

  const modal = new ModalBuilder().setCustomId(MODALS.uploadEventImage.id).setTitle("Définir l'image d'un événement");

  const eventNameInput = new StringSelectMenuBuilder()
    .setCustomId(MODALS.uploadEventImage.eventId)
    .setPlaceholder('Mon événement à supprimer')
    .addOptions(events.map(evt => {
      return new StringSelectMenuOptionBuilder()
        .setLabel(evt.eventName)
        .setValue(evt.id + "")
    }));
  const eventNameLabel = new LabelBuilder()
    .setLabel("L'événement à supprimer")
    .setStringSelectMenuComponent(eventNameInput);

  const eventPicture = new FileUploadBuilder().setCustomId(MODALS.uploadEventImage.image)
    .setMaxValues(1)
    .setRequired(true);
  const eventPictureLabel = new LabelBuilder()
    .setLabel('L\'image de l\'événement')
    .setDescription('Choisissez la nouvelle image de l\'événement')
    .setFileUploadComponent(eventPicture);

  modal.addLabelComponents(eventNameLabel, eventPictureLabel);

  return modal;
}