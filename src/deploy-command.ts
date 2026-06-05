import { REST, Routes } from 'discord.js';
import { configuration } from './configuration.js';
import { commandUtils } from './utils/command-utils.js';

const commands = await commandUtils.getCommandList();
const jsonCommands = commands.map(command => command.data.toJSON());
const rest = new REST().setToken(configuration.token);

console.log(`Started refreshing ${commands.length} application (/) commands.`);

try {
  const data = await rest.put(Routes.applicationCommands(configuration.discordClientId), { body: jsonCommands });
  // @ts-ignore
  console.log(`Successfully reloaded ${ data.length } application (/) commands.`);
} catch (e) {
  console.error(e);
}

