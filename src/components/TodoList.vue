<script setup lang="ts">
import CreateField from './CreateField.vue';
import { useTodoStore } from '@/stores/todos';

const todoStore = useTodoStore();
</script>

<template>
  <div class="flex flex-col">
    <CreateField placeholder="Add Todo" @confirm="todoStore.addTodo" />
    <div v-for="todo in todoStore.todos" :key="todo.id">{{ todo.description }}</div>
  </div>
</template>
