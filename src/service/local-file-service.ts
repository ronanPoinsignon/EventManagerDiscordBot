import path from 'node:path';
import { fileURLToPath } from 'url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEMP_FOLDER = "/temp";

class LocalFileService {

  private static readonly BASE_DIR = __dirname + "/../../resources/";
  // map des fichiers par rapport au temps écoulé depuis leur dernière récupération
  private readonly LAST_SEEN_DURATION = new Map<string, number>();

  getFile(folderName: string, fileName: string): string | null {
    return this.handleGetFile(folderName, fileName, this.getFolderPath.bind(this));
  }

  getTempFile(folderName: string, fileName: string): string | null {
    return this.handleGetFile(folderName, fileName, this.getTempFolderPath.bind(this));
  }

  private handleGetFile(folderName: string, fileName: string, getPath: (folderName: string) => string): string | null {
    const folderPath = getPath(folderName);
    const filePath = path.join(folderPath, fileName);
    const file = fs.existsSync(filePath) ? filePath : null;
    if(file != null) {
      this.LAST_SEEN_DURATION.set(filePath, new Date().getTime());
    }

    return file;
  }

  lastSeen(filePath: string): number {
    if(!fs.existsSync(filePath)) {
      return -1;
    }

    const timestamp = this.LAST_SEEN_DURATION.get(filePath);
    if(timestamp != null) {
      return new Date().getTime() - new Date(timestamp).getTime();
    }

    const fileCreatedMs = fs.lstatSync(filePath).birthtimeMs;
    return new Date().getTime() - new Date(fileCreatedMs).getTime();
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

  getFolderPath(folderName: string) {
    if(folderName.startsWith("/")) {
      folderName = folderName.substring(1);
    }

    return path.join(LocalFileService.BASE_DIR, folderName);
  }

  private getTempFolderPath(folderName: string) {
    const temp = folderName.startsWith("/") ? TEMP_FOLDER : (TEMP_FOLDER + "/");
    return this.getFolderPath(temp + folderName);
  }

  removeTempFile(folderName: string, filename: string) {
    const filePath = this.getTempFile(folderName, filename);
    if(filePath == null) {
      return;
    }

    fs.unlinkSync(filePath);
  }

}

export const localFileService = new LocalFileService();

const clearTempFiles = () => {
  console.info("Cleaning temp files...");
  const tempFolder = localFileService.getFolderPath(TEMP_FOLDER);
  const deletedFiles = readFolder(tempFolder);
  console.info(deletedFiles, "file(s) deleted.");
}

const readFolder = (folderPath: string): number => {
  const counter = { count: 0 };
  fs.readdirSync(folderPath).forEach(fileName => {
    const file = path.join(folderPath, fileName);
    if(file == null) {
      return;
    }

    if(fs.lstatSync(file).isDirectory()) {
      counter.count += readFolder(file);
    } else {
      counter.count += checkFile(file);
    }
  });

  return counter.count;
}

const checkFile = (filePath: string): number => {
  const extension = filePath.split(".").pop();
  if(extension == null) {
    return 0;
  }

  if(["png", "jpg", "jpeg"].indexOf(extension) == -1) {
    return 0;
  }

  const lastSeen = localFileService.lastSeen(filePath);
  const daysLastSeen = lastSeen/(1000 * 60 * 60 * 24);
  if(daysLastSeen < 3) {
    return 0;
  }

  fs.unlinkSync(filePath);
  console.info("Suppression du fichier suivant pour inactivité : ", filePath);
  return 1;
}

export const clearFiles = () => {
  clearTempFiles();
  setInterval(clearTempFiles, 1000 * 60 * 60);
}
