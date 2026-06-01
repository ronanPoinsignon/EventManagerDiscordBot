import { localFileService } from './local-file-service.js';

class ResourceService {


  getImage(name: string) {
    return localFileService.getFile("images", name);
  }

}

export const resourceService = new ResourceService();