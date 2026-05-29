import { User } from './user.js';
import { Todo } from './todo.js';

export interface Event {

  id?: number;
  eventName: string;
  creationDate?: Date;
  startDate: Date;
  endDate?: Date;
  location?: string;
  subEvents: Event[];
  parentEvent?: Event;
  participants: User[];
  todoList: Todo[];
  tricountUrl?: string;

}