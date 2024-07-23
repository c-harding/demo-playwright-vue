<script setup lang="ts">
import LoginForm from './components/LoginForm.vue';
import TodoList from './components/TodoList.vue';
import { useTodoStore } from './stores/todos';

const todoStore = useTodoStore();
</script>

<template>
  <main className="flex min-h-screen flex-col gap-8 p-12 max-w-[96em] mx-auto">
    <h1 className="text-xl text-center">Todo app</h1>
    <LoginForm :user="todoStore.user" @login="todoStore.setUser" @logout="todoStore.logout" />
    <TodoList v-if="todoStore.user" />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
