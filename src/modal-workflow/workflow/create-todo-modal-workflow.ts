import { ModalSubmitInteraction } from 'discord.js';
import { ModalWorkflow } from '../modal-workflow.js';
import { registerModal } from '../../handler/modal-handler.js';
import { MODALS } from '../modal-workflow-id.js';
import { BotException } from '../../exception/bot-exception.js';
import { eventService } from '../../service/web-service/event-service/event-service.js';
import { printEvent } from '../../command/actions/get-event.js';

@registerModal(MODALS.createTodo.id)
export class CreateEventModalWorkflow extends ModalWorkflow {

  async run(interaction:  ModalSubmitInteraction): Promise<void> {
    const fields = interaction.fields;

    const eventId: string | undefined = fields.getStringSelectValues(MODALS.createTodo.eventId)[0];
    const todoName = fields.getTextInputValue(MODALS.createTodo.todoName);
    const todoValue = fields.getTextInputValue(MODALS.createTodo.todoValue);
    const participants = fields.getStringSelectValues(MODALS.createTodo.participants);
    const done: string | undefined = fields.getStringSelectValues(MODALS.createTodo.todoDone)[0];

    if(eventId == null) {
      throw new BotException('Le nom de l\'événement est obligatoire.');
    }
    if(todoName == null) {
      throw new BotException('La valeur du todo est obligatoire.');
    }
    if(todoValue == null) {
      throw new BotException('La valeur du todo est obligatoire.');
    }
    if(!["true", "false"].includes(done)) {
      throw new BotException('Il faut définir une valeur');
    }

    const event = await eventService.addTodo(eventId, { name: todoName, todo: todoValue }, [...participants], done == "true", interaction.user.id);

    if(event.parentEvent == null) {
      await printEvent(interaction, event);
      return;
    }

    const parentEvent = await eventService.findById(event.parentEvent.id + "", interaction.user.id);
    await printEvent(interaction, parentEvent)
  }
}