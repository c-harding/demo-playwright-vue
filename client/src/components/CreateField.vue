<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { DeleteIcon, CheckIcon, PlusIcon } from 'mdi-vue3';

const props = defineProps<{
  placeholder?: string;
  existingDescription?: string;
}>();

const emit = defineEmits<{
  (e: 'confirm', input: string): void;
  (e: 'cancel-edit'): void;
  (e: 'delete'): void;
}>();

const state = ref('');
const input = ref<HTMLInputElement>();

const isEditMode = computed(() => props.existingDescription !== undefined);

watch(
  () => props.existingDescription,
  () => {
    state.value = props.existingDescription || '';
    if (state.value) {
      setTimeout(() => input.value?.focus());
    }
  },
  { immediate: true },
);

const handleCancel = () => {
  if (isEditMode.value) {
    emit('cancel-edit');
  } else {
    state.value = '';
  }
};

const handleAction = () => {
  const value = state.value.trim();
  if (value) {
    emit('confirm', value);
  }
  state.value = '';
};
</script>
<template>
  <div
    class="flex border border-solid border-gray-300 bg-white border-r-0 rounded-lg has-[input:focus]:outline-auto"
  >
    <input
      ref="input"
      type="text"
      :placeholder="placeholder"
      v-model="state"
      class="border-0 focus:outline-0 bg-inherit rounded-l-lg p-1 flex-1"
      @keyup.enter="handleAction"
    />
    <button
      @mousedown.prevent
      @click="handleCancel"
      class="cursor-normal p-2"
      :class="{
        'opacity-0': !state.trim(),
        'text-red-500': !isEditMode,
        'text-gray-500': isEditMode,
      }"
    >
      &times;
    </button>
    <button
      v-if="!isEditMode"
      @click="handleAction"
      class="px-4 py-2 bg-green-500 text-white rounded-r-lg"
    >
      <PlusIcon class="h-4" />
    </button>
    <button
      v-else-if="state"
      @click="handleAction"
      class="px-4 py-2 bg-green-500 text-white rounded-r-lg"
    >
      <CheckIcon class="h-4" />
    </button>
    <button v-else @click="emit('delete')" class="px-4 py-2 bg-red-500 text-white rounded-r-lg">
      <DeleteIcon class="h-4" />
    </button>
  </div>
</template>
