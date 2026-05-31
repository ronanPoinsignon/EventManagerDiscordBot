import { ModalSubmitInteraction } from 'discord.js';
import { ModalWorkflow } from '../modal-workflow.js';
import { registerModal } from '../../handler/modal-handler.js';
import { MODALS } from '../modal-workflow-id.js';
import { BotException } from '../../exception/bot-exception.js';
import { eventService } from '../../service/web-service/event-service/event-service.js';
import { printEvent } from '../../command/actions/get-event.js';

@registerModal(MODALS.deleteEvent.id)
export class CreateEventModalWorkflow extends ModalWorkflow {

  async run(interaction:  ModalSubmitInteraction): Promise<void> {
    const fields = interaction.fields;

    const eventId: string | undefined = fields.getStringSelectValues(MODALS.deleteEvent.eventId)[0];

    if(eventId == null) {
      throw new BotException('Le nom de l\'événement est obligatoire.');
    }

    const todoResult = await eventService.deleteEvent(eventId, interaction.user.id);

    await printEvent(interaction, todoResult)
  }
}