import { UserException } from '../exception/bot-exception.js';

class DateUtils {

  createDate(year: number, month: number, day: number, hour: number, minute: number, second: number = 0) {
    return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  }

  now() {
    return new Date();
  }

  toString(date: Date): string;
  toString(date: null | undefined): null;
  toString(date: Date | null | undefined): string | null;
  toString(date: Date | null | undefined): string | null {
    if(!date) {
      return null;
    }

    return this.dateCustomFormatting(date);
  }

  toDate(date: string): Date;
  toDate(date: null | undefined): null;
  toDate(value?: string | null | undefined): Date | null;
  toDate(value?: string | null | undefined): Date | null {
    if(!value) {
      return null;
    }

    return this.parseDate(value);
  }

  toStringRange(range: { startDate: Date; endDate: Date }) {
    if(this.isSameDay(range.startDate, range.endDate)) {
      return `${this.extractDate(range.startDate)} ${this.extractTime(range.startDate)} - ${this.extractTime(range.endDate)}`;
    }

    return `${this.toString(range.startDate)} - ${this.toString(range.endDate)}`;
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getUTCFullYear() === date2.getUTCFullYear() && date1.getUTCMonth() === date2.getUTCMonth() && date1.getUTCDate() === date2.getUTCDate();
  }

  extractDate(date: Date) {
    const padStart = (value: number): string => value.toString().padStart(2, '0');
    return `${padStart(date.getUTCDate())}/${padStart(date.getUTCMonth() + 1)}/${padStart(date.getUTCFullYear())}`;
  }

  extractTime(date: Date) {
    const padStart = (value: number): string => value.toString().padStart(2, '0');
    return `${padStart(date.getUTCHours())}:${padStart(date.getUTCMinutes())}`;
  }

  private dateCustomFormatting(date: Date): string {
    return `${this.extractDate(date)} ${this.extractTime(date)}`;
  }

  getDatePlaceholder() {
    return "DD/MM/YYYY HH:MM";
  }

  private parseDate(input: string): Date {
    const match = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2})[:h](\d{2})$/.exec(input);

    if (!match) {
      throw new UserException(`La valeur ${input} n'est pas une date de format ${this.getDatePlaceholder()}`);
    }

    const [_, d, m, y, h, min] = match.map(Number);

    if (h > 23 || min > 59) {
      throw new UserException(`Heure invalide : ${h}:${min}`);
    }

    return this.createDate(y, m, d, h, min);
  }

  public parseInstant(input: string): Date {
    return new Date(input);
  }

  public toIsoString(date: Date) {
    return date.toISOString();
  }

}

export const dateUtils = new DateUtils();