import { UserException } from '../exception/bot-exception.js';

class DateUtils {

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
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
  }

  extractDate(date: Date) {
    const padStart = (value: number): string => value.toString().padStart(2, '0');
    return `${date.getDate()}/${padStart(date.getMonth() + 1)}/${padStart(date.getFullYear())}`;
  }

  extractTime(date: Date) {
    const padStart = (value: number): string => value.toString().padStart(2, '0');
    return `${padStart(date.getHours())}:${padStart(date.getMinutes())}`;
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

    return new Date(Date.UTC(y, m - 1, d, h, min));
  }

}

export const dateUtils = new DateUtils();