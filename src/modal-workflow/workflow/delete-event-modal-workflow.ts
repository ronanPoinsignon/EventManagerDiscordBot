import { ModalSubmitInteraction } from 'discord.js';
import { ModalWorkflow } from '../modal-workflow.js';
import { registerModal } from '../../handler/modal-handler.js';
import { MODALS } from '../modal-workflow-id.js';
import { BotException } from '../../exception/bot-exception.js';
import { eventService } from '../../service/web-service/event-service.js';
import { replyService } from '../../utils/reply-service.js';
import { embedUtils } from '../../utils/embed-utils.js';

@registerModal(MODALS.deleteEvent.id)
export class DeleteEventModalWorkflow extends ModalWorkflow {

  async run(interaction:  ModalSubmitInteraction): Promise<void> {
    const fields = interaction.fields;

    const eventId: string | undefined = fields.getStringSelectValues(MODALS.deleteEvent.eventId)[0];

    if(eventId == null) {
      throw new BotException('Le nom de l\'événement est obligatoire.');
    }

    const deletedEvent = await eventService.deleteEvent(eventId, interaction.user.id);

    const embed = embedUtils.validationEmbed("Suppression d'événement", [], `L'événement ${deletedEvent.eventName} a bien été supprimé.`);
    await replyService.replyEmbed(interaction, { embed: [ embed.embed ], attachment: embed.attachments });
  }
}