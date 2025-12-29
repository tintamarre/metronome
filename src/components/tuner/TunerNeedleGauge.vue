<script setup lang="ts">
import { computed } from 'vue'
import { CENTS_TOLERANCE } from '../../types/tuner'

const props = defineProps<{
  cents: number
  isActive: boolean
}>()

// Needle rotation: -50 cents = -45deg, +50 cents = +45deg
const needleRotation = computed(() => {
  const clampedCents = Math.max(-50, Math.min(50, props.cents))
  return (clampedCents / 50) * 45
})

const isInTune = computed(() => {
  return props.isActive && Math.abs(props.cents) <= CENTS_TOLERANCE
})

// Generate tick marks
const tickMarks = [-50, -25, 0, 25, 50]
</script>

<template>
  <div class="relative w-full max-w-xs mx-auto">
    <svg viewBox="0 0 200 110" class="w-full">
      <!-- Background arc -->
      <path
        d="M 20 100 A 80 80 0 0 1 180 100"
        fill="none"
        stroke="currentColor"
        stroke-width="8"
        class="text-gray-200 dark:text-dark-700"
      />

      <!-- In-tune zone (green area) -->
      <path
        d="M 91 23 A 80 80 0 0 1 109 23"
        fill="none"
        stroke="currentColor"
        stroke-width="10"
        class="text-green-400/50 dark:text-green-500/50"
      />

      <!-- Tick marks and labels -->
      <g v-for="tick in tickMarks" :key="tick">
        <line
          :x1="100 + 70 * Math.cos(((tick / 50) * 45 - 90) * (Math.PI / 180))"
          :y1="100 + 70 * Math.sin(((tick / 50) * 45 - 90) * (Math.PI / 180))"
          :x2="100 + 80 * Math.cos(((tick / 50) * 45 - 90) * (Math.PI / 180))"
          :y2="100 + 80 * Math.sin(((tick / 50) * 45 - 90) * (Math.PI / 180))"
          stroke="currentColor"
          stroke-width="2"
          class="text-gray-400 dark:text-gray-500"
        />
        <text
          :x="100 + 58 * Math.cos(((tick / 50) * 45 - 90) * (Math.PI / 180))"
          :y="100 + 58 * Math.sin(((tick / 50) * 45 - 90) * (Math.PI / 180))"
          text-anchor="middle"
          dominant-baseline="middle"
          class="text-[10px] fill-gray-400 dark:fill-gray-500"
        >
          {{ tick === 0 ? '0' : tick > 0 ? `+${tick}` : tick }}
        </text>
      </g>

      <!-- Flat/Sharp labels -->
      <text x="35" y="95" class="text-xs fill-gray-500 dark:fill-gray-400" text-anchor="middle">
        FLAT
      </text>
      <text x="165" y="95" class="text-xs fill-gray-500 dark:fill-gray-400" text-anchor="middle">
        SHARP
      </text>

      <!-- Needle -->
      <g :style="{ transform: `rotate(${needleRotation}deg)`, transformOrigin: '100px 100px' }" class="transition-transform duration-100">
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="30"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          :class="isInTune ? 'text-green-500' : isActive ? 'text-beat' : 'text-gray-400 dark:text-gray-600'"
        />
      </g>

      <!-- Center pivot -->
      <circle
        cx="100"
        cy="100"
        r="8"
        fill="currentColor"
        :class="isInTune ? 'text-green-500' : isActive ? 'text-beat' : 'text-gray-400 dark:text-gray-600'"
      />
    </svg>
  </div>
</template>
