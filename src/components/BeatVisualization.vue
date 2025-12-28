<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

const props = defineProps<{
  beats: number
  currentBeat: number
  isPlaying: boolean
  accentEnabled: boolean
}>()

// Circle configuration
const CIRCLE_RADIUS = 24
const CIRCLE_SPACING = 80
const PADDING = 40

// Track if we're in dark mode
const isDark = ref(true)

onMounted(() => {
  // Check initial state
  isDark.value = document.documentElement.classList.contains('dark')

  // Watch for changes
  const observer = new MutationObserver(() => {
    isDark.value = document.documentElement.classList.contains('dark')
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

// Computed SVG width
const svgWidth = computed(() => PADDING * 2 + (props.beats - 1) * CIRCLE_SPACING)

// Generate beat circles
const circles = computed(() => {
  return Array.from({ length: props.beats }, (_, i) => ({
    index: i,
    cx: PADDING + i * CIRCLE_SPACING,
    cy: 60,
    isAccent: props.accentEnabled && i === 0,
    isActive: props.isPlaying && props.currentBeat === i,
  }))
})

// Line color based on theme
const lineColor = computed(() => isDark.value ? '#2a2a2a' : '#d1d5db')

// Get circle fill color
function getCircleFill(circle: { isAccent: boolean; isActive: boolean }): string {
  if (circle.isAccent) {
    return circle.isActive ? '#ff8a65' : '#e76f51'
  }
  if (circle.isActive) {
    return '#2a9d8f'
  }
  return isDark.value ? '#1a1a1a' : '#f3f4f6'
}

// Get circle stroke color
function getCircleStroke(circle: { isAccent: boolean; isActive: boolean }): string {
  if (circle.isAccent) {
    return '#e76f51'
  }
  return '#2a9d8f'
}

// Get text fill color
function getTextFill(circle: { isAccent: boolean; isActive: boolean }): string {
  if (circle.isAccent || circle.isActive) {
    return '#fff'
  }
  return isDark.value ? '#888' : '#6b7280'
}

// Get circle scale
function getCircleTransform(circle: { isActive: boolean }, cx: number, cy: number): string {
  if (circle.isActive) {
    return `translate(${cx}, ${cy}) scale(1.15) translate(${-cx}, ${-cy})`
  }
  return ''
}
</script>

<template>
  <div class="w-full overflow-x-auto py-2">
    <svg
      :width="svgWidth"
      height="100"
      class="mx-auto block"
      :viewBox="`0 0 ${svgWidth} 100`"
    >
      <!-- Connecting line -->
      <line
        :x1="PADDING"
        y1="60"
        :x2="PADDING + (beats - 1) * CIRCLE_SPACING"
        y2="60"
        :stroke="lineColor"
        stroke-width="3"
        stroke-linecap="round"
      />

      <!-- Beat circles -->
      <g v-for="circle in circles" :key="circle.index">
        <!-- Outer glow for active beat -->
        <circle
          v-if="circle.isActive"
          :cx="circle.cx"
          :cy="circle.cy"
          :r="CIRCLE_RADIUS + 8"
          :fill="circle.isAccent ? 'rgba(231, 111, 81, 0.3)' : 'rgba(42, 157, 143, 0.3)'"
          class="transition-all duration-75"
        />

        <!-- Main circle -->
        <circle
          :cx="circle.cx"
          :cy="circle.cy"
          :r="CIRCLE_RADIUS"
          :fill="getCircleFill(circle)"
          :stroke="getCircleStroke(circle)"
          stroke-width="3"
          :transform="getCircleTransform(circle, circle.cx, circle.cy)"
          class="transition-all duration-75"
        />

        <!-- Beat number -->
        <text
          :x="circle.cx"
          :y="circle.cy"
          text-anchor="middle"
          dominant-baseline="central"
          class="text-sm font-bold select-none pointer-events-none"
          :fill="getTextFill(circle)"
          :transform="getCircleTransform(circle, circle.cx, circle.cy)"
        >
          {{ circle.index + 1 }}
        </text>
      </g>
    </svg>
  </div>
</template>
