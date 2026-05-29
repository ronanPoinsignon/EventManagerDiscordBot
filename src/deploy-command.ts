import { REST, Routes } from 'discord.js';
// @ts-ignore
import { RESTPostAPIChatInputApplicationCommandsJSONBody } from "@discordjs/builders"
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import { pathToFileURL } from 'node:url';

import { Command } from './command/command.js';
import { configuration } from './configuration.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const foldersPath = path.join(__dirname, 'command/commands');
const commandFolders = fs.readdirSync(foldersPath);

const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

for (const file of commandFolders) {
  const filePath = path.join(foldersPath, file);
  const commandModule = await import(pathToFileURL(filePath).href);
  const command: Command = commandModule.default;
  if (command.data != null && command.execute != null) {
    commands.push(command.data.toJSON());
  } else {
    console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
  }
}

const rest = new REST().setToken(configuration.token);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    const data = await rest.put(Routes.applicationCommands(configuration.discordClientId), { body: commands });

    // @ts-ignore
    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();