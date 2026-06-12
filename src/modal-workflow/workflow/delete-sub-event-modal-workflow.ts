import { ModalSubmitInteraction } from 'discord.js';
import { ModalWorkflow } from '../modal-workflow.js';
import { registerModal } from '../../handler/modal-handler.js';
import { MODALS } from '../modal-workflow-id.js';
import { BotException } from '../../exception/bot-exception.js';
import { eventService } from '../../service/web-service/event-service.js';
import { messageService } from '../../utils/message-service.js';
import { embedUtils } from '../../utils/embed-utils.js';

@registerModal(MODALS.deleteSubEvent.id)
export class DeleteSubEventModalWorkflow extends ModalWorkflow {

  async run(interaction:  ModalSubmitInteraction): Promise<void> {
    const fields = interaction.fields;

    const eventId: string | undefined = fields.getStringSelectValues(MODALS.deleteSubEvent.eventId)[0];

    if(eventId == null) {
      throw new BotException('Le nom du programme est obligatoire.');
    }

    const result = await eventService.deleteEvent(eventId, interaction.user.id);

    const embed = embedUtils.validationEmbed("Suppression de programme", [], `Le programme ${result.eventName} a bien été supprimé.`);
    await messageService.replyEmbed(interaction, { embed: [ embed.embed ], attachment: embed.attachments });
  }
}