import { UserException } from '../exception/bot-exception.js';

class DateService {

  toString(date: Date) {
    return this.dateCustomFormatting(date)
  }

  toDate(value: string) {
    return this.parseDate(value);
  }

  private dateCustomFormatting(date: Date): string {
    const padStart = (value: number): string =>
      value.toString().padStart(2, '0');
    return `${padStart(date.getDate())}/${padStart(date.getMonth() + 1)}/${date.getFullYear()} ${padStart(date.getHours())}:${padStart(date.getMinutes())}`;
  }

  private parseDate(input: string): Date {
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(input);

    if (!match) {
      throw new UserException(`La valeur ${input} n'est pas une date de format DD/MM/YYYY`);
    }

    const [_, d, m, y] = match.map(Number);

    return new Date(y, m - 1, d);
  }

}

export const dateService = new DateService();