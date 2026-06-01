import { User } from '../api/user.js';

class UserUtils {

  private intlLinkUser = new Intl.ListFormat("fr", {style: "long", type: "conjunction"});

  parseUserName(user: User) {
    return this.capitalizeFirstLetter(user.username);
  }

  capitalizeFirstLetter(value: string) {
    return String(value).charAt(0).toUpperCase() + String(value).slice(1);
  }

  getUserArrayString(users: User[]) {
    return this.intlLinkUser.format(users.map(user => this.parseUserName(user)));
  }

}

export const userUtils = new UserUtils();