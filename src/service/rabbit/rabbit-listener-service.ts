import amqp from "amqplib";
import { configuration } from '../../configuration.js';
import { RabbitListener } from './rabbit-listener.js';
import { EventNotificationMessage } from './message/EventNotificationMessage.js';
import { loggerService } from '../log-service.js';

class RabbitListenerService {

  private listeners: RabbitListener[] = [];
  private isListening: boolean = false;

  constructor() {

  }

  startListening() {
    if(this.isListening) {
      return;
    }

    this.startConsumer();
  }

  private async startConsumer() {
    loggerService.info("Waiting for connection to rabbit");
    let connection = null;
    while(connection == null) {
      try {
        connection = await amqp.connect(configuration.rabbitURL);
      } catch (e) {
        if(!(e instanceof Error)) {
          throw e;
        }

        // @ts-ignore
        if(e.code == "ENOTFOUND" || e.code == "ECONNREFUSED") {
        } else {
          loggerService.error(e);
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    loggerService.info("Connected to rabbit");
    const channel = await connection.createChannel();

    const queue = "discord.notifications";

    await channel.assertQueue(queue, {
      durable: true,
    });

    channel.consume(queue, async (msg) => {
      if (!msg) return;

      try {
        const content = msg.content.toString();
        const message: EventNotificationMessage = JSON.parse(content);

        this.listeners.forEach(listener => listener.onEventMessage(message));

        channel.ack(msg);
      } catch (err) {
        loggerService.error("Erreur traitement message", err);

        channel.nack(msg, false, false);
      }
    });
  }

  addListener(listener: RabbitListener) {
    this.listeners.push(listener);
  }

}

export const rabbitListenerService = new RabbitListenerService();