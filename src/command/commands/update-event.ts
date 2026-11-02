import { Command } from '../command.js';
import { SlashCommandBuilder } from 'discord.js';
import { UserException } from '../../exception/bot-exception.js';
import { eventService } from '../../service/web-service/event-service.js';
import { showEventModal } from '../actions/show-event-modal.js';
import { eventNames } from '../../handler/autocomplete-handler.js';

export const command = new Command(
  new SlashCommandBuilder().setName('update-event').setDescription('Modifier un événement')
    .addStringOption(option => option.setName(eventNames.eventName).setDescription("Le nom de l'événement").setAutocomplete(true).setRequired(true)),
  async (interaction) => {
    const eventId = interaction.options.getString(eventNames.eventName);

    if(!eventId) {
      throw new UserException("Le champ event-name est obligatoire.");
    }

    const event = await eventService.findById(eventId, interaction.user.id);
    const modal = await showEventModal(event);
    await interaction.showModal(modal);
  }
)