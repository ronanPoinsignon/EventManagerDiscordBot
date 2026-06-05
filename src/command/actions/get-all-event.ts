import { eventService } from '../../service/web-service/event-service.js';
import { dateUtils } from '../../utils/date-utils.js';
import { embedUtils } from '../../utils/embed-utils.js';
import { ChatInputCommandInteraction } from 'discord.js';
import { replyService } from '../../utils/reply-service.js';

export const getAll = async (interaction: ChatInputCommandInteraction) => {
  const events = await eventService.findActive(interaction.user.id);
  const fields = events.map(event => {
    return {
      name: event.eventName,
      value: event.endDate == null ? dateUtils.toString(event.startDate) : dateUtils.toStringRange({ startDate: event.startDate, endDate: event.endDate }),
    }
  });

  const description = fields.length == 0 ? "Aucun événement futur." : undefined;
  const embed = embedUtils.informationEmbed("Prochains événements", fields, description);

  await replyService.reply(interaction, { embeds: [embed.embed], files: embed.attachments });
}