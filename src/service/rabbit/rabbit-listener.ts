import { EventNotificationMessage } from './message/EventNotificationMessage.js';

export interface RabbitListener {

  onEventMessage(message: EventNotificationMessage): void;

}