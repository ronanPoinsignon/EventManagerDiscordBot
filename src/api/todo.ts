import { User } from './user.js';

export interface Todo {

  id?: number;
  name: string;
  todoValue: string;
  participants?: User[];
  done: boolean;

}