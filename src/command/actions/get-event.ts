import { BotException } from '../../exception/bot-exception.js';
import { eventService } from '../../service/web-service/event-service.js';
import { embedUtils } from '../../utils/embed-utils.js';
import { eventUtils } from '../../utils/event-utils.js';
import {
  AttachmentBuilder,
  ChatInputCommandInteraction, InteractionEditReplyOptions, InteractionReplyOptions,
  MessageContextMenuCommandInteraction, MessagePayload,
  ModalSubmitInteraction, PrimaryEntryPointCommandInteraction, UserContextMenuCommandInteraction
} from 'discord.js';
import { Event, SubEvent } from '../../api/event.js';
import { userUtils } from '../../utils/user-utils.js';
import { localFileService } from '../../service/local-file-service.js';
import { replyService } from '../../utils/reply-service.js';

export const findAndPrintEvent = async (interaction: ModalSubmitInteraction | ChatInputCommandInteraction | MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction | PrimaryEntryPointCommandInteraction, eventId: string) => {
  if(eventId == null) {
    throw new BotException("L'id de l'événement est obligatoire.");
  }

  const event = await eventService.findById(eventId, interaction.user.id);
  await printEvent(interaction, event);
}

export const printEvent = async (interaction: ModalSubmitInteraction | ChatInputCommandInteraction | MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction | PrimaryEntryPointCommandInteraction, event: Event) => {
  const fields: { name: string, value: string, inline?: boolean }[] = [];
  if(event.location) {
    fields.push({ name: "🗺️ Adresse", value: event.location, inline: true });
  }
  if(event.tricountUrl) {
    fields.push({ name: "💵 Tricount", value: event.tricountUrl, inline: true });
  }

  const participantValue = event.participants.length == 0 ? "Aucun participant pour le moment." : userUtils.getUserArrayString(event.participants);
  fields.push({ name: "🧑‍🤝‍🧑 Participants", value: participantValue });

  const todoValue = event.todoList.length == 0 ? "Rien à préparer pour le moment." : event.todoList.map(todo => `${todo.done ? "✅" : "❌"} ${todo.name} : ${todo.todoValue}`).join("\n");
  fields.push({ name: "🗒️ À faire", value: todoValue });

  if(event.subEvents.length > 0) {
    fields.push({ name : "📓 Programme", value: printSubEvents(event.subEvents) });
  }

  const embed = embedUtils.createEmbed(event.eventName, fields, eventUtils.getDateValue(event), `events/${event.id}`);
  const fileName = event.id + ".png";
  const localFile = localFileService.getTempFile("images", fileName);
  if(localFile != null) {
    embed.embed.thumbnail.url = "attachment://" + fileName;
    embed.attachments.push(new AttachmentBuilder(localFile, { name: fileName }));
  } else {
    const eventImage = await eventService.getEvenFile(event.id + "", interaction.user.id);
    if(eventImage != null) {
      const eventFile = await localFileService.setTempFile("images", fileName, eventImage);
      embed.embed.thumbnail.url = "attachment://" + fileName;
      embed.attachments.push(new AttachmentBuilder(eventFile, { name: fileName }));
    }
  }

  await replyService.reply(interaction, {embeds: [embed.embed], files: embed.attachments});
}

const printSubEvents = (subEvents: SubEvent[]) => {
  return subEvents
    .sort((evt1, evt2) => evt1.startDate.getTime() - evt2.startDate.getTime())
    .map(evt => printSubEvent(evt))
    .join("\n\n");
}

const printSubEvent = (subEvent: SubEvent) => {
  let value = `📔 ${subEvent.eventName} | ${eventUtils.getDateValue(subEvent)}`;
  if(subEvent.location) {
    value += "\n" + subEvent.location;
  }
  value += "\n";
  const participantIds = subEvent.participants.map(p => p.id);
  const parentEvent = subEvent.parentEvent;
  const hasAll = parentEvent.participants
    .map(participant => participant.id)
    .map(participant => participantIds.includes(participant))
    .reduce((oldV, newV) => oldV && newV, true);
  if(hasAll) {
    // value += "Tout le monde"
  } else {
    if(subEvent.participants.length == 0) {
      value += "🔺 Aucun participant 🔺";
    } else {
      value += userUtils.getUserArrayString(subEvent.participants);
    }
  }
  if(subEvent.todoList.length != 0) {
    value += subEvent.todoList.map(todo => `${todo.done ? "✅" : "❌"} ${todo.name} : ${todo.todoValue}`).join("\n");
  }
  return value;
}