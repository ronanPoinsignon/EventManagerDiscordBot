import { WebService } from './web-service.js';
import { Todo } from '../../api/todo.js';

class TodoService extends WebService {

  private static todoUrl: string = "/todos"

  private getRoute(route: string): string {
    return TodoService.todoUrl + route;
  }

  deleteTodo(todoId: string, userId: string): Promise<Todo> {
    const route = this.getRoute("/");
    return this.delete(route, userId, { "todoId": todoId });
  }

  done(todoId: string, done: boolean, userId: string): Promise<Todo> {
    const route = this.getRoute("/done");
    return this.post(route, userId, { "todoId": todoId, "done": done });
  }

  setParticipants(todoId: string, participantIds: string[], userId: string): Promise<Todo> {
    const route = this.getRoute("/todos/setUsers");
    return this.post(route, userId, {todoId: todoId, "userIds": participantIds});
  }
}

export const todoService = new TodoService();