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

  createEmbed(title: string, fields: { name: string, value: string, inline?: boolean }[], description?: string, urlPage?: string) {
    const embed = {
      color: 0x0099ff,
      title: title,
      url: configuration.frontEndUrl + (urlPage != null ? urlPage : ''),
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

}

export const embedUtils = new EmbedUtils();