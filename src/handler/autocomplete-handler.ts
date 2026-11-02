import { AutocompleteInteraction, Collection, GuildMember } from 'discord.js';
import { eventService } from '../service/web-service/event-service.js';
import { eventUtils } from '../utils/event-utils.js';
import { AbstractInteractionHandler } from './abstract-interaction-handler.js';

class AutocompleteHandler extends AbstractInteractionHandler<AutocompleteInteraction> {

  async handleInternal(interaction: AutocompleteInteraction) {

    const focused = interaction.options.getFocused(true);

    if(eventNames.eventName === focused.name) {
      const events = await eventService.findActive(interaction.user.id);

      await interaction.respond(
        events.filter(event => event.eventName.includes(focused.value)).slice(0, 25).map(r => ({
          name: r.eventName,
          value: r.id + ""
        }))
      );
    }

    if(eventNames.programName === focused.name) {
      const events = await eventService.findActive(interaction.user.id);
      const results = eventUtils.getAllEventFromEventArray(events).filter(event => event.level > 0);
      await interaction.respond(
        results.filter(event => event.name.includes(focused.value)).slice(0, 25).map(r => ({
          name: r.name,
          value: r.value.id + ""
        }))
      );
    }

    if(eventNames.eventProgramName === focused.name) {
      const events = await eventService.findActive(interaction.user.id);
      const results = eventUtils.getAllEventFromEventArray(events);
      await interaction.respond(
        results.filter(event => event.name.toLowerCase().includes(focused.value.toLowerCase())).slice(0, 25).map(r => ({
          name: r.name,
          value: r.value.id + ""
        }))
      );
    }

    if(eventNames.todoName === focused.name) {
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
export const eventNames = {
  eventName: "event-name",
  programName: "program-name",
  eventProgramName: "event-program-name",
  todoName: "todo-name"
}