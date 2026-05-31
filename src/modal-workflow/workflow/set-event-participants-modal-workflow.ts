import { ModalSubmitInteraction } from 'discord.js';
import { ModalWorkflow } from '../modal-workflow.js';
import { registerModal } from '../../handler/modal-handler.js';
import { MODALS } from '../modal-workflow-id.js';
import { BotException } from '../../exception/bot-exception.js';
import { eventService } from '../../service/web-service/event-service/event-service.js';

@registerModal(MODALS.addEventParticipant.id)
export class CreateEventModalWorkflow extends ModalWorkflow {

  async run(interaction:  ModalSubmitInteraction): Promise<void> {
    const fields = interaction.fields;

    const eventId: string | undefined = fields.getStringSelectValues(MODALS.addEventParticipant.eventId)[0];
    const participants = fields.getStringSelectValues(MODALS.addEventParticipant.participants);

    if(eventId == null) {
      throw new BotException('Le nom de l\'événement est obligatoire.');
    }

    const todoResult = await eventService.setEventParticipant(eventId, [...participants], interaction.user.id);

    await interaction.reply({ content: `Les participants ont bien été modifiés.`})
  }
}