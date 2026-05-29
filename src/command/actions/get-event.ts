import { BotException } from '../../exception/bot-exception.js';
import { eventService } from '../../service/web-service/event-service/event-service.js';
import { embedService } from '../../service/embed-service.js';
import { eventUtils } from '../../service/event-utils.js';
import {
  ChatInputCommandInteraction,
  MessageContextMenuCommandInteraction,
  ModalSubmitInteraction, PrimaryEntryPointCommandInteraction, UserContextMenuCommandInteraction
} from 'discord.js';
import { Event } from '../../api/event.js';

export const findAndPrintEvent = async (interaction: ModalSubmitInteraction | ChatInputCommandInteraction | MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction | PrimaryEntryPointCommandInteraction, eventName: string) => {
  if(eventName == null) {
    throw new BotException("Le nom de l'événement est obligatoire.");
  }

  const event = await eventService.findByName(eventName, interaction.user.id);
  await printEvent(interaction, event);
}

export const printEvent = async (interaction: ModalSubmitInteraction | ChatInputCommandInteraction | MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction | PrimaryEntryPointCommandInteraction, event: Event) => {
  const fields: { name: string, value: string, inline?: boolean }[] = [];
  if(event.location) {
    fields.push({ name: "Adresse", value: event.location, inline: true });
  }
  if(event.tricountUrl) {
    fields.push({ name: "Tricount", value: event.tricountUrl, inline: true });
  }

  const participantValue = event.participants.length == 0 ? "Aucun participant pour le moment." : event.participants.map(participant => `• ${participant.firstName} ${participant.lastName}`).join("\n");
  fields.push({ name: "Participants", value: participantValue });

  const todoValue = event.todoList.length == 0 ? "Rien à préparer pour le moment." : event.todoList.map(todo => `${todo.done ? "✅" : "❌"} ${todo.name} : ${todo.todoValue}`).join("\n");
  fields.push({ name: "À faire", value: todoValue });

  if(event.subEvents.length > 0) {
    fields.push({ name : "Programme", value: printSubEvents(event.subEvents) });
  }

  const embed = embedService.createEmbed(event.eventName, fields, eventUtils.getDateValue(event), `events/${event.id}`)

  await interaction.reply({embeds: [embed.embed], files: embed.attachments});
}

const printSubEvents = (subEvents: Event[]) => {
  return subEvents.map(evt => printSubEvent(evt)).join("\n\n");
}

const printSubEvent = (subEvent: Event) => {
  let value = `${subEvent.eventName} - ${eventUtils.getDateValue(subEvent)}`;
  value += "\n■ Participants :\n";
  value += subEvent.participants.length == 0 ? "Aucun participant pour le moment." : subEvent.participants.map(participant => `• ${participant.firstName} ${participant.lastName}`).join("\n");
  value += "\n■ À faire :\n";
  value += subEvent.todoList.length == 0 ? "Rien à préparer pour le moment." : subEvent.todoList.map(todo => `${todo.done ? "✅" : "❌"} ${todo.name} : ${todo.todoValue}`).join("\n");
  return value;
}