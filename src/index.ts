import { Events, GatewayIntentBits } from 'discord.js';
import { BotClient } from './botClient.js';
import { configuration } from './configuration.js';
import { modalHandler } from './handler/modal-handler.js';
import { messageHandler } from './handler/message-handler.js';
import { interactionHandler } from './handler/interaction-handler.js';
import { commandUtils } from './utils/command-utils.js';

const client = new BotClient({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
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
		if(interaction.isAutocomplete()) {
			return await interactionHandler.handle(interaction);
		}
	} catch(error) {
		console.error(error);
	}
});

client.login(configuration.token);