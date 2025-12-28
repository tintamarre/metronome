<script setup lang="ts">
defineProps<{
  tempoName: string
  bpm: number
  iteration: number
  beats: number
}>()
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <!-- Tempo Name -->
    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
      {{ tempoName }}
    </h2>

    <!-- Stats Row -->
    <div class="flex gap-6 text-center">
      <!-- BPM -->
      <div class="flex flex-col">
        <span class="text-2xl md:text-3xl font-bold text-beat tabular-nums">{{ bpm }}</span>
        <span class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">BPM</span>
      </div>

      <!-- Divider -->
      <div class="w-px bg-gray-300 dark:bg-gray-700"></div>

      <!-- Time Signature -->
      <div class="flex flex-col">
        <span class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tabular-nums">{{ beats }}/4</span>
        <span class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">Time</span>
      </div>

      <!-- Divider -->
      <div class="w-px bg-gray-300 dark:bg-gray-700"></div>

      <!-- Iteration -->
      <div class="flex flex-col">
        <span class="text-2xl md:text-3xl font-bold text-gray-500 dark:text-gray-400 tabular-nums">{{ iteration }}</span>
        <span class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">Bars</span>
      </div>
    </div>
  </div>
</template>
