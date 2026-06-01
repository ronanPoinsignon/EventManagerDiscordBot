import path from 'node:path';
import { fileURLToPath } from 'url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class LocalFileService {

  private static readonly BASE_DIR = __dirname + "/../../resources/";

  getFile(folderName: string, fileName: string): string | null {
    return this.handleGetFile(folderName, fileName, this.getFolderPath.bind(this));
  }

  getTempFile(folderName: string, fileName: string): string | null {
    return this.handleGetFile(folderName, fileName, this.getTempFolderPath.bind(this));
  }

  private handleGetFile(folderName: string, fileName: string, getPath: (folderName: string, fileName: string) => string): string | null {
    const folderPath = getPath(folderName, fileName);
    const filePath = path.join(folderPath, fileName);
    return fs.existsSync(filePath) ? filePath : null;
  }

  async setFile(folderName: string, fileName: string, blob: Blob): Promise<string> {
    return this.handleSetFile(folderName, fileName, blob, this.getFolderPath.bind(this));
  }

  async setTempFile(folderName: string, fileName: string, blob: Blob): Promise<string> {
    return this.handleSetFile(folderName, fileName, blob, this.getTempFolderPath.bind(this));
  }

  private async handleSetFile(folderName: string, fileName: string, blob: Blob, getPath: (folderName: string, fileName: string) => string): Promise<string> {
    const file = new File([blob], fileName);
    const filePath = getPath(folderName, fileName);
    if(!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, {recursive: true});
    }
    const fullFilePath = path.join(filePath, fileName);
    fs.writeFileSync(fullFilePath, await file.bytes());

    return fullFilePath;
  }

  private getFolderPath(folderName: string) {
    if(folderName.startsWith("/")) {
      folderName = folderName.substring(1);
    }

    return path.join(LocalFileService.BASE_DIR, folderName);
  }

  private getTempFolderPath(folderName: string) {
    const temp = folderName.startsWith("/") ? "/temp" : "/temp/";
    return this.getFolderPath(temp + folderName);
  }

}

export const localFileService = new LocalFileService();