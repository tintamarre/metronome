<script setup lang="ts">
defineProps<{
  activeTab: 'metronome' | 'tuner'
}>()

defineEmits<{
  'update:activeTab': [value: 'metronome' | 'tuner']
}>()
</script>

<template>
  <div class="flex gap-2 p-1 bg-gray-200 dark:bg-dark-800 rounded-lg">
    <button
      @click="$emit('update:activeTab', 'metronome')"
      class="flex-1 py-2 px-4 rounded-md font-medium transition-colors duration-200"
      :class="
        activeTab === 'metronome'
          ? 'bg-white dark:bg-dark-700 text-gray-900 dark:text-white shadow-sm'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
      "
    >
      Metronome
    </button>
    <button
      @click="$emit('update:activeTab', 'tuner')"
      class="flex-1 py-2 px-4 rounded-md font-medium transition-colors duration-200"
      :class="
        activeTab === 'tuner'
          ? 'bg-white dark:bg-dark-700 text-gray-900 dark:text-white shadow-sm'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
      "
    >
      Tuner
    </button>
  </div>
</template>
