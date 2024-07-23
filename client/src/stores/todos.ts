import { ref, reactive } from 'vue';
import { defineStore } from 'pinia';

export interface Todo {
  id: number;
  description: string;
  time: Date;
  editedTime?: Date;
  completionTime?: Date;
}

export const useTodoStore = defineStore('todos', () => {
  const nextId = ref(1);
  const todos = reactive<Todo[]>([]);

  function addTodo(description: string) {
    todos.push({
      id: nextId.value++,
      description,
      time: new Date(),
    });
  }

  function deleteTodo(id: number) {
    const index = todos.findIndex((todo) => todo.id === id);
    if (index >= 0) {
      todos.splice(index, 1);
    }
  }

  function editTodo(id: number, description: string) {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      todo.description = description;
      todo.editedTime = new Date();
    }
  }

  function toggleTodo(id: number) {
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      todo.completionTime = todo.completionTime ? undefined : new Date();
    }
  }

  return { todos, toggleTodo, addTodo, editTodo, deleteTodo };
});
