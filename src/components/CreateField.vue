<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'confirm', input: string): void
}>()

const state = ref('')

const handleAction = () => {
  const value = state.value.trim()
  if (value) {
    emit('confirm', value)
  }
  state.value = ''
}
</script>
<template>
  <div
    class="flex border border-solid border-gray-300 bg-white border-r-0 rounded-lg has-[input:focus]:outline-auto"
  >
    <input
      type="text"
      :placeholder="placeholder"
      v-model="state"
      class="border-0 focus:outline-0 bg-inherit rounded-l-lg p-1 flex-1"
      @keyup.enter="handleAction"
    />
    <button
      @mousedown.prevent
      @click="state = ''"
      class="text-red-500 rounded cursor-normal p-2"
      :class="{ 'opacity-0': [state.trim()] }"
    >
      &times;
    </button>
    <button @click="handleAction" class="px-4 py-2 bg-green-500 text-white rounded-r-lg">+</button>
  </div>
</template>
