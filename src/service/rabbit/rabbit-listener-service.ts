import amqp, { Channel, ChannelModel } from 'amqplib';
import { configuration } from '../../configuration.js';
import { RabbitListener } from './rabbit-listener.js';
import { EventNotificationMessage } from './message/EventNotificationMessage.js';
import { loggerService } from '../log-service.js';

class RabbitListenerService {

  private listeners: RabbitListener[] = [];
  private isListening: boolean = false;
  private isReconnecting: boolean = false;

  private connection?: ChannelModel;
  private channel?: Channel;

  startListening() {
    if(this.isListening) {
      return;
    }

    this.isListening = true
    this.startConsumer();
  }

  private async connect() {
    if(this.isReconnecting) {
      return;
    }

    this.isReconnecting = true;

    try {
      while(this.connection == null) {
        try {
          this.connection = await amqp.connect(configuration.rabbitURL);
        } catch (e) {
          if(!(e instanceof Error)) {
            throw e;
          }

          const ignoredMessages = [
            "Socket closed abruptly during opening handshake"
          ];
          const ignoredCodes = [
            "ENOTFOUND",
            "ECONNREFUSED",
            "ECONNRESET"
          ];

          // @ts-ignore
          if(ignoredCodes.indexOf(e.code) >= 0 || ignoredMessages.indexOf(e.message) >= 0) {
          } else {
            loggerService.error(e);
          }
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }

      loggerService.info("Connected to rabbit");

      this.connection.on("close", () => {
        loggerService.info("Connection closed. Waiting for reconnection");
        this.channel?.removeAllListeners();
        this.connection?.removeAllListeners();
        this.channel = undefined;
        this.connection = undefined;

        if (!this.isReconnecting) {
          void this.connect();
        }
      });
      this.connection.on("error", (err: Error) => {
        loggerService.error(err);
      });
      await this.manageChannel(this.connection);
    } finally {
      this.isReconnecting = false;
    }
  }

  private async startConsumer() {
    loggerService.info("Waiting for connection to rabbit");
    await this.connect();
  }

  private async manageChannel(connection: ChannelModel) {
    this.channel = await connection.createChannel();

    const queue = "discord.notifications";

    await this.channel.assertQueue(queue, {
      durable: true,
    });

    // scope local du channel pour éviter les changements de channel après une possible reconnexion
    const channel = this.channel;
    await channel.consume(queue, async (msg) => {
      if (!msg) return;

      try {
        const content = msg.content.toString();
        const message: EventNotificationMessage = JSON.parse(content);

        await Promise.all(this.listeners.map( listener => listener.onEventMessage(message)));

        try {
          channel.ack(msg);
        } catch {}
      } catch (err) {
        loggerService.error("Erreur traitement message", err);

        try {
          channel.nack(msg, false, false);
        } catch {}
      }
    });
  }

  addListener(listener: RabbitListener) {
    this.listeners.push(listener);
  }

}

export const rabbitListenerService = new RabbitListenerService();