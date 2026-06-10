export interface Notification<T> {
  executionDate: Date;
  entityType: string;
  entity: T;
}