import { ref, reactive } from 'vue';
import { defineStore } from 'pinia';

interface TodoItem {
  id: number;
  description: string;
}

export const useTodoStore = defineStore('todos', () => {
  const nextId = ref(1);
  const todos = reactive<TodoItem[]>([]);

  function addTodo(description: string) {
    todos.push({ id: nextId.value++, description });
  }

  return { todos, addTodo };
});
