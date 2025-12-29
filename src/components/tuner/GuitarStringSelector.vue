<script setup lang="ts">
import type { NoteInfo } from '../../types/tuner'

defineProps<{
  strings: NoteInfo[]
  selectedString: number | null
  detectedString: number | null
}>()

defineEmits<{
  select: [index: number]
}>()
</script>

<template>
  <div class="flex justify-center gap-2 py-3">
    <button
      v-for="(string, index) in strings"
      :key="index"
      @click="$emit('select', index)"
      class="flex flex-col items-center gap-1 group"
    >
      <div
        class="w-11 h-11 rounded-full flex items-center justify-center font-bold text-base border-2 transition-all duration-200"
        :class="[
          selectedString === index
            ? 'bg-beat border-beat text-white scale-110'
            : detectedString === index
              ? 'bg-beat/20 border-beat text-beat'
              : 'bg-gray-100 dark:bg-dark-700 border-gray-300 dark:border-dark-600 text-gray-600 dark:text-gray-300 group-hover:border-beat group-hover:text-beat',
        ]"
      >
        {{ string.name }}
      </div>
      <span class="text-xs text-gray-400 dark:text-gray-500 tabular-nums">
        {{ string.octave }}
      </span>
    </button>
  </div>
</template>
