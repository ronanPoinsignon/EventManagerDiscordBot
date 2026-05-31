import { ModalSubmitInteraction } from 'discord.js';
import { ModalWorkflow } from '../modal-workflow.js';
import { registerModal } from '../../handler/modal-handler.js';
import { MODALS } from '../modal-workflow-id.js';
import { BotException } from '../../exception/bot-exception.js';
import { eventService } from '../../service/web-service/event-service/event-service.js';
import { Event } from '../../api/event.js';
import { dateService } from '../../service/date-service.js';
import { printEvent } from '../../command/actions/get-event.js';

@registerModal(MODALS.createSubEvent.id)
export class CreateEventModalWorkflow extends ModalWorkflow {

  async run(interaction:  ModalSubmitInteraction): Promise<void> {
    const fields = interaction.fields;

    const eventId = fields.getStringSelectValues(MODALS.createSubEvent.eventNameId)[0];
    const subEventName = fields.getTextInputValue(MODALS.createSubEvent.subEventNameId);
    const startDate = fields.getTextInputValue(MODALS.createSubEvent.startDateId);
    const endDate = fields.getTextInputValue(MODALS.createSubEvent.endDateId);
    const adresse = fields.getTextInputValue(MODALS.createSubEvent.adresseId);

    if(eventId == null) {
      throw new BotException('Le nom de l\'événement est obligatoire.');
    }
    if(startDate == null) {
      throw new BotException('La date de début de l\'événement est obligatoire.');
    }

    const event: Event = {
      id: undefined,
      eventName: subEventName,
      creationDate: undefined,
      startDate: dateService.toDate(startDate)!,
      endDate: dateService.toDate(endDate),
      location: adresse,
      subEvents: [],
      parentEvent: undefined,
      participants: [],
      todoList: [],
      tricountUrl: ""
    }

    const eventResult = await eventService.addSubEvent(eventId, event, interaction.user.id);

    await printEvent(interaction, eventResult)
  }
}