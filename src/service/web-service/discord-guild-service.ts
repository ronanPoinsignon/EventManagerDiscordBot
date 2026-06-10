import { WebService } from './web-service.js';
import { Guild } from '../../api/guild.js';
import { ValueBasedResponse } from '../../api/value-based.js';

class DiscordGuildService extends WebService {

  private static discordGuildsUrl: string = "/discordGuilds"

  private getRoute(route: string): string {
    return DiscordGuildService.discordGuildsUrl + route;
  }

  async setDiscordGuildMessageChannel(guildId: string, messageChannelId: string, userId: string): Promise<Guild> {
    const route = this.getRoute("/setCommunicationChannel")
    return this.post(route, userId, { "guildId": guildId, "channelId": messageChannelId });
  }

  async findCommunicationChannelFromGuildId(guildId: string, userId: string | null): Promise<ValueBasedResponse<string>> {
    const route = this.getRoute("/getCommunicationChannel")
    return await this.get<ValueBasedResponse<string>>(route, userId, { "guildId": guildId });
  }

}

export const discordGuildService = new DiscordGuildService();