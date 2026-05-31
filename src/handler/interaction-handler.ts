import { AutocompleteInteraction, ChatInputCommandInteraction } from 'discord.js';
import { BotClient } from '../botClient.js';
import { exceptionHandler } from './exception-handler.js';
import { eventService } from '../service/web-service/event-service/event-service.js';
import { eventUtils } from '../service/event-utils.js';

class InteractionHandler {

  async handle(interaction: AutocompleteInteraction) {

    const focused = interaction.options.getFocused(true);

    if("event-name" === focused.name) {
      const events = await eventService.findActive(interaction.user.id);

      await interaction.respond(
        events.filter(event => event.eventName.includes(focused.value)).slice(0, 25).map(r => ({
          name: r.eventName,
          value: r.id + ""
        }))
      );
    }

    if("program-name" === focused.name) {
      const events = await eventService.findActive(interaction.user.id);
      const results = eventUtils.getAllEventFromEventArray(events).filter(event => event.level > 0);
      await interaction.respond(
        results.filter(event => event.name.includes(focused.value)).slice(0, 25).map(r => ({
          name: r.name,
          value: r.value.id + ""
        }))
      );
    }

    if("todo-name" === focused.name) {
      const events = await eventService.findActive(interaction.user.id);
      const results = eventUtils.getAllTodoFromEventArray(events);
      await interaction.respond(
        results.filter(event => event.name.includes(focused.value)).slice(0, 25).map(r => ({
          name: r.name,
          value: r.value.id + ""
        }))
      );
    }
  }

}

export const interactionHandler = new InteractionHandler();