import { ModalSubmitInteraction } from 'discord.js';
import { ModalWorkflow } from '../modal-workflow.js';
import { registerModal } from '../../handler/modal-handler.js';
import { MODALS } from '../modal-workflow-id.js';
import { BotException } from '../../exception/bot-exception.js';
import { todoService } from '../../service/web-service/todo-service.js';
import { messageService } from '../../utils/message-service.js';
import { embedUtils } from '../../utils/embed-utils.js';

@registerModal(MODALS.setTodoDone.id)
export class SetTodoDoneModalWorkflow extends ModalWorkflow {

  async run(interaction:  ModalSubmitInteraction): Promise<void> {
    const fields = interaction.fields;

    const todoId: string | undefined = fields.getStringSelectValues(MODALS.setTodoDone.todoId)[0];
    const done: string | undefined = fields.getStringSelectValues(MODALS.setTodoDone.todoDone)[0];

    if(todoId == null) {
      throw new BotException('Le nom de l\'événement est obligatoire.');
    }
    if(!["true", "false"].includes(done)) {
      throw new BotException('Il faut définir une valeur');
    }

    const todoResult = await todoService.done(todoId, done =="true", interaction.user.id);

    const embed = embedUtils.validationEmbed("Modification de todo", [], `Le todo ${todoResult.name} a bien été modifié.`);
    await messageService.replyEmbed(interaction, { embed: [ embed.embed ], attachment: embed.attachments });
  }
}