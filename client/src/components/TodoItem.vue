<script setup lang="ts">
import { type Todo } from '@/stores/todos';
import {
  CheckboxBlankCircleOutlineIcon,
  CheckboxMarkedCircleOutlineIcon,
  DeleteIcon,
} from 'mdi-vue3';
import RelativeTime from './RelativeTime.vue';

defineProps<{
  todo: Todo;
}>();

const emit = defineEmits<{
  (e: 'delete'): void;
  (e: 'edit'): void;
  (e: 'toggle-done'): void;
}>();
</script>

<template>
  <div class="flex hover:bg-gray-200 items-center rounded-lg">
    <div class="flex-1 m-2 flex flex-col gap-1">
      <div :class="{ 'line-through': todo.completionTime }" @dblclick="emit('edit')">
        {{ todo.description }}
      </div>
      <div class="text-xs text-gray-500">
        <RelativeTime :datetime="todo.time" />
        <span v-if="todo.editedTime"> · edited <RelativeTime :datetime="todo.editedTime" /></span>
        <span v-if="todo.completionTime">
          · completed <RelativeTime :datetime="todo.completionTime"
        /></span>
      </div>
    </div>
    <button class="text-gray-500 hover:text-blue-500 p-2" @click="emit('toggle-done')">
      <CheckboxMarkedCircleOutlineIcon v-if="todo.completionTime" class="h-6" />
      <CheckboxBlankCircleOutlineIcon v-else class="h-6" />
    </button>
    <button class="text-gray-500 hover:text-red-500 p-2" @click="emit('delete')">
      <DeleteIcon class="h-6" />
    </button>
  </div>
</template>
