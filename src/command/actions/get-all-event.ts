import { eventService } from '../../service/web-service/event-service/event-service.js';
import { dateService } from '../../service/date-service.js';
import { embedService } from '../../service/embed-service.js';
import { ChatInputCommandInteraction } from 'discord.js';

export const getAll = async (interaction: ChatInputCommandInteraction) => {
  const events = await eventService.findActive(interaction.user.id);
  const fields = events.map(event => {
    return {
      name: event.eventName,
      value: event.endDate != null ? `Du ${dateService.toString(event.startDate)} au ${dateService.toString(event.endDate)}` : `Le ${dateService.toString(event.startDate)}`,
    }
  });

  const description = fields.length == 0 ? "Aucun événement futur." : undefined;
  const embed = embedService.createEmbed("Prochains événements", fields, description);

  await interaction.reply({ embeds: [embed.embed], files: embed.attachments });
}