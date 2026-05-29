import path from 'node:path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ResourceService {

  getImage(name: string) {
    return path.join(__dirname, "../../resources/images/" + name + ".png");
  }

}

export const resourceService = new ResourceService();