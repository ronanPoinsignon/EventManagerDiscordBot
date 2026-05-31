import { WebService } from '../web-service.js';
import { User } from '../../../api/user.js';

export class UserService extends WebService {
   
  private static baseUrl: string = "/users"
   
  private getRoute(route: string): string {
    return UserService.baseUrl + route;
  }

  getAllUsers(userId: string): Promise<User[]> {
    const route = this.getRoute("/")
    return super.get<User[]>(route, userId).then((users: User[]) => users.filter(user => user.discordId != null));
  }

}

export const userService = new UserService();