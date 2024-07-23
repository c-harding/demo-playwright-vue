<script setup lang="ts">
import { type Todo } from '@/stores/todos';
import {
  CheckboxBlankCircleOutlineIcon,
  CheckboxMarkedCircleOutlineIcon,
  DeleteIcon,
  PencilIcon,
} from 'mdi-vue3';
import RelativeTime from './RelativeTime.vue';
import AsyncButton from './AsyncButton.vue';

defineProps<{
  todo: Todo;
  onToggleDone: () => Promise<void> | void;
  onEdit: () => Promise<void> | void;
  onDelete: () => Promise<void> | void;
}>();
</script>

<template>
  <div class="flex hover:bg-gray-200 items-center rounded-lg">
    <AsyncButton
      class="text-gray-500 hover:text-blue-500 p-2"
      :title="todo.completionTime ? 'Mark as incomplete' : 'Mark as complete'"
      @click="onToggleDone"
    >
      <CheckboxMarkedCircleOutlineIcon v-if="todo.completionTime" class="h-6" />
      <CheckboxBlankCircleOutlineIcon v-else class="h-6" />
    </AsyncButton>

    <div class="flex-1 m-2 flex flex-col gap-1">
      <div :class="{ 'line-through': todo.completionTime }" @dblclick="onEdit">
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

    <button class="text-gray-500 hover:text-blue-500 p-2" @click="onEdit">
      <PencilIcon class="h-6" />
    </button>

    <button class="text-gray-500 hover:text-red-500 p-2" @click="onDelete">
      <DeleteIcon class="h-6" />
    </button>
  </div>
</template>
