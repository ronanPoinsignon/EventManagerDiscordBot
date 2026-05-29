import { Command } from '../command.js';
import { SlashCommandBuilder } from 'discord.js';
import { BotException } from '../../exception/bot-exception.js';
import { findAndPrintEvent } from '../actions/get-event.js';

export default new Command(
  new SlashCommandBuilder().setName('event').setDescription('Retourne l\'événement du nom donné.')
    .addStringOption((option) => option.setName("event-name").setDescription("Le nom de l'événement.")),
  async (interaction) => {
    const eventName = interaction.options.getString("event-name");
    if(eventName == null) {
      throw new BotException("Le nom de l'événement est obligatoire.");
    }

    await findAndPrintEvent(interaction, eventName);
  }
);