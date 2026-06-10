import { User } from './user.js';

export interface Notification<T> {
  executionDate: Date;
  entityType: string;
  entity: T;
  users: User[];
}