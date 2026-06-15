import { RabbitListener } from './rabbit-listener.js';
import { EventNotificationMessage } from './message/EventNotificationMessage.js';
import { notificationService } from '../web-service/notification-service.js';
import { notify } from '../../command/actions/notify-event.js';
import { Event } from '../../api/event.js';
import { loggerService } from '../log-service.js';
import { Client } from 'discord.js';

export class DiscordClientRabbitListener implements RabbitListener {

  constructor(private client: Client) {
  }

  async onEventMessage(message: EventNotificationMessage) {
    try {
      const notification = await notificationService.findById<Event>(message.id, null);
      await notify(this.client, notification);
    } catch (e) {
      loggerService.error(e);
    }
  }

}