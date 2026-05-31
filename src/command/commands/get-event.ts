import { Command } from '../command.js';
import { SlashCommandBuilder } from 'discord.js';
import { BotException } from '../../exception/bot-exception.js';
import { findAndPrintEvent } from '../actions/get-event.js';

export default new Command(
  new SlashCommandBuilder().setName('event').setDescription('Retourne l\'événement du nom donné.')
    .addStringOption((option) => option.setName("event-name").setDescription("Le nom de l'événement.").setAutocomplete(true).setRequired(true)),
  async (interaction) => {
    const eventId = interaction.options.getString("event-name");
    if(eventId == null) {
      throw new BotException("Le nom de l'événement est obligatoire.");
    }

    await findAndPrintEvent(interaction, eventId);
  }
);