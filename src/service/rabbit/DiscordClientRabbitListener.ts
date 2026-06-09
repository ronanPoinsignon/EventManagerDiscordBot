import { RabbitListener } from './rabbit-listener.js';
import { EventNotificationMessage } from './message/EventNotificationMessage.js';
import { notificationService } from '../web-service/notification-service.js';

export class DiscordClientRabbitListener implements RabbitListener {

  async onEventMessage(message: EventNotificationMessage) {
    try {
      const notification = await notificationService.findById(message.id, null);
      console.log(notification)
    } catch (e) {
      console.error(e);
    }

  }

}