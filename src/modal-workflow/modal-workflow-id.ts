export const MODALS = {
  createEvent: {
    id: "createEventModalId",
    eventNameId: "eventNameId",
    startDateId: "startDateId",
    endDateId: "endDateId",
    tricountId: "tricountId",
    adresseId: "adresseId"
  },
  createSubEvent: {
    id: "createSubEventModalId",
    eventNameId: "eventNameId",
    subEventNameId: "subEventNameId",
    startDateId: "startDateId",
    endDateId: "endDateId",
    adresseId: "adresseId"
  },
  createTodo: {
    id: "createTodoModalId",
    parentEventName: "parentEventNameId",
    eventId: "eventId",
    todoName: "todoNameId",
    todoValue: "todoValueId",
    participants: "participantsId",
    todoDone: "todoDoneId"
  },
  deleteEvent: {
    id: "deleteEventModalId",
    eventId: "eventId",
  },
  deleteSubEvent: {
    id: "deleteSubEventModalId",
    eventId: "eventId"
  },
  deleteTodo: {
    id: "deleteTodoModalId",
    todoId: "todoId"
  },
  addEventParticipant: {
    id: "addEventParticipantModalId",
    eventId: "eventId",
    participants: "participantsId"
  },
  setTodoDone: {
    id: "setTodoDoneModalId",
    todoId: "todoId",
    todoDone: "todoDoneId"
  },
  selectEventUpdate: {
    id: "selectEventUpdateModalId",
    eventId: "eventId"
  }
}