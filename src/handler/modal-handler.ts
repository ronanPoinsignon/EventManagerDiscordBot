import { Collection, ModalSubmitInteraction } from 'discord.js';
import { ModalWorkflow } from '../modal-workflow/modal-workflow.js';
import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { fileURLToPath } from 'url';
import { exceptionHandler } from './exception-handler.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ModalHandler {

  private modalHandlerList: Collection<string, ModalWorkflow> = new Collection();

  static registerModal(modalId: string) {
    return function<T extends new () => ModalWorkflow>(clazz: T) {
      if(modalHandler.modalHandlerList.has(modalId)) {
        throw new Error(`Modal handler ${modalId} already exists`);
      }
      modalHandler.modalHandlerList.set(modalId, new clazz());
    }
  }

  constructor() {
    this.loadModalWorkflows();
  }

  private async loadModalWorkflows() {
    const dir = path.resolve(path.join(__dirname, "../modal-workflow/workflow"));
    const files = fs.readdirSync(dir);

    const imports = files.map(file => {
      const fullPath = path.join(dir, file);
      return import(pathToFileURL(fullPath).href);
    });

    await Promise.all(imports);

    console.log(`Loaded ${files.length} modal workflows`);
  }

  async handle(interaction: ModalSubmitInteraction) {
    const modal = this.modalHandlerList.get(interaction.customId);
    if(modal == null) {
      console.error(`Aucune gestion de modal pour l'id " + ${interaction.customId}.`);
      return;
    }

    try {
      await modal.run(interaction);
    } catch (error: any) {
      await exceptionHandler.handle(interaction, error);
    }
  }

}

export const modalHandler = new ModalHandler();
export const registerModal = ModalHandler.registerModal;