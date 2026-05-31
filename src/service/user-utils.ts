import { User } from '../api/user.js';

class UserUtils {

  parseUserName(user: User) {
    return this.capitalizeFirstLetter(user.username);
  }

  capitalizeFirstLetter(value: string) {
    return String(value).charAt(0).toUpperCase() + String(value).slice(1);
  }

  getUserArrayString(users: User[]) {
    return users.map(user => this.parseUserName(user)).sort((str1, str2) => str1.localeCompare(str2)).join(', ');
  }

}

export const userUtils = new UserUtils();