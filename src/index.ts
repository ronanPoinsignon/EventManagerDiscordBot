import { ChatInputCommandInteraction, Events, GatewayIntentBits, ModalSubmitInteraction } from 'discord.js';
import { BotClient } from './botClient.js';
import { configuration } from './configuration.js';
import { modalHandler } from './handler/modal-handler.js';
import { messageHandler } from './handler/message-handler.js';
import { interactionHandler } from './handler/interaction-handler.js';
import { commandUtils } from './utils/command-utils.js';
import { messageService } from './utils/message-service.js';
import { embedUtils } from './utils/embed-utils.js';
import { rabbitListenerService } from './service/rabbit/rabbit-listener-service.js';
import { RabbitListener } from './service/rabbit/rabbit-listener.js';
import { EventNotificationMessage } from './service/rabbit/message/EventNotificationMessage.js';
import { DiscordClientRabbitListener } from './service/rabbit/DiscordClientRabbitListener.js';
import { loggerService } from './service/log-service.js';

const client = new BotClient({ intents: [ GatewayIntentBits.Guilds ] });

client.once(Events.ClientReady, (readyClient) => {
	loggerService.info(`Ready! Logged in as ${ readyClient.user.tag }`);

	rabbitListenerService.addListener(new DiscordClientRabbitListener(client));

	rabbitListenerService.startListening();
});

const commands = await commandUtils.getCommandList();
commands.forEach(command => client.commands.set(command.data.name, command));

client.on(Events.InteractionCreate, async (interaction) => {
	try {
		if (interaction.isChatInputCommand()) {
			return await messageHandler.handle(client, interaction);
		}
		if (interaction.isModalSubmit()) {
			return await modalHandler.handle(interaction);
		}
		if (interaction.isAutocomplete()) {
			try {
				return await interactionHandler.handle(interaction);
			} catch (e) {
				loggerService.error('erreur autocomplete : ', e);
			}
		}
	} catch (error) {
		if (!(error instanceof Error)) {
			const embed = embedUtils.errorEmbed('Erreur inconnue', [], 'Une erreur inconnue est survenue.');
			await messageService.replyEmbed(interaction as ChatInputCommandInteraction | ModalSubmitInteraction, {
				embed: [ embed.embed ],
				attachment: embed.attachments
			});
			return;
		}

		const embed = embedUtils.errorEmbed('Erreur', [], error.message);
		await messageService.replyEmbed(interaction as ChatInputCommandInteraction | ModalSubmitInteraction, {
			embed: [ embed.embed ],
			attachment: embed.attachments
		});
	}
});

await client.login(configuration.token);