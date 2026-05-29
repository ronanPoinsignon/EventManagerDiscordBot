import { Command } from '../command.js';
import {
  FileUploadBuilder,
  LabelBuilder,
  ModalBuilder, SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder, TextDisplayBuilder,
  TextInputBuilder,
  TextInputStyle
} from 'discord.js';
import { MODALS } from '../../modal-workflow/modal-workflow-id.js';

export default new Command(
  new SlashCommandBuilder().setName('create-event').setDescription('Créer un nouvel événement'),
  async (interaction) => {
    const modal = new ModalBuilder().setCustomId(MODALS.createEvent.id).setTitle('Nouvel événement');

    const eventNameInput = new TextInputBuilder()
      .setCustomId(MODALS.createEvent.eventNameId)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Mon nouvel événement');

    const eventNameLabel = new LabelBuilder()
      .setLabel("Nom de l'événement")
      .setDescription("Ce nom doit être unique !")
      .setTextInputComponent(eventNameInput);

    const startDateInput = new TextInputBuilder()
      .setCustomId(MODALS.createEvent.startDateId)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("DD/MM/YYYY")
      .setRequired(true);
    const startDateInputLabel = new LabelBuilder()
      .setLabel("Date de début de l'événement")
      .setTextInputComponent(startDateInput);

    const endDateInput = new TextInputBuilder()
      .setCustomId(MODALS.createEvent.endDateId)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("DD/MM/YYYY")
      .setRequired(false);
    const endDateInputLabel = new LabelBuilder()
      .setLabel("Date de fin de l'événement")
      .setTextInputComponent(endDateInput);

    const adresseInput = new TextInputBuilder()
      .setCustomId(MODALS.createEvent.adresseId)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("78 rue constant forget, Nantes")
      .setRequired(false);
    const adresseInputLabel = new LabelBuilder()
      .setLabel("Adresse de l'événement")
      .setTextInputComponent(adresseInput);

    const tricountInput = new TextInputBuilder()
      .setCustomId(MODALS.createEvent.tricountId)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("https://tricount.fr")
      .setRequired(false);
    const tricountInputLabel = new LabelBuilder()
      .setLabel("URL du tricount")
      .setTextInputComponent(tricountInput);

    modal.addLabelComponents(eventNameLabel, startDateInputLabel, endDateInputLabel, adresseInputLabel, tricountInputLabel);

    await interaction.showModal(modal);
  }
)