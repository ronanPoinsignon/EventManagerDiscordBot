import { Event } from '../../api/event.js';
import { BotClient } from '../../botClient.js';
import { discordGuildService } from '../../service/web-service/discord-guild-service.js';
import { Notification } from '../../api/notification.js';
import { userService } from '../../service/web-service/user-service.js';
import { User } from '../../api/user.js';

export const notify = async (client: BotClient, eventNotification: Notification<Event>)=> {
  const event = eventNotification.entity;
  const guilds = event.guildIds;
  if(guilds.length == 0){
    return;
  }

  const notifiedUsers = eventNotification.users;
  if(notifiedUsers.length == 0){
    return;
  }

  const participantIdMap = new Map(event.participants.map(user => [user.id, user]));
  const notifiedUserInEvent = notifiedUsers.reduce((oldValue, user, value) => { return oldValue && participantIdMap.has(user.id)}, true);

  let notifiedParticipants: User[] = [];
  if(notifiedUserInEvent) {
    notifiedParticipants = notifiedUsers.map(user => participantIdMap.get(user.id)!);
  } else {
    notifiedParticipants = await userService.findByUserIds(notifiedUsers.map(user => user.id), null);
  }

  notifiedParticipants = notifiedParticipants.filter(user => user.discordId != null);

  const promiseMap = guilds.map(async guildId => ({"guildId": guildId, "channelId": await discordGuildService.findCommunicationChannelFromGuildId(guildId, null).then(value => value.value)}));
  const channelsMap = (await Promise.all(promiseMap)).filter(map => map.channelId != null);
  const todoNotDone = event.todoList.filter(todo => !todo.done);

  if(channelsMap.length == 0){
    return;
  }

  const textMentions = notifiedParticipants.map(user => `<@${user.discordId}>`).join(" ");
  const textDateInformation = `L'événement ${event.eventName} est prévu pour le <t:${event.startDate.getTime()}:s>.`

  let message = textMentions + "\n" + textDateInformation;
  if(todoNotDone.length > 0) {
    let todo = `Il reste ${todoNotDone.length} élément${todoNotDone.length > 1 ? 's' : ''} à faire :\n`;
    todo += "- " + todoNotDone.map(todo => todo.name).join("\- ");
    message += "\n" + todo;
  }

  for(const channelMap of channelsMap) {
    const guildId = channelMap.guildId;
    const channelId = channelMap.channelId;
    const chanel = client.guilds.cache.find(guild => guild.id == guildId)?.channels.cache.find(chanel => chanel.id == channelId);
    if(chanel == null) {
      console.error(`Le channel ${channelId} n'existe plus.`);
      return;
    }

    if(!chanel.isSendable()) {
      return;
    }

    chanel.send(message).catch(err => console.error(err));
  }

}