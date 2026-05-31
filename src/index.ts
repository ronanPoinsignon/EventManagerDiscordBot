import { Events, GatewayIntentBits } from 'discord.js';
import path from 'node:path';
import * as fs from 'node:fs';

import { fileURLToPath } from 'url';
import { BotClient } from './botClient.js';
import { pathToFileURL } from 'node:url';
import { configuration } from './configuration.js';
import { modalHandler } from './handler/modal-handler.js';
import { messageHandler } from './handler/message-handler.js';
import { interactionHandler } from './handler/interaction-handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new BotClient({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

const foldersPath = path.join(__dirname, 'command/commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const file of commandFolders) {
	const filePath = path.join(foldersPath, file);
	const commandModule = await import(pathToFileURL(filePath).href);
	const command = commandModule.default;
	if (command.data != null && command.execute != null) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
	}
}

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