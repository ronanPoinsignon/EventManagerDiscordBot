import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../command.js';
import { getAll } from '../actions/get-all-event.js';

export default new Command(
  new SlashCommandBuilder().setName('get-events').setDescription('Retourne la liste des événements.'),
  async (interaction: ChatInputCommandInteraction) => {
    await getAll(interaction)
  }
);