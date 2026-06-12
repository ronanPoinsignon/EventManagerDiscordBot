import { REST, Routes } from 'discord.js';
import { configuration } from './configuration.js';
import { commandUtils } from './utils/command-utils.js';
import { loggerService } from './service/log-service.js';

const commands = await commandUtils.getCommandList();
const jsonCommands = commands.map(command => command.data.toJSON());
const rest = new REST().setToken(configuration.token);

loggerService.info(`Started refreshing ${commands.length} application (/) commands.`);

try {
  const data = await rest.put(Routes.applicationCommands(configuration.discordClientId), { body: jsonCommands });
  // @ts-ignore
  loggerService.info(`Successfully reloaded ${ data.length } application (/) commands.`);
} catch (e) {
  loggerService.error(e);
}

