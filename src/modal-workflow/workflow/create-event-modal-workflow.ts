import { ModalSubmitInteraction, ComponentType } from 'discord.js';
import { ModalWorkflow } from '../modal-workflow.js';
import { registerModal } from '../../handler/modal-handler.js';
import { MODALS } from '../modal-workflow-id.js';
import { BotException } from '../../exception/bot-exception.js';
import { eventService } from '../../service/web-service/event-service.js';
import { Event } from '../../api/event.js';
import { dateUtils } from '../../utils/date-utils.js';
import { printEvent } from '../../command/actions/get-event.js';
import { NotFoundException } from '../../service/web-service/web-exception.js';

@registerModal(MODALS.createEvent.id)
export class CreateEventModalWorkflow extends ModalWorkflow {

  async run(interaction:  ModalSubmitInteraction): Promise<void> {
    const fields = interaction.fields;

    const eventNameField = fields.getField(MODALS.createEvent.eventNameId);
    if(eventNameField == null) {
      throw new BotException('Le nom de l\'événement est obligatoire.');
    }
    const fieldType = eventNameField.type;
    let eventName: string;
    if(fieldType == ComponentType.StringSelect) {
      eventName = eventNameField.values[0];
    } else if (fieldType == ComponentType.TextInput) {
      eventName = eventNameField.value;
    } else {
      console.error("Champ eventName non reconnu : ", eventNameField);
      throw new BotException('Une erreur est survenue.');
    }

    const startDate = fields.getTextInputValue(MODALS.createEvent.startDateId);
    const endDate = fields.getTextInputValue(MODALS.createEvent.endDateId);
    const adresse = fields.getTextInputValue(MODALS.createEvent.adresseId);
    const tricount = fields.getTextInputValue(MODALS.createEvent.tricountId);

    if(startDate == null) {
      throw new BotException('La date de début de l\'événement est obligatoire.');
    }

    const dbEvent = await eventService.findByName(eventName, null, interaction.user.id)
      .catch(e => {
        if(e instanceof NotFoundException) {
          return null;
        }
        throw e;
      });

    if(dbEvent == null) {
      const event: Event = {
        id: undefined,
        eventName: eventName,
        creationDate: undefined,
        startDate: dateUtils.toDate(startDate),
        endDate: dateUtils.toDate(endDate),
        location: adresse,
        subEvents: [],
        parentEvent: undefined,
        participants: [],
        todoList: [],
        tricountUrl: tricount,
        guildIds: [ interaction.guildId! ],
      }

      const result = await eventService.save(event, interaction.user.id);
      await printEvent(interaction, result);
      return;
    }

    dbEvent.startDate = dateUtils.toDate(startDate);
    dbEvent.endDate = dateUtils.toDate(endDate);
    dbEvent.location = adresse;
    dbEvent.tricountUrl = tricount;

    const result = await eventService.save(dbEvent, interaction.user.id);
    await printEvent(interaction, result);
  }
}