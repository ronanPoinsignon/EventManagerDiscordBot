import { Command } from '../command/command.js';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import { fileURLToPath } from 'url';
import { HelpCommand } from '../command/commands/help.js';
import { loggerService } from '../service/log-service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CommandUtils {

  static readonly folderPath = path.join(__dirname, '../command/commands');
  static readonly commandFolder = fs.readdirSync(CommandUtils.folderPath);

  private commandPromise = this.getCommandListInternal();

  async getCommandList() {
    return await this.commandPromise;
  }

  async getCommandMap() {
    const commandList = await this.getCommandList();
    return new Map(commandList.map(command => [ command.data.name, command ]));
  }

  private async getCommandListInternal() {
    const commands: Command[] = [];
    let helpCommand: HelpCommand;
    for (const file of CommandUtils.commandFolder) {
      const filePath = path.join(CommandUtils.folderPath, file);
      const commandModule = await import(pathToFileURL(filePath).href);
      const command = commandModule.command;
      if(isHelpCommand(command)) {
        helpCommand = command;
      }

      if (command.data != null && command.execute != null) {
        commands.push(command);
      } else {
       throw new Error(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
      }
    }

    helpCommand!.setCommandList(commands.sort((c1, c2) => c1.data.name.localeCompare(c2.data.name)));

    loggerService.info(`Loaded ${commands.length} commands.`);

    return commands;
  }

}

function isHelpCommand(command: Command): command is HelpCommand {
  return command.data.name == "help";
}

export const commandUtils = new CommandUtils();