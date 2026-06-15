import { ChatInputCommandInteraction, GuildMember, APIInteractionGuildMember, PermissionsBitField } from 'discord.js';
import { exceptionHandler } from './exception-handler.js';
import { loggerService } from '../service/log-service.js';
import { commandUtils } from '../utils/command-utils.js';
import { AbstractChatInteractionHandler } from './abstract-chat-interaction-handler.js';
import { Command } from '../command/command.js';
import { messageService } from '../utils/message-service.js';

let commandMap = new Map<string, Command>();
commandUtils.getCommandMap().then(map => {
  commandMap = map;
});

class MessageHandler extends AbstractChatInteractionHandler<ChatInputCommandInteraction> {

  async handleInternal(interaction: ChatInputCommandInteraction) {
    const command = commandMap.get(interaction.commandName);

    if (!command) {
      loggerService.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    if(!this.checkPermissions(interaction.member!, command.permissions)) {
      await messageService.reply(interaction, "Vous n'avez pas les permissions nécessaires pour effectuer cette action.");
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error: any) {
      await exceptionHandler.handle(interaction, error);
    }
  }

  private checkPermissions(guildMember: GuildMember | APIInteractionGuildMember, permissions: bigint[] = []) {
    if(permissions.length == 0) {
      return true;
    }

    const userPermissions = guildMember.permissions as Readonly<PermissionsBitField>;

    for(const permission of permissions) {
      if(!userPermissions.has(permission)) {
        return false;
      }
    }

    return true;
  }

}

export const messageHandler = new MessageHandler();