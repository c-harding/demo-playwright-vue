<script lang="ts">
import { provide, readonly, ref, type InjectionKey, type Ref } from 'vue';

export const asyncFormLoadingInjectionKey: InjectionKey<Readonly<Ref<boolean>>> =
  Symbol('AsyncFormLoading');
</script>

<script setup lang="ts">
const props = defineProps<{
  onSubmit: () => void | Promise<void>;
}>();

const loading = ref(false);

provide(asyncFormLoadingInjectionKey, readonly(loading));

const handleSubmit = async () => {
  loading.value = true;
  try {
    await props.onSubmit();
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <form @submit.prevent="handleSubmit">
    <slot />
  </form>
</template>
