import { BotException } from '../../exception/bot-exception.js';
import { eventService } from '../../service/web-service/event-service.js';
import { eventUtils } from '../../utils/event-utils.js';
import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  ContainerBuilder,
  MessageContextMenuCommandInteraction, MessageFlags,
  ModalSubmitInteraction, PrimaryEntryPointCommandInteraction, SectionBuilder,
  SeparatorBuilder, TextDisplayBuilder, ThumbnailBuilder, UserContextMenuCommandInteraction
} from 'discord.js';
import { Event, SubEvent } from '../../api/event.js';
import { userUtils } from '../../utils/user-utils.js';
import { localFileService } from '../../service/local-file-service.js';
import { messageService } from '../../service/message-service.js';
import { dateUtils } from '../../utils/date-utils.js';
import { resourceService } from '../../service/resource-service.js';

export const findAndPrintEvent = async (interaction: ModalSubmitInteraction | ChatInputCommandInteraction | MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction | PrimaryEntryPointCommandInteraction, eventId: string) => {
  if(eventId == null) {
    throw new BotException("L'id de l'événement est obligatoire.");
  }

  const event = await eventService.findById(eventId, interaction.user.id);
  await printEvent(interaction, event);
}

export const printEvent = async (
  interaction: ModalSubmitInteraction
    | ChatInputCommandInteraction
    | MessageContextMenuCommandInteraction
    | UserContextMenuCommandInteraction
    | PrimaryEntryPointCommandInteraction,
  event: Event
) => {

  const participantValue = event.participants.length === 0 ? "Aucun participant pour le moment." : userUtils.getUserArrayString(event.participants);
  const todoValue = event.todoList.length === 0 ? "\tRien à préparer pour le moment." : event.todoList.map(todo => `${todo.done ? "✅" : "❌"} ${todo.name} : ${todo.todoValue}`).join("\n");
  const attachments: AttachmentBuilder[] = [];
  const fileName = `${event.id}.png`;
  const localFile = localFileService.getTempFile("images", fileName);

  if (localFile != null) {
    attachments.push(new AttachmentBuilder(localFile, { name: fileName }));
  } else {
    const eventImage = await eventService.getEvenFile(String(event.id), interaction.user.id);
    if (eventImage != null) {
      const eventFile = await localFileService.setTempFile("images", fileName, eventImage);

      attachments.push(new AttachmentBuilder(eventFile, { name: fileName }));
    } else {
      const defaultFile = resourceService.getImage("logo.png")!;
      attachments.push(new AttachmentBuilder(defaultFile, { name: fileName }));
    }
  }

  const container = new ContainerBuilder();

  const eventNameTextBuilder = new TextDisplayBuilder().setContent(`# ${event.eventName}`);
  const titleInfoTextBuilder = new TextDisplayBuilder().setContent(getTitleInfo(event));

  const titleInfo = new SectionBuilder().setThumbnailAccessory(new ThumbnailBuilder().setURL(`attachment://${ fileName }`));

  container.addSectionComponents(titleInfo);

  titleInfo.addTextDisplayComponents(eventNameTextBuilder);
  titleInfo.addTextDisplayComponents(titleInfoTextBuilder);

  container.addSeparatorComponents(new SeparatorBuilder());
  container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🧑‍🤝‍🧑 Participants\n\t${participantValue}`));
  container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 🗒️ À faire\n${todoValue}`));

  if (event.subEvents.length > 0) {
    container.addSeparatorComponents(new SeparatorBuilder());
    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`## 📓 Programme\n${printSubEvents(event.subEvents)}`));
  }

  await messageService.reply(interaction, { components: [container], files: attachments, flags: MessageFlags.IsComponentsV2 });
}

const getTitleInfo = (event: Event) => {
  let value = "";
  if(event.location) {
    value += "\n🗺️ **Adresse**\n" + handleMapLink(event.location);
  }
  value += "\n📆 **Date**";
  if(event.tricountUrl) {
    value += "                                💵 **Tricount**";
  }
  value += "\n" + dateUtils.toString(event.startDate);
  if(event.tricountUrl) {
    value += `              ${handleTricountLink(event.tricountUrl)}`;
  }
  if(event.endDate) {
    value += "\n" + dateUtils.toString(event.endDate);
  }
  return value;
}

const printSubEvents = (subEvents: SubEvent[]) => {
  return subEvents
    .sort((evt1, evt2) => evt1.startDate.getTime() - evt2.startDate.getTime())
    .map(evt => printSubEvent(evt))
    .join("\n");
}

const printSubEvent = (subEvent: SubEvent) => {
  let value = `### ${subEvent.eventName}`;
  if(subEvent.location) {
    value += "\n\t🗺️\t" + handleMapLink(subEvent.location);
  }
  value += "\n\t📆\t" + eventUtils.getDateValue(subEvent);

  const participantIds = subEvent.participants.map(p => p.id);
  const parentEvent = subEvent.parentEvent;
  const hasAll = parentEvent.participants
    .map(participant => participant.id)
    .map(participant => participantIds.includes(participant))
    .reduce((oldV, newV) => oldV && newV, true);
  if(!hasAll) {
    value += "\n\t";
    if(subEvent.participants.length == 0) {
      value += "🔺 Aucun participant 🔺";
    } else {
      value += "🧑‍🤝‍🧑\t" + userUtils.getUserArrayString(subEvent.participants);
    }
  } else {
    value += "\n\t🧑‍🤝‍🧑\tTout le monde";
  }
  if(subEvent.todoList.length != 0) {
    value += "\n" + subEvent.todoList.map(todo => `${todo.done ? "✅" : "❌"} ${todo.name} : ${todo.todoValue}`).join("\n");
  }
  return value;
}

const handleMapLink = (value: string)=> {
  return handleLink(value, `https://maps.google.com/?q=${value}`);
}

const handleTricountLink = (value: string) => {
  return handleLink("tricount.com", `https://tricount.com/fr-fr/${value.substring(value.lastIndexOf("/" + 1, value.length))}`);
}

const handleLink = (value: string, link: string) => {
  return `[${value}](${link.replaceAll(" ", "%20")})`;
}