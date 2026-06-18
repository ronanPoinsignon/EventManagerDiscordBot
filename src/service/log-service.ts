import { dateUtils } from '../utils/date-utils.js';

class LoggerService {

  info(...data: any[]) {
    this.logMessage(console.info, ...data);
  }

  debug(...data: any[]) {
    this.logMessage(console.debug, ...data);
  }

  warn(...data: any[]) {
    this.logMessage(console.warn, ...data);
  }

  error(...data: any[]) {
    this.logMessage(console.error, ...data);
  }

  private logMessage(logFunction: (...data: any[]) => void,
                     ...data: any[]) {
    logFunction(dateUtils.toIsoString(new Date()) + " - " + logFunction.name.toUpperCase() + " | ", ...this.getDataString(...data));
  }

  private getDataString(...data: any[]) {
    return data.map(d => {
      if(d instanceof Error) {
        return d.stack
      }

      return d;
    });
  }

}

export const loggerService = new LoggerService();