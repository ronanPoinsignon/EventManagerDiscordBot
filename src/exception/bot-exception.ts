export class BotException extends Error {

  constructor(message: string) {
    super(message);
  }

}

export class UserException extends BotException {

  constructor(message: string) {
    super(message);
  }

}