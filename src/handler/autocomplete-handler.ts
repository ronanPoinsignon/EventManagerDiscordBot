import { AutocompleteInteraction } from 'discord.js';
import { eventService } from '../service/web-service/event-service.js';
import { eventUtils } from '../utils/event-utils.js';
import { AbstractInteractionHandler } from './abstract-interaction-handler.js';

class AutocompleteHandler extends AbstractInteractionHandler<AutocompleteInteraction> {

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

    if("event-program-name" === focused.name) {
      const events = await eventService.findActive(interaction.user.id);
      const results = eventUtils.getAllEventFromEventArray(events);
      await interaction.respond(
        results.filter(event => event.name.toLowerCase().includes(focused.value.toLowerCase())).slice(0, 25).map(r => ({
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

export const autocompleteHandler = new AutocompleteHandler();