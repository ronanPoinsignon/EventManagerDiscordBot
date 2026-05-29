import { ModalSubmitInteraction } from 'discord.js';
import { ModalWorkflow } from '../modal-workflow.js';
import { registerModal } from '../../handler/modal-handler.js';
import { MODALS } from '../modal-workflow-id.js';
import { BotException } from '../../exception/bot-exception.js';
import { eventService } from '../../service/web-service/event-service/event-service.js';
import { Event } from '../../api/event.js';
import { dateService } from '../../service/date-service.js';
import { printEvent } from '../../command/actions/get-event.js';

@registerModal(MODALS.createEvent.id)
export class CreateEventModalWorkflow extends ModalWorkflow {

  async run(interaction:  ModalSubmitInteraction): Promise<void> {
    const fields = interaction.fields;

    const eventName = fields.getTextInputValue(MODALS.createEvent.eventNameId);
    const startDate = fields.getTextInputValue(MODALS.createEvent.startDateId);
    const endDate = fields.getTextInputValue(MODALS.createEvent.endDateId);
    const adresse = fields.getTextInputValue(MODALS.createEvent.adresseId);
    const tricount = fields.getTextInputValue(MODALS.createEvent.tricountId);

    if(eventName == null) {
      throw new BotException('Le nom de l\'événement est obligatoire.');
    }
    if(startDate == null) {
      throw new BotException('La date de début de l\'événement est obligatoire.');
    }

    const event: Event = {
      id: undefined,
      eventName: eventName,
      creationDate: undefined,
      startDate: dateService.toDate(startDate),
      endDate: dateService.toDate(endDate),
      location: adresse,
      subEvents: [],
      parentEvent: undefined,
      participants: [],
      todoList: [],
      tricountUrl: tricount
    }

    const eventResult = await eventService.save(event, interaction.user.id);

    await printEvent(interaction, eventResult)
  }
}