import { User } from '../api/user.js';

class UserUtils {

  parseUserName(user: User) {
    return user.username;
  }

}

export const userUtils = new UserUtils();