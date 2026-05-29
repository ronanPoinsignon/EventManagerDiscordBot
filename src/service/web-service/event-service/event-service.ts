import { WebService } from '../web-service.js';
import { Event } from '../../../api/event.js';

class EventService extends WebService {

  private static eventUrl: string = "/events"

   private getRoute(route: string): string {
      return EventService.eventUrl + route;
   }

  findActive(userId: string): Promise<Event[]> {
    const route = this.getRoute("/findActive");
    return this.get<Event[]>(route, userId);
  }

  getLast(userId: string): Promise<Event> {
    const route = this.getRoute("/findActive");
    return this.get<Event>(route, userId);
  }

  findByName(eventName: string, userId: string): Promise<Event> {
    const route = this.getRoute("/findByEventName");
    return this.get<Event>(route, userId, {"name": eventName});
  }

  save(event: Event, userId: string): Promise<Event> {
    const route = this.getRoute("/save");
    return this.post(route, userId, {}, event);
  }

  update(event: Event, userId: string): Promise<Event> {
    const route = this.getRoute("/save");
    return this.post(route, userId, {}, event);
  }

  deleteEvent(eventName: string, parentName: string | null, userId: string): Promise<Event> {
    const route = this.getRoute("/delete");
    return this.delete(route, userId, {"eventName": eventName, "parentName": parentName});
  }

  addEventParticipant(eventName: string, parentName: string | null, participantIds: string[], userId: string): Promise<Event> {
      const route = this.getRoute("/participants/discord/add");
      return this.post(route, userId, { "eventName": eventName, "parentName": parentName, "userIds": participantIds });
  }

  removeEventParticipant(eventName: string, parentName: string | null, participantIds: string[], userId: string): Promise<Event> {
      const route = this.getRoute("/participants/discord/remove");
      return this.post(route, userId, { "eventName": eventName, "parentName": parentName, "userIds": participantIds })
  }

  addTodo(eventName: string, parentName: string | null, todo: {name: string, todo: string}, userId: string): Promise<Event> {
    const route = this.getRoute("/todos/addTodo");
    return this.post(route, userId, {"eventName": eventName, "parentName": parentName}, todo);
  }

  removeTodo(eventName: string, parentName: string | null, todoName: string, userId: string): Promise<Event> {
    const route = this.getRoute("/todos/removeTodo");
    return this.post(route, userId, {"eventName": eventName, "parentName": parentName, "todoName": todoName});
  }

  addTodoParticipant(eventName: string, parentName: string | null, todoName: string, participantId: string, userId: string): Promise<Event> {
      const route = this.getRoute("/todos/discord/addUsers");
      return this.post(route, userId, {"eventName": eventName, "parentName": parentName, "todoName": todoName, "userIds": participantId})
  }

  removeTodoParticipant(eventName: string, parentName: string | null, todoName: string, participantId: string, userId: string): Promise<Event> {
      const route = this.getRoute("/todos/discord/removeUsers");
      return this.post(route, userId, {"eventName": eventName, "parentName": parentName, "todoName": todoName, "userIds": participantId})
  }

  updateTodoStatus(eventName: string, parentName: string | null, todoName: string, isDone: boolean, userId: string): Promise<Event> {
      const route = this.getRoute("/todos/updateStatus");
      return this.post(route, userId, {"eventName": eventName, "parentName": parentName, "todoName": todoName, "isDone": isDone})
  }


  addSubEvent(eventName: string, parentName: string | null, subEvent: Event, userId: string): Promise<Event> {
    const route = this.getRoute("/subEvent/addSubEvent")
    return this.post(route, userId, { "eventName": eventName, "parentName": parentName }, subEvent);
  }

  removeSubEvent(eventName: string, parentName: string | null, subEventName: string, userId: string): Promise<Event> {
    const route = this.getRoute("/subEvent/removeSubEvent")
    return this.post(route, userId, {"eventName": eventName, "parentName": parentName, "subEventName": subEventName});
  }

}

export const eventService = new EventService();
