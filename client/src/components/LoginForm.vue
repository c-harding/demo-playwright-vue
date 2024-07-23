<script setup lang="ts">
import { ref } from 'vue';
import AsyncButton from './AsyncButton.vue';
import ButtonField from './ButtonField.vue';

const props = defineProps<{
  user?: string;
  onLogin?: (username: string) => void | Promise<void>;
  onLogout?: () => void | Promise<void>;
}>();

const username = ref();

const onLogin = async () => {
  await props.onLogin?.(username.value);
  username.value = '';
};
</script>

<template>
  <ButtonField placeholder="Username" v-model.trim="username" @confirm="onLogin" v-if="!user">
    <template v-slot:button>Log in</template>
  </ButtonField>
  <div class="flex flex-col self-end items-end" v-if="user">
    <p>
      Logged in as: <code>{{ user }}</code>
    </p>
    <AsyncButton class="rounded bg-blue-300 text-black px-2 py-1" @click="props.onLogout?.()">
      Log out
    </AsyncButton>
  </div>
</template>
