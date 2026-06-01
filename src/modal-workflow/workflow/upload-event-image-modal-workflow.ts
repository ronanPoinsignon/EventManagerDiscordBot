import { Attachment, ModalSubmitInteraction } from 'discord.js';
import { ModalWorkflow } from '../modal-workflow.js';
import { registerModal } from '../../handler/modal-handler.js';
import { MODALS } from '../modal-workflow-id.js';
import { UserException } from '../../exception/bot-exception.js';
import fs from 'node:fs';
import { eventService } from '../../service/web-service/event-service.js';
import { printEvent } from '../../command/actions/get-event.js';
import { localFileService } from '../../service/local-file-service.js';

@registerModal(MODALS.uploadEventImage.id)
export class DeleteEventModalWorkflow extends ModalWorkflow {

  async run(interaction:  ModalSubmitInteraction): Promise<void> {
    const fields = interaction.fields;

    const eventId = fields.getStringSelectValues(MODALS.uploadEventImage.eventId);
    const image = fields.getUploadedFiles(MODALS.uploadEventImage.image);

    if(eventId == null) {
      throw new UserException("L'id de l'événement ne peut être null.")
    }
    if(image == null || image.size == 0) {
      throw new UserException('Une image doit être choisie.');
    }

    const attachment = image.values().next().value as Attachment;
    const fileUrl = attachment.url;

    const fileResponse = await fetch(fileUrl);

    if (!fileResponse.ok) {
      throw new Error(`Erreur téléchargement : ${fileResponse.status}`);
    }

    const blob = await fileResponse.blob();

    const file = new File([blob], eventId + ".png", {
      type: blob.type,
    });

    const formData = new FormData();
    formData.append("eventFile", file);

    const result = await eventService.uploadEventFile(eventId + "", formData, interaction.user.id);
    const event = await eventService.findById(eventId + "", interaction.user.id);

    await localFileService.setTempFile("images", event.id + ".png", result);

    await printEvent(interaction, event);
  }
}