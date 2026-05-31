import { WebService } from '../web-service.js';
import { Event } from '../../../api/event.js';
import { Todo } from '../../../api/todo.js';

class EventService extends WebService {

  private static eventUrl: string = "/events"

   private getRoute(route: string): string {
      return EventService.eventUrl + route;
   }

  findActive(userId: string): Promise<Event[]> {
    const route = this.getRoute("/findActive");
    return this.get<Event[]>(route, userId);
  }

  findAll(userId: string): Promise<Event[]> {
    const route = this.getRoute("/findAll");
    return this.get<Event[]>(route, userId);
  }

  getLast(userId: string): Promise<Event> {
    const route = this.getRoute("/findActive");
    return this.get<Event>(route, userId);
  }

  findById(eventId: string, userId: string): Promise<Event> {
    const route = this.getRoute("/findById");
    return this.get<Event>(route, userId, { "id": eventId });
  }

  findByName(eventName: string, parentName: string | null, userId: string): Promise<Event> {
    const route = this.getRoute("/findByEventName");
    return this.get<Event>(route, userId, {"name": eventName, parentName: parentName});
  }

  save(event: Event, userId: string): Promise<Event> {
    const route = this.getRoute("/save");
    return this.post(route, userId, {}, event);
  }

  update(event: Event, parentEventName: string | null, userId: string): Promise<Event> {
    const route = this.getRoute("/discord/save");
    return this.post(route, userId, { "parentEventName": parentEventName }, event);
  }

  deleteEvent(eventId: string, userId: string): Promise<Event> {
    const route = this.getRoute("/delete");
    return this.delete(route, userId, {"eventId": eventId});
  }

  setEventParticipant(eventId: string, participantIds: string[], userId: string): Promise<Event> {
    const route = this.getRoute("/participants/set");
    return this.post(route, userId, { eventId: eventId, "userIds": participantIds })
  }

  addTodo(eventId: string, todo: {name: string, todo: string}, userIds: string[], isDone: boolean, userId: string): Promise<Event> {
    const route = this.getRoute("/todos/addTodo");
    return this.post(route, userId, {"eventId": eventId, "userIds": userIds, "done": isDone}, todo);
  }

  addTodoParticipant(eventId: string, todoName: string, participantIds: string[], userId: string): Promise<Event> {
      const route = this.getRoute("/todos/addUsers");
      return this.post(route, userId, {"eventId": eventId, "todoName": todoName, "userIds": participantIds});
  }

  addSubEvent(eventId: string, subEvent: Event, userId: string): Promise<Event> {
    const route = this.getRoute("/subEvent/addSubEvent")
    return this.post(route, userId, { "parentEventId": eventId }, subEvent);
  }

  findByTodoId(todoId: string, userId: string): Promise<Event> {
    const route = this.getRoute("/todos/findByTodoId");
    return this.get<Event>(route, userId, { "todoId": todoId });
  }

}

export const eventService = new EventService();
