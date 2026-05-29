import { Event } from '../api/event.js';
import { dateService } from './date-service.js';

class EventUtils {

  getDateValue(event: Event) {
    return event.endDate != null ? `Du ${dateService.toString(event.startDate)} au ${dateService.toString(event.endDate)}` : `Le ${dateService.toString(event.startDate)}`
  }

}

export const eventUtils = new EventUtils();