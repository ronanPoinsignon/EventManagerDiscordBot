import { Event } from '../../api/event.js';
import {
  LabelBuilder, ModalBuilder, StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder, TextInputBuilder, TextInputStyle
} from 'discord.js';
import { MODALS } from '../../modal-workflow/modal-workflow-id.js';
import { dateUtils } from '../../utils/date-utils.js';

export const showEventModal = async (event: Event | null) => {
  const modal = new ModalBuilder().setCustomId(MODALS.createEvent.id).setTitle('Nouvel événement');

  let eventInput: LabelBuilder;

  if(event == null) {
    const eventNameInput = new TextInputBuilder()
      .setCustomId(MODALS.createEvent.eventNameId)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Mon nouvel événement');
    eventInput = new LabelBuilder()
      .setLabel("Nom de l'événement")
      .setDescription("Ce nom doit être unique !")
      .setTextInputComponent(eventNameInput);
  } else {
    const eventSelect = new StringSelectMenuBuilder()
      .setCustomId(MODALS.createEvent.eventNameId)
      .setPlaceholder('Mon événement')
      .addOptions(new StringSelectMenuOptionBuilder()
        .setLabel(event.eventName)
        .setValue(event.eventName)
        .setDefault(true));
    const eventNameInput = new TextInputBuilder()
      .setCustomId(MODALS.createEvent.eventNameId)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Mon nouvel événement');
    if(event?.eventName) {
      eventNameInput.setValue(event.eventName);
    }
    eventInput = new LabelBuilder()
      .setLabel("Nom de l'événement")
      .setStringSelectMenuComponent(eventSelect);
  }

  const startDateInput = new TextInputBuilder()
    .setCustomId(MODALS.createEvent.startDateId)
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
    .setCustomId(MODALS.createEvent.endDateId)
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
    .setCustomId(MODALS.createEvent.adresseId)
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("78 rue constant forget, Nantes")
    .setRequired(false);
  if(event?.location) {
    adresseInput.setValue(event.location);
  }
  const adresseInputLabel = new LabelBuilder()
    .setLabel("Adresse de l'événement")
    .setTextInputComponent(adresseInput);

  const tricountInput = new TextInputBuilder()
    .setCustomId(MODALS.createEvent.tricountId)
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("https://tricount.fr")
    .setRequired(false);
  if(event?.tricountUrl) {
    tricountInput.setValue(event.tricountUrl);
  }
  const tricountInputLabel = new LabelBuilder()
    .setLabel("URL du tricount")
    .setTextInputComponent(tricountInput);

  modal.addLabelComponents(eventInput, startDateInputLabel, endDateInputLabel, adresseInputLabel, tricountInputLabel);

  return modal;
}