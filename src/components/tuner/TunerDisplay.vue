<script setup lang="ts">
import { computed } from 'vue'
import TunerNeedleGauge from './TunerNeedleGauge.vue'
import { CENTS_TOLERANCE, SOLFEGE_NAMES } from '../../types/tuner'

const props = defineProps<{
  noteName: string | null
  octave: number | null
  cents: number
  frequency: number | null
  isListening: boolean
  signalStrength: number
}>()

const solfegeName = computed(() => {
  if (!props.noteName) return null
  return SOLFEGE_NAMES[props.noteName] ?? props.noteName
})

const centsDisplay = computed(() => {
  if (!props.isListening || props.noteName === null) return '--'
  const sign = props.cents > 0 ? '+' : ''
  return `${sign}${props.cents}`
})

const isInTune = computed(() => {
  return props.isListening && props.noteName !== null && Math.abs(props.cents) <= CENTS_TOLERANCE
})

const centsColorClass = computed(() => {
  if (!props.isListening || props.noteName === null) return 'text-gray-400 dark:text-gray-500'
  if (isInTune.value) return 'text-green-500'
  return props.cents < 0 ? 'text-orange-500' : 'text-red-500'
})
</script>

<template>
  <div class="flex flex-col items-center gap-1 w-full max-w-md mx-auto">
    <!-- Note Name -->
    <div class="flex flex-col items-center">
      <div class="flex items-baseline gap-1">
        <h2
          class="text-6xl font-bold transition-colors duration-200"
          :class="isInTune ? 'text-green-500' : 'text-gray-900 dark:text-white'"
        >
          {{ noteName ?? '--' }}
        </h2>
        <span
          v-if="octave !== null"
          class="text-2xl font-medium text-gray-400 dark:text-gray-500"
        >
          {{ octave }}
        </span>
      </div>
      <div
        class="text-xl font-medium transition-colors duration-200"
        :class="isInTune ? 'text-green-500/70' : 'text-gray-500 dark:text-gray-400'"
      >
        {{ solfegeName ?? '--' }}
      </div>
    </div>

    <!-- Needle Gauge -->
    <TunerNeedleGauge :cents="cents" :is-active="isListening && noteName !== null" />

    <!-- Cents and Frequency -->
    <div class="flex items-baseline gap-3">
      <div class="text-xl font-semibold tabular-nums transition-colors duration-200" :class="centsColorClass">
        {{ centsDisplay }} <span class="text-sm font-normal">cents</span>
      </div>
      <div class="text-sm text-gray-400 dark:text-gray-500 tabular-nums">
        {{ frequency !== null ? frequency.toFixed(1) : '---' }} Hz
      </div>
    </div>

    <!-- Signal Strength (compact) -->
    <div class="w-32">
      <div class="w-full h-1.5 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-100"
          :class="signalStrength > 0.3 ? 'bg-beat' : 'bg-gray-400 dark:bg-gray-600'"
          :style="{ width: `${signalStrength * 100}%` }"
        />
      </div>
    </div>
  </div>
</template>
