import { Command } from '../command.js';
import { SlashCommandBuilder } from 'discord.js';
import { showSetEventParticipant } from '../actions/show-set-event-participant-modal.js';
import { UserException } from '../../exception/bot-exception.js';
import { eventNames } from '../../handler/autocomplete-handler.js';

export const command = new Command(
  new SlashCommandBuilder().setName('update-participants').setDescription('Modifier les participants d\'un événement ou d\'un programme')
    .addStringOption(option => option.setName(eventNames.eventProgramName).setDescription("Le nom de l'événement ou du programme").setAutocomplete(true).setRequired(true)),
  async (interaction) => {
    const eventId = interaction.options.getString(eventNames.eventProgramName);
    if(eventId == null) {
      throw new UserException("Un événement doit être choisi.");
    }

    const modal = await showSetEventParticipant(interaction.user.id, eventId);
    await interaction.showModal(modal);
  }
);