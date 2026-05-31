import { User } from './user.js';
import { Todo } from './todo.js';

export interface Event {

  id?: number;
  eventName: string;
  creationDate?: Date;
  startDate: Date;
  endDate?: Date;
  location?: string;
  subEvents: SubEvent[];
  parentEvent?: Event;
  participants: User[];
  todoList: Todo[];
  tricountUrl?: string;

}

export type SubEvent = Event & {
  parentEvent: Event;
}