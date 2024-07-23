<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { DeleteIcon, CheckIcon, PlusIcon } from 'mdi-vue3';
import AsyncButton from './AsyncButton.vue';
import ButtonField from './ButtonField.vue';

const props = defineProps<{
  existingDescription?: string;
  onConfirm: (input: string) => Promise<void> | void;
  onCancelEdit?: () => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
}>();

const state = ref('');
const buttonField = ref<InstanceType<typeof ButtonField>>();

const isEditMode = computed(() => props.existingDescription !== undefined);
const placeholder = computed(() => (isEditMode.value ? 'Edit todo' : 'Add todo'));
const icon = computed(() => (!isEditMode.value ? PlusIcon : state.value ? CheckIcon : DeleteIcon));
const confirmTitle = computed(() =>
  !isEditMode.value ? 'Add todo' : state.value ? 'Save todo' : 'Delete todo',
);
const cancelTitle = computed(() => (!isEditMode.value ? 'Clear' : 'Cancel editing'));

watch(
  () => props.existingDescription,
  () => {
    state.value = props.existingDescription || '';
    if (state.value) {
      setTimeout(() => buttonField.value?.focus());
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
    ref="buttonField"
    v-model="state"
    :allowSaveWhenEmpty="isEditMode"
    :confirm-title="confirmTitle"
    :confirmButtonClass="isEditMode && !state ? 'bg-red-500' : undefined"
    @confirm="handleAction"
  >
    <template v-slot:inputRight>
      <AsyncButton
        @mousedown.prevent
        @click="handleCancel"
        :title="cancelTitle"
        :class="[
          'cursor-normal',
          !isEditMode && !state.trim() && 'invisible',
          isEditMode ? 'text-gray-500' : 'text-red-500',
        ]"
      >
        &times;
      </AsyncButton>
    </template>
    <template v-slot:button>
      <component :is="icon" class="h-6" />
    </template>
  </ButtonField>
</template>
