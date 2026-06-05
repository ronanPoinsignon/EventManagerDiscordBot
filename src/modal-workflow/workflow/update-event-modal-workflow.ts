import { ModalSubmitInteraction } from 'discord.js';
import { ModalWorkflow } from '../modal-workflow.js';
import { registerModal } from '../../handler/modal-handler.js';
import { MODALS } from '../modal-workflow-id.js';
import { BotException } from '../../exception/bot-exception.js';
import { replyService } from '../../utils/reply-service.js';
import { eventService } from '../../service/web-service/event-service.js';
import { embedUtils } from '../../utils/embed-utils.js';

@registerModal(MODALS.updateEventName.id)
export class UpdateEventModalWorkflow extends ModalWorkflow {

  async run(interaction:  ModalSubmitInteraction): Promise<void> {
    const fields = interaction.fields;

    const eventId: string | undefined = fields.getStringSelectValues(MODALS.updateEventName.eventId)[0];
    const newEventName: string | undefined = fields.getTextInputValue(MODALS.updateEventName.newEventName);

    if (eventId == null) {
      throw new BotException('Le nom de l\'événement est obligatoire.');
    }
    if (newEventName == null) {
      throw new BotException('Le nouveau nom de l\'événement est obligatoire.');
    }

    const event = await eventService.findById(eventId, interaction.user.id);
    const oldName = event.eventName;
    event.eventName = newEventName;
    await eventService.save(event, interaction.user.id);

    const embed = embedUtils.validationEmbed("Modification d'événement", [], `L'événement ${ oldName } a bien été modifié en ${ event.eventName }.`);
    await replyService.replyEmbed(interaction, { embed: [ embed.embed ], attachment: embed.attachments });
  }
}