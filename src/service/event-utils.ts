import { Event } from '../api/event.js';
import { dateService } from './date-service.js';

class EventUtils {

  getDateValue(event: Event) {
    return event.endDate != null ? `Du ${dateService.toString(event.startDate)} au ${dateService.toString(event.endDate)}` : `Le ${dateService.toString(event.startDate)}`
  }

  getAllEventFromEventBase(event: Event) {
    return this.getAllEventFromEventBaseWithLevel(event, 0);
  }

  private getAllEventFromEventBaseWithLevel(event: Event, level: number) {
    const eventList: {name: string, value: Event, level: number}[] = [];
    const baseName = event.eventName;
    eventList.push({name: baseName, value: event, level: level});
    event.subEvents.forEach((subEvent: Event) => {
      const subEventLIst = this.getAllEventFromEventBaseWithLevel(subEvent, level + 1).map(value => {
        return {name: baseName + " - " + value.name, value: subEvent, level: value.level};
      })
      eventList.push(...subEventLIst);
    });

    return eventList;
  }

  getAllEventFromEventArray(events: Event[]) {
    const eventList: {name: string, value: Event, level: number}[] = [];
    events.forEach(event => {
      const events = this.getAllEventFromEventBase(event);
      eventList.push(...events);
    });

    return this.sort(eventList);
  }

  getAllTodoFromEventBase(event: Event) {
    const events = this.getAllEventFromEventBase(event);
    const result = events.map(evt => evt.value.todoList.map(todo => {
      return { name: evt.name + " | " + todo.name, value: todo, level: evt.level };
    })).reduce((todos, allTodos) => {
      allTodos.push(...todos);
      return allTodos;
    }, []);

    return this.sort(result);
  }

  getAllTodoFromEventArray(events: Event[]) {
    const result = events.map(event => this.getAllTodoFromEventBase(event)).reduce((todos, allTodos) => {
      allTodos.push(...todos);
      return allTodos;
    }, []);

    return this.sort(result);
  }

  private sort<T extends {name: string, level: number}>(values: T[]) {
    return values.sort((v1, v2) => {
      if(v1.level != v2.level) {
        return v1.level - v2.level
      }

      return v1.name.localeCompare(v2.name);
    });
  }

}

export const eventUtils = new EventUtils();