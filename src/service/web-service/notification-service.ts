import { WebService } from './web-service.js';
import { Event } from '../../api/event.js';
import { Notification } from '../../api/notification.js';

class NotificationService extends WebService {

  private static NotificationUrl: string = "/notifications"

  private getRoute(route: string): string {
    return NotificationService.NotificationUrl + route;
  }

  findById<T>(notificationId: string, userId: string | null): Promise<Notification<T>> {
    const route = this.getRoute("/findById");
    return this.get<Notification<T>>(route, userId, { "id": notificationId });
  }

}

export const notificationService = new NotificationService();