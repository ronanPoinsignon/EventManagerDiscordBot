import { Command } from '../command.js';
import { SlashCommandBuilder } from 'discord.js';
import { BotException } from '../../exception/bot-exception.js';
import { eventService } from '../../service/web-service/event-service.js';
import { embedUtils } from '../../utils/embed-utils.js';
import { messageService } from '../../utils/message-service.js';

export const command = new Command(
  new SlashCommandBuilder().setName('add-me').setDescription('S\'ajouter à un événement ou un programme')
    .addStringOption((option) => option.setName("event-program-name").setDescription("Le nom de l'événement ou du programme.").setAutocomplete(true).setRequired(true)),
  async (interaction) => {
    const eventId = interaction.options.getString("event-program-name");
    if(eventId == null) {
      throw new BotException("Le nom de l'événement est obligatoire.");
    }

    await eventService.addEventParticipant(eventId, [interaction.user.id], interaction.user.id);

    const embed = embedUtils.informationEmbed("Participation à un événement", [], "Vous avez bien été ajouté à l'événement !")
    await messageService.replyEmbed(interaction, { embed: [ embed.embed ], attachment: embed.attachments });
  }
);