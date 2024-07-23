<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { LoadingIcon } from 'mdi-vue3';
import { asyncFormLoadingInjectionKey } from './AsyncForm.vue';

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    loading?: boolean;
    loadingClass?: string;
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
    class="grid [&>*]:[grid-area:1/1]"
    @click="handleClick"
  >
    <LoadingIcon v-if="loading" :class="[loadingClass ?? 'h-6', 'animate-spin m-auto']" />
    <div :class="{ invisible: loading }"><slot /></div>
  </button>
</template>
