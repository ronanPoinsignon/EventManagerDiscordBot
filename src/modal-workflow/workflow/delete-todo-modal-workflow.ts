import { ModalSubmitInteraction } from 'discord.js';
import { ModalWorkflow } from '../modal-workflow.js';
import { registerModal } from '../../handler/modal-handler.js';
import { MODALS } from '../modal-workflow-id.js';
import { BotException } from '../../exception/bot-exception.js';
import { todoService } from '../../service/web-service/todo-service/todo-service.js';

@registerModal(MODALS.deleteTodo.id)
export class CreateEventModalWorkflow extends ModalWorkflow {

  async run(interaction:  ModalSubmitInteraction): Promise<void> {
    const fields = interaction.fields;

    const todoId: string | undefined = fields.getStringSelectValues(MODALS.deleteTodo.todoId)[0];

    if(todoId == null) {
      throw new BotException('Le nom de l\'événement est obligatoire.');
    }

    const todoResult = await todoService.deleteTodo(todoId, interaction.user.id);

    await interaction.reply({ content: `Le todo ${todoResult.name} a bien été supprimé.`})
  }
}