import { computed, readonly, ref } from 'vue';
import { defineStore } from 'pinia';

import axios from 'axios';
import { useSessionStorage } from '@vueuse/core';

const todosApi = axios.create({
  baseURL: '/api/todos',
});

export interface Todo {
  id: number;
  description: string;
  time: Date;
  editedTime?: Date;
  completionTime?: Date;
}

export interface RawTodo {
  id: number;
  description: string;
  time: string;
  editedTime?: string;
  completionTime?: string;
}

const parseTodo = (rawTodo: RawTodo): Todo => ({
  ...rawTodo,
  time: new Date(rawTodo.time),
  editedTime: rawTodo.editedTime ? new Date(rawTodo.editedTime) : undefined,
  completionTime: rawTodo.completionTime ? new Date(rawTodo.completionTime) : undefined,
});

export const useTodoStore = defineStore('todos', () => {
  const todos = ref<Todo[]>();

  const user = useSessionStorage<string>('todo-app-user', null);

  const userUrl = computed(() => encodeURIComponent(user.value));

  async function fetchTodos() {
    if (!user.value) throw new Error('Cannot fetch todos, not logged in');
    try {
      const response = await todosApi.get<RawTodo[]>(`/${userUrl.value}`);
      const parsedResponse = response.data.map(parseTodo);
      todos.value = parsedResponse;
      return parsedResponse;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  }

  async function addTodo(description: string) {
    try {
      const response = await todosApi.post<RawTodo>(`/${userUrl.value}`, { description });
      todos.value?.push(parseTodo(response.data));
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  }

  async function deleteTodo(id: number) {
    try {
      await todosApi.delete(`/${userUrl.value}/${id}`);

      const index = todos.value?.findIndex((todo) => todo.id === id) ?? -1;
      if (index >= 0) {
        todos.value?.splice(index, 1);
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }

  async function editTodo(id: number, description: string) {
    try {
      const response = await todosApi.patch(`/${userUrl.value}/${id}`, { description });

      const index = todos.value?.findIndex((todo) => todo.id === id) ?? -1;
      if (index >= 0) {
        todos.value?.splice(index, 1, parseTodo(response.data));
      }
    } catch (error) {
      console.error('Error editing todo:', error);
    }
  }

  async function toggleTodoCompletion(id: number, complete: boolean) {
    try {
      const endpoint = complete
        ? `/${userUrl.value}/${id}/complete`
        : `/${userUrl.value}/${id}/uncomplete`;
      const response = await todosApi.post(endpoint);
      const index = todos.value?.findIndex((todo) => todo.id === id) ?? -1;
      if (index >= 0) {
        todos.value?.splice(index, 1, parseTodo(response.data));
      }
    } catch (error) {
      console.error(`Error ${complete ? 'completing' : 'uncompleting'} todo:`, error);
    }
  }

  async function setUser(newUser: string) {
    user.value = newUser.trim().toLowerCase();
    todos.value = [];
    await fetchTodos();
  }

  function logout() {
    user.value = undefined;
    todos.value = [];
  }

  if (user.value) {
    fetchTodos();
  } else {
    todos.value = [];
  }

  return {
    user: readonly(user),
    todos,
    fetchTodos,
    addTodo,
    deleteTodo,
    editTodo,
    setUser,
    logout,
    toggleTodoCompletion,
  };
});
