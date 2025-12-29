<script setup lang="ts">
import GuitarStringSelector from './GuitarStringSelector.vue'
import { GUITAR_TUNINGS, type TunerMode, type GuitarTuning } from '../../types/tuner'

defineProps<{
  mode: TunerMode
  selectedTuningId: string
  selectedStringIndex: number | null
  detectedStringIndex: number | null
  currentTuning: GuitarTuning
  referenceToneEnabled: boolean
  isListening: boolean
}>()

defineEmits<{
  'update:mode': [value: TunerMode]
  'update:selectedTuningId': [value: string]
  'update:selectedStringIndex': [value: number | null]
  'update:referenceToneEnabled': [value: boolean]
  toggle: []
}>()
</script>

<template>
  <div class="flex flex-col gap-3 w-full max-w-md mx-auto p-3">
    <!-- Mode Selector -->
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-600 dark:text-gray-300">Mode</label>
      <div class="flex gap-2">
        <button
          @click="$emit('update:mode', 'chromatic')"
          class="flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-200"
          :class="
            mode === 'chromatic'
              ? 'bg-beat text-white'
              : 'bg-gray-200 dark:bg-dark-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-dark-600'
          "
        >
          Chromatic
        </button>
        <button
          @click="$emit('update:mode', 'guitar')"
          class="flex-1 py-2 px-4 rounded-lg font-medium transition-colors duration-200"
          :class="
            mode === 'guitar'
              ? 'bg-beat text-white'
              : 'bg-gray-200 dark:bg-dark-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-dark-600'
          "
        >
          Guitar
        </button>
      </div>
    </div>

    <!-- Guitar Tuning Selector (only in guitar mode) -->
    <template v-if="mode === 'guitar'">
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-gray-600 dark:text-gray-300">Tuning</label>
        <select
          :value="selectedTuningId"
          @change="$emit('update:selectedTuningId', ($event.target as HTMLSelectElement).value)"
          class="w-full p-3 rounded-lg bg-gray-200 dark:bg-dark-700 text-gray-900 dark:text-white border-0 focus:ring-2 focus:ring-beat"
        >
          <option v-for="tuning in GUITAR_TUNINGS" :key="tuning.id" :value="tuning.id">
            {{ tuning.name }}
          </option>
        </select>
      </div>

      <!-- String Selector -->
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-gray-600 dark:text-gray-300">String</label>
        <GuitarStringSelector
          :strings="currentTuning.strings"
          :selected-string="selectedStringIndex"
          :detected-string="detectedStringIndex"
          @select="$emit('update:selectedStringIndex', $event)"
        />
      </div>
    </template>

    <!-- Reference Tone Toggle -->
    <div class="flex items-center justify-between">
      <label class="text-sm font-medium text-gray-600 dark:text-gray-300">Reference tone</label>
      <button
        @click="$emit('update:referenceToneEnabled', !referenceToneEnabled)"
        class="relative w-12 h-7 rounded-full transition-colors duration-200"
        :class="referenceToneEnabled ? 'bg-beat' : 'bg-gray-300 dark:bg-dark-700'"
      >
        <span
          class="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
          :class="referenceToneEnabled ? 'translate-x-5' : 'translate-x-0'"
        />
      </button>
    </div>

    <!-- Start/Stop Button -->
    <button
      @click="$emit('toggle')"
      class="w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 touch-manipulation shadow-lg"
      :class="[
        isListening
          ? 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white'
          : 'bg-beat hover:bg-teal-600 active:bg-teal-700 text-white',
      ]"
    >
      {{ isListening ? 'Stop' : 'Start Tuning' }}
    </button>
  </div>
</template>
