<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { DeleteIcon, CheckIcon, PlusIcon } from 'mdi-vue3';
import AsyncButton from './AsyncButton.vue';
import ButtonField from './ButtonField.vue';

const props = defineProps<{
  placeholder?: string;
  existingDescription?: string;
  onConfirm: (input: string) => Promise<void> | void;
  onCancelEdit?: () => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
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

const handleCancel = async () => {
  if (isEditMode.value) {
    await props.onCancelEdit?.();
  } else {
    state.value = '';
  }
};

const handleAction = async () => {
  const value = state.value.trim();
  if (value) {
    await props.onConfirm(value);
  } else if (isEditMode.value) {
    props.onDelete?.();
  }
  state.value = '';
};
</script>
<template>
  <ButtonField
    :placeholder="placeholder"
    v-model="state"
    :allowSaveWhenEmpty="isEditMode"
    :submitButtonClass="isEditMode && !state ? 'bg-red-500' : undefined"
    @confirm="handleAction"
  >
    <template v-slot:inputRight>
      <AsyncButton
        @mousedown.prevent
        @click="handleCancel"
        class="cursor-normal p-2"
        :class="[
          { invisible: !isEditMode && !state.trim() },
          isEditMode ? 'text-gray-500' : 'text-red-500',
        ]"
      >
        &times;
      </AsyncButton>
    </template>
    <template v-slot:button>
      <PlusIcon v-if="!isEditMode" class="h-6" />
      <CheckIcon v-else-if="state" class="h-6" />
      <DeleteIcon v-else class="h-6" />
    </template>
  </ButtonField>
</template>
