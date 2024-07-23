<script setup lang="ts">
import TodoField from './TodoField.vue';
import { useTodoStore } from '@/stores/todos';
import TodoItem from './TodoItem.vue';
import { ref } from 'vue';

const todoStore = useTodoStore();

const idToEdit = ref<number>();

const saveEditedTodo = async (id: number, description: string) => {
  await todoStore.editTodo(id, description);
  idToEdit.value = undefined;
};
</script>

<template>
  <main class="flex flex-1 flex-col justify-between">
    <div class="flex flex-col">
      <template v-for="todo in todoStore.todos" :key="todo.id">
        <TodoField
          v-if="idToEdit === todo.id"
          :existing-description="todo.description"
          @cancel-edit="idToEdit = undefined"
          @confirm="saveEditedTodo(todo.id, $event)"
        />
        <TodoItem
          v-else
          :todo="todo"
          @edit="idToEdit = todo.id"
          @toggle-done="todoStore.toggleTodoCompletion(todo.id, !todo.completionTime)"
          @delete="todoStore.deleteTodo(todo.id)"
        />
      </template>
    </div>
    <TodoField @confirm="todoStore.addTodo" />
  </main>
</template>
