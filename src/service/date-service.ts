import { UserException } from '../exception/bot-exception.js';

class DateService {

  toString(date?: Date) {
    if(date == undefined) {
      return undefined;
    }

    return this.dateCustomFormatting(date)
  }

  toDate(value?: string) {
    if(!value) {
      return undefined;
    }

    return this.parseDate(value);
  }

  private dateCustomFormatting(date: Date): string {
    const padStart = (value: number): string => value.toString().padStart(2, '0');
    return `${padStart(date.getDate())}/${padStart(date.getMonth() + 1)}/${date.getFullYear()} ${padStart(date.getHours())}:${padStart(date.getMinutes())}`;
  }

  private parseDate(input: string): Date {
    const match = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2})[:h](\d{2})$/.exec(input);

    if (!match) {
      throw new UserException(`La valeur ${input} n'est pas une date de format DD/MM/YYYY HH:MM`);
    }

    const [_, d, m, y, h, min] = match.map(Number);

    if (h > 23 || min > 59) {
      throw new UserException(`Heure invalide : ${h}:${min}`);
    }

    return new Date(Date.UTC(y, m - 1, d, h, min));
  }

}

export const dateService = new DateService();