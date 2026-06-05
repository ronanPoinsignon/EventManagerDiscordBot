import { resourceService } from '../service/resource-service.js';
import { AttachmentBuilder } from 'discord.js';
import { configuration } from '../configuration.js';
import { dateUtils } from './date-utils.js';

class EmbedUtils {

  private logoName = "logo.png";
  private logoPath = resourceService.getImage(this.logoName);
  private logo = new AttachmentBuilder(this.logoPath!, { name: this.logoName });

  getLogoAttachment() {
    return this.logo;
  }

  private createEmbed(title: string, fields: { name: string, value: string, inline?: boolean }[], color: number = 0x0099ff, description?: string, urlPage?: string) {
    const embed = {
      color: color,
      title: title,
      author: {
        name: 'Event Organizer',
        icon_url: 'attachment://' + this.logoName,
        url: configuration.frontEndUrl,
      },
      description: description,
      thumbnail: {
        url: 'attachment://' + this.logoName,
      },
      fields: fields,
      timestamp: dateUtils.now().toISOString()
    };

    const attachments = [ this.getLogoAttachment() ];

    return {
      embed,
      attachments
    }
  }

  validationEmbed(title: string, fields: { name: string, value: string, inline?: boolean }[], description?: string, urlPage?: string) {
    return this.createEmbed(title, fields, 0x00B10B, description, urlPage);
  }

  informationEmbed(title: string, fields: { name: string, value: string, inline?: boolean }[], description?: string, urlPage?: string) {
    return this.createEmbed(title, fields, 0x0099ff, description, urlPage);
  }

  errorEmbed(title: string, fields: { name: string, value: string, inline?: boolean }[], description?: string, urlPage?: string) {
    return this.createEmbed(title, fields, 0xED0004, description, urlPage);
  }

}

export const embedUtils = new EmbedUtils();