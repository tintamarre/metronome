<script setup lang="ts">
import { BPM_MIN, BPM_MAX, BEATS_MIN, BEATS_MAX, OFFICIAL_TEMPOS, type SoundPreset } from '../types/metronome'

const getPreviousOfficialTempo = (currentBpm: number): number => {
  for (let i = OFFICIAL_TEMPOS.length - 1; i >= 0; i--) {
    if (OFFICIAL_TEMPOS[i]! < currentBpm) {
      return OFFICIAL_TEMPOS[i]!
    }
  }
  return OFFICIAL_TEMPOS[0]!
}

const getNextOfficialTempo = (currentBpm: number): number => {
  for (const tempo of OFFICIAL_TEMPOS) {
    if (tempo > currentBpm) {
      return tempo
    }
  }
  return OFFICIAL_TEMPOS[OFFICIAL_TEMPOS.length - 1]!
}

const props = defineProps<{
  bpm: number
  beats: number
  isPlaying: boolean
  accentEnabled: boolean
  soundPreset: string
  soundPresets: SoundPreset[]
  isOfficialTempo: boolean
}>()

const emit = defineEmits<{
  'update:bpm': [value: number]
  'update:beats': [value: number]
  'update:accentEnabled': [value: boolean]
  'update:soundPreset': [value: string]
  'toggle': []
}>()
</script>

<template>
  <div class="flex flex-col gap-2 w-full max-w-md mx-auto p-3">
    <!-- BPM Control -->
    <div class="flex flex-col gap-1">
      <div class="flex justify-between items-center">
        <label class="text-sm font-medium text-gray-600 dark:text-gray-300">BPM</label>
        <span
          class="text-2xl font-bold tabular-nums transition-colors duration-200"
          :style="isOfficialTempo ? { color: '#e76f51' } : {}"
          :class="{ 'text-beat': !isOfficialTempo }"
        >{{ bpm }}</span>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="emit('update:bpm', getPreviousOfficialTempo(props.bpm))"
          :disabled="props.bpm <= OFFICIAL_TEMPOS[0]!"
          class="w-10 h-10 rounded-lg font-bold text-lg transition-colors duration-200 flex items-center justify-center shrink-0"
          :class="props.bpm <= OFFICIAL_TEMPOS[0]!
            ? 'bg-gray-200 dark:bg-dark-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
            : 'bg-gray-200 dark:bg-dark-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-dark-600'"
        >
          &minus;
        </button>
        <input
          type="range"
          :min="BPM_MIN"
          :max="BPM_MAX"
          :value="bpm"
          @input="emit('update:bpm', parseInt(($event.target as HTMLInputElement).value))"
          class="w-full h-2 rounded-lg cursor-pointer"
        />
        <button
          @click="emit('update:bpm', getNextOfficialTempo(props.bpm))"
          :disabled="props.bpm >= OFFICIAL_TEMPOS[OFFICIAL_TEMPOS.length - 1]!"
          class="w-10 h-10 rounded-lg font-bold text-lg transition-colors duration-200 flex items-center justify-center shrink-0"
          :class="props.bpm >= OFFICIAL_TEMPOS[OFFICIAL_TEMPOS.length - 1]!
            ? 'bg-gray-200 dark:bg-dark-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
            : 'bg-gray-200 dark:bg-dark-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-dark-600'"
        >
          +
        </button>
      </div>
      <div class="flex justify-between text-xs text-gray-400 dark:text-gray-500">
        <span>{{ BPM_MIN }}</span>
        <span>{{ BPM_MAX }}</span>
      </div>
    </div>

    <!-- Beats Control -->
    <div class="flex flex-col gap-1">
      <div class="flex justify-between items-center">
        <label class="text-sm font-medium text-gray-600 dark:text-gray-300">Beats</label>
        <span class="text-2xl font-bold text-beat tabular-nums">{{ beats }}</span>
      </div>
      <input
        type="range"
        :min="BEATS_MIN"
        :max="BEATS_MAX"
        :value="beats"
        @input="emit('update:beats', parseInt(($event.target as HTMLInputElement).value))"
        class="w-full h-2 rounded-lg cursor-pointer"
      />
      <div class="flex justify-between text-xs text-gray-400 dark:text-gray-500">
        <span>{{ BEATS_MIN }}</span>
        <span>{{ BEATS_MAX }}</span>
      </div>
    </div>

    <!-- Sound Preset -->
    <div class="flex flex-col gap-1">
      <label class="text-sm font-medium text-gray-600 dark:text-gray-300">Sound</label>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="preset in soundPresets"
          :key="preset.id"
          @click="emit('update:soundPreset', preset.id)"
          class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
          :class="soundPreset === preset.id
            ? 'bg-beat text-white'
            : 'bg-gray-200 dark:bg-dark-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-dark-600'"
        >
          {{ preset.name }}
        </button>
      </div>
    </div>

    <!-- Accent Toggle -->
    <div class="flex items-center justify-between">
      <label class="text-sm font-medium text-gray-600 dark:text-gray-300">Accent first beat</label>
      <button
        @click="emit('update:accentEnabled', !accentEnabled)"
        class="relative w-12 h-7 rounded-full transition-colors duration-200"
        :class="accentEnabled ? 'bg-beat' : 'bg-gray-300 dark:bg-dark-700'"
      >
        <span
          class="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
          :class="accentEnabled ? 'translate-x-5' : 'translate-x-0'"
        />
      </button>
    </div>

    <!-- Start/Stop Button -->
    <button
      @click="emit('toggle')"
      class="w-full py-3 px-6 rounded-xl font-bold text-lg transition-all duration-200 touch-manipulation shadow-lg"
      :class="[
        isPlaying
          ? 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white'
          : 'bg-beat hover:bg-teal-600 active:bg-teal-700 text-white'
      ]"
    >
      {{ isPlaying ? 'Stop' : 'Start' }}
    </button>
  </div>
</template>
