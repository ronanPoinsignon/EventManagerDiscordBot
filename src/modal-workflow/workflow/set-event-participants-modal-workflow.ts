import { ModalSubmitInteraction } from 'discord.js';
import { ModalWorkflow } from '../modal-workflow.js';
import { registerModal } from '../../handler/modal-handler.js';
import { MODALS } from '../modal-workflow-id.js';
import { BotException } from '../../exception/bot-exception.js';
import { eventService } from '../../service/web-service/event-service.js';
import { messageService } from '../../utils/message-service.js';
import { embedUtils } from '../../utils/embed-utils.js';

@registerModal(MODALS.addEventParticipant.id)
export class SetEventParticipantsModalWorkflow extends ModalWorkflow {

  async run(interaction:  ModalSubmitInteraction): Promise<void> {
    const fields = interaction.fields;

    const eventId: string | undefined = fields.getStringSelectValues(MODALS.addEventParticipant.eventId)[0];
    const participants = fields.getStringSelectValues(MODALS.addEventParticipant.participants);

    if(eventId == null) {
      throw new BotException('Le nom de l\'événement est obligatoire.');
    }

    const todoResult = await eventService.setEventParticipant(eventId, [...participants], interaction.user.id);

    const embed = embedUtils.validationEmbed("Modification des participants", [], `Les participants ont bien été modifiés.`);
    await messageService.replyEmbed(interaction, { embed: [ embed.embed ], attachment: embed.attachments });
  }
}