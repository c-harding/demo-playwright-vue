<script setup lang="ts">
import AsyncForm from './AsyncForm.vue';
import AsyncButton from './AsyncButton.vue';
import { twMerge } from 'tailwind-merge';
import { ref } from 'vue';

defineProps<{
  placeholder?: string;
  inputTitle?: string;
  confirmTitle?: string;
  allowSaveWhenEmpty?: boolean;
  autofocus?: boolean;
  confirmButtonClass?: string;
  onConfirm(value: string): Promise<void> | void;
}>();

defineSlots<{
  inputRight?: () => void;
  button(): void;
}>();

const input = ref<HTMLInputElement>();

const focus = () => {
  input.value?.focus();
};

defineExpose({ focus });

const value = defineModel<string>({ default: '' });
</script>
<template>
  <AsyncForm
    class="flex border border-solid border-gray-300 bg-white rounded-lg has-[input:focus]:outline outline-offset-1 outline-blue-400"
    @submit="onConfirm(value)"
  >
    <label class="flex flex-1 cursor-text">
      <input
        ref="input"
        type="text"
        :placeholder="placeholder"
        :title="inputTitle ?? placeholder"
        v-model="value"
        size="1"
        class="border-0 focus:outline-0 bg-inherit rounded-l-lg p-1 flex-1"
      />
      <slot name="inputRight" />
    </label>
    <AsyncButton
      type="submit"
      :disabled="!allowSaveWhenEmpty && !value"
      :title="confirmTitle"
      :class="
        twMerge(
          'px-4 bg-green-500 disabled:bg-gray-400 text-white rounded-l-none -m-px ms-0',
          confirmButtonClass,
        )
      "
    >
      <slot name="button" />
    </AsyncButton>
  </AsyncForm>
</template>
