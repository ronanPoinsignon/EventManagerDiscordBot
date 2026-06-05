import { resourceService } from '../service/resource-service.js';
import { AttachmentBuilder } from 'discord.js';
import { configuration } from '../configuration.js';
import { dateUtils } from './date-utils.js';

class EmbedUtils {

  private logoName = "logo.png";
  private greenCheckName = "green-check.png";
  private informationName = "information.png";
  private redCrossName = "red-cross.png";

  getLogoAttachment() {
    return getAttachment(this.logoName);
  }

  getGreenCheckAttachment() {
    return getAttachment(this.greenCheckName);
  }

  getInformationAttachment() {
    return getAttachment(this.informationName);
  }

  getRedCrossAttachment() {
    return getAttachment(this.redCrossName);
  }

  private createEmbed(title: string, fields: { name: string, value: string, inline?: boolean }[], thumbnailImage: AttachmentBuilder, color: number = 0x0099ff, description?: string, urlPage?: string) {
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
        url: 'attachment://' + thumbnailImage.name,
      },
      fields: fields,
      timestamp: dateUtils.now().toISOString()
    };

    const attachments = [ this.getLogoAttachment(), thumbnailImage ];

    return {
      embed,
      attachments
    }
  }

  validationEmbed(title: string, fields: { name: string, value: string, inline?: boolean }[], description?: string, urlPage?: string) {
    return this.createEmbed(title, fields, this.getGreenCheckAttachment(), 0x00B10B, description, urlPage);
  }

  informationEmbed(title: string, fields: { name: string, value: string, inline?: boolean }[], description?: string, urlPage?: string) {
    return this.createEmbed(title, fields, this.getInformationAttachment(), 0x0099ff, description, urlPage);
  }

  errorEmbed(title: string, fields: { name: string, value: string, inline?: boolean }[], description?: string, urlPage?: string) {
    return this.createEmbed(title, fields, this.getRedCrossAttachment(), 0xED0004, description, urlPage);
  }

}

const getAttachment = (name: string) => {
  const logoPath = resourceService.getImage(name);
  return new AttachmentBuilder(logoPath!, { name: name });
}

export const embedUtils = new EmbedUtils();