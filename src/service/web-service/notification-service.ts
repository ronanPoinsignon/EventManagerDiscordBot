import { WebService } from './web-service.js';
import { Event } from '../../api/event.js';

class NotificationService extends WebService {

  private static NotificationUrl: string = "/notifications"

  private getRoute(route: string): string {
    return NotificationService.NotificationUrl + route;
  }

  findById(notificationId: string, userId: string | null): Promise<Event> {
    const route = this.getRoute("/findById");
    return this.get<Event>(route, userId, { "id": notificationId });
  }

}

export const notificationService = new NotificationService();