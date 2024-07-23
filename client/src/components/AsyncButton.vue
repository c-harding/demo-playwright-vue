<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { LoadingIcon } from 'mdi-vue3';
import { asyncFormLoadingInjectionKey } from './AsyncForm.vue';
import { twMerge, type ClassNameValue } from 'tailwind-merge';

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    class?: ClassNameValue;
    loading?: boolean;
    loadingClass?: ClassNameValue;
    onClick?: () => void | Promise<void>;
    type?: 'submit' | 'reset' | 'button';
  }>(),
  {
    loading: undefined,
    disabled: false,
    type: 'button',
  },
);

const internalLoading = ref(false);
const formLoading = inject(asyncFormLoadingInjectionKey, undefined);
const formLoadingIfSubmit = computed(() =>
  props.type === 'submit' ? formLoading?.value : undefined,
);
const loading = computed<boolean>(
  () => props.loading ?? (formLoadingIfSubmit.value || internalLoading.value),
);

const handleClick = async () => {
  internalLoading.value = true;
  try {
    await props.onClick?.();
  } finally {
    internalLoading.value = false;
  }
};
</script>
<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="twMerge('grid [&>*]:[grid-area:1/1] p-2 rounded-lg', props.class)"
    @click="handleClick"
  >
    <LoadingIcon v-if="loading" :class="twMerge('animate-spin m-auto h-6', loadingClass)" />
    <div :class="loading && 'invisible'"><slot /></div>
  </button>
</template>
