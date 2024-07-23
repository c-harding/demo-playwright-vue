<script setup lang="ts">
import AsyncForm from './AsyncForm.vue';
import AsyncButton from './AsyncButton.vue';

defineProps<{
  placeholder?: string;
  allowSaveWhenEmpty?: boolean;
  cancelButtonClass?: string;
  submitButtonClass?: string;
  onConfirm(value: string): Promise<void> | void;
}>();

defineSlots<{
  inputRight?: () => void;
  button(): void;
}>();

const value = defineModel<string>({ default: '' });
</script>
<template>
  <AsyncForm
    class="flex border border-solid border-gray-300 bg-white border-r-0 rounded-lg has-[input:focus]:outline-auto"
    @submit="onConfirm(value)"
  >
    <label class="flex flex-1 cursor-text">
      <input
        ref="input"
        type="text"
        :placeholder="placeholder"
        v-model="value"
        class="border-0 focus:outline-0 bg-inherit rounded-l-lg p-1 flex-1"
      />
      <slot name="inputRight" />
    </label>
    <AsyncButton
      type="submit"
      :disabled="!allowSaveWhenEmpty && !value"
      class="px-4 py-2 disabled:bg-gray-400 text-white rounded-r-lg"
      :class="[submitButtonClass ?? 'bg-green-500']"
    >
      <slot name="button" />
    </AsyncButton>
  </AsyncForm>
</template>
