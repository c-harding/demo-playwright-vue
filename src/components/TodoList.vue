<script setup lang="ts">
import CreateField from './CreateField.vue';
import { useTodoStore } from '@/stores/todos';
import TodoItem from './TodoItem.vue';
import { computed, ref } from 'vue';

const todoStore = useTodoStore();

const idToEdit = ref<number>();

const nonEditedTodos = computed(() => todoStore.todos.filter((x) => x.id !== idToEdit.value));
const editedTodo = computed(() =>
  idToEdit.value ? todoStore.todos.find((x) => x.id === idToEdit.value) : undefined,
);

const saveEditedTodo = (id: number, description: string) => {
  todoStore.editTodo(id, description);
  idToEdit.value = undefined;
};
</script>

<template>
  <div class="flex flex-1 flex-col justify-between">
    <div class="flex flex-col">
      <TodoItem
        v-for="todo in nonEditedTodos"
        :key="todo.id"
        :todo="todo"
        @edit="idToEdit = todo.id"
        @toggle-done="todoStore.toggleTodo(todo.id)"
        @delete="todoStore.deleteTodo(todo.id)"
      />
    </div>
    <CreateField
      v-if="editedTodo"
      :placeholder="`Edit todo`"
      :existing-description="editedTodo.description"
      @cancel-edit="idToEdit = undefined"
      @confirm="saveEditedTodo(editedTodo.id, $event)"
    />
    <CreateField v-else placeholder="Add todo" @confirm="todoStore.addTodo" />
  </div>
</template>
