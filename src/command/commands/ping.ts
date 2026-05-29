import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../command.js';

export default new Command(
  new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
  async (interaction: ChatInputCommandInteraction) => {
    await interaction.reply('Pong!');
  }
);