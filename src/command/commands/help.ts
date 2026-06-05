import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from '../command.js';
import { showAllCommands } from '../actions/show-all-commands.js';
import { showCommand } from '../actions/show-command.js';


export class HelpCommand extends Command {

  constructor(public data: SlashCommandBuilder, runnable: (interaction: ChatInputCommandInteraction) => Promise<void>) {
    super(data, runnable);
  }

  setCommandList(commands: Command[]) {
    this.data.addStringOption(option => option.setName("commande").setDescription("La commande spécifique à afficher.").addChoices(commands.map(command => { return { name: command.data.name, value: command.data.name }})))
  }

}

export const command = new HelpCommand(
  new SlashCommandBuilder().setName('help').setDescription('Voir la liste des commandes et de leur description'),
  async (interaction: ChatInputCommandInteraction) => {
    const command = interaction.options.getString("commande");

    await (command ? showCommand(interaction, command) : showAllCommands(interaction));
  }
);
