import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../command.js';
import { getMyEvents } from '../actions/get-my-events.js';

export const command = new Command(
  new SlashCommandBuilder().setName('my-events').setDescription('Voir la liste de mes prochains événements'),
  async (interaction: ChatInputCommandInteraction) => {
    await getMyEvents(interaction)
  }
);