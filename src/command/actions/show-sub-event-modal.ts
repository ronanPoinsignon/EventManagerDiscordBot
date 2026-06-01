import {
  LabelBuilder, ModalBuilder, StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder, TextInputBuilder, TextInputStyle
} from 'discord.js';
import { MODALS } from '../../modal-workflow/modal-workflow-id.js';
import { eventService } from '../../service/web-service/event-service.js';
import { dateUtils } from '../../utils/date-utils.js';
import { SubEvent } from '../../api/event.js';

export const showSubEventModal = async (userId: string, event: SubEvent | null) => {
  const parentEvents = event == null ? await eventService.findActive(userId) : [event?.parentEvent];

  const modalId = event ? MODALS.createSubEvent.id + "-update" : MODALS.createSubEvent.id;
  const modal = new ModalBuilder().setCustomId(modalId).setTitle(event ? `${event?.eventName}` : 'Nouvel événement');

  const eventNameInput = new StringSelectMenuBuilder()
    .setCustomId(MODALS.createSubEvent.eventNameId)
    .setPlaceholder('Mon événement')
    .addOptions(parentEvents.map(evt => {
      return new StringSelectMenuOptionBuilder()
        .setLabel(evt.eventName)
        .setValue(evt.id + "")
        .setDefault(event != null && evt.eventName == event.parentEvent?.eventName)
    }));
  const eventNameLabel = new LabelBuilder()
    .setLabel("Nom de l'événement")
    .setDescription("Le nom de l'événement sur lequel ajouter votre programme")
    .setStringSelectMenuComponent(eventNameInput);

  const subEventNameInput = new TextInputBuilder()
    .setCustomId(MODALS.createSubEvent.subEventNameId)
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Nom du programme');
  if(event?.eventName) {
    subEventNameInput.setValue(event?.eventName);
  }
  const subEventNameLabel = new LabelBuilder()
    .setLabel("Nom du programme")
    .setDescription("Ce nom doit être unique dans la liste de programme de l'événement !")
    .setTextInputComponent(subEventNameInput);

  const startDateInput = new TextInputBuilder()
    .setCustomId(MODALS.createSubEvent.startDateId)
    .setStyle(TextInputStyle.Short)
    .setPlaceholder(dateUtils.getDatePlaceholder())
    .setRequired(true);
  const startDate = dateUtils.toString(event?.startDate);
  if(startDate) {
    startDateInput.setValue(startDate);
  }
  const startDateInputLabel = new LabelBuilder()
    .setLabel("Date de début de l'événement")
    .setTextInputComponent(startDateInput);

  const endDateInput = new TextInputBuilder()
    .setCustomId(MODALS.createSubEvent.endDateId)
    .setStyle(TextInputStyle.Short)
    .setPlaceholder(dateUtils.getDatePlaceholder())
    .setRequired(false);
  const endDate = dateUtils.toString(event?.endDate);
  if(endDate) {
    endDateInput.setValue(endDate);
  }
  const endDateInputLabel = new LabelBuilder()
    .setLabel("Date de fin de l'événement")
    .setTextInputComponent(endDateInput);

  const adresseInput = new TextInputBuilder()
    .setCustomId(MODALS.createSubEvent.adresseId)
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("78 rue constant forget, Nantes")
    .setRequired(false)
    .setValue(event?.location || "");
  const adresseInputLabel = new LabelBuilder()
    .setLabel("Adresse de l'événement")
    .setTextInputComponent(adresseInput);

  modal.addLabelComponents(eventNameLabel, subEventNameLabel, startDateInputLabel, endDateInputLabel, adresseInputLabel);

  return modal;
}