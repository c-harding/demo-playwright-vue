<script setup lang="ts">
import LoginForm from './components/LoginForm.vue';
import TodoList from './components/TodoList.vue';
import { useTodoStore } from './stores/todos';

const todoStore = useTodoStore();
</script>

<template>
  <main
    className="flex flex-col gap-8 p-4 flex-[72em] flex-grow-0 drop-shadow-2xl bg-white rounded-3xl"
  >
    <h1 className="text-xl text-center">Todo app</h1>
    <LoginForm :user="todoStore.user" @login="todoStore.setUser" @logout="todoStore.logout" />
    <TodoList v-if="todoStore.user" />
  </main>
</template>
