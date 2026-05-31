import { Command } from '../command.js';
import { SlashCommandBuilder } from 'discord.js';
import { UserException } from '../../exception/bot-exception.js';
import { eventService } from '../../service/web-service/event-service/event-service.js';
import { showSubEventModal } from '../actions/show-sub-event-modal.js';
import { SubEvent } from '../../api/event.js';

export default new Command(
  new SlashCommandBuilder().setName('update-programme').setDescription('Modifier un programme')
    .addStringOption(option => option.setName("program-name").setDescription("Le nom du programme").setAutocomplete(true).setRequired(true)),
  async (interaction) => {
    const eventId = interaction.options.getString('program-name');

    if(!eventId) {
      throw new UserException("Le champ event-name est obligatoire.");
    }

    const event = await eventService.findById(eventId, interaction.user.id) as SubEvent;
    const modal = await showSubEventModal(interaction.user.id, event);
    await interaction.showModal(modal);
  }
)