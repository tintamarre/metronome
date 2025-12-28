<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
  beats: number
  currentBeat: number
  isPlaying: boolean
  accentEnabled: boolean
  beatIntervalMs: number
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

// Animation state
const progressPosition = ref(0)
let animationFrameId: number | null = null
let beatStartTime = 0

// Animate the progress line
function animateProgress(timestamp: number) {
  if (!props.isPlaying) {
    progressPosition.value = 0
    return
  }

  const elapsed = timestamp - beatStartTime
  const progress = Math.min(elapsed / props.beatIntervalMs, 1)

  // Calculate position: from current beat towards next beat
  const currentX = props.currentBeat * CIRCLE_SPACING
  const nextX = Math.min((props.currentBeat + 1) * CIRCLE_SPACING, (props.beats - 1) * CIRCLE_SPACING)

  progressPosition.value = currentX + (nextX - currentX) * progress

  animationFrameId = requestAnimationFrame(animateProgress)
}

// Watch for beat changes to reset animation timing
watch(() => props.currentBeat, () => {
  beatStartTime = performance.now()
})

// Watch for play state changes
watch(() => props.isPlaying, (playing) => {
  if (playing) {
    beatStartTime = performance.now()
    animationFrameId = requestAnimationFrame(animateProgress)
  } else {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
    progressPosition.value = 0
  }
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})

// Progress line end position
const progressLineX2 = computed(() => {
  return PADDING + progressPosition.value
})

// Progress line color (matches the beat color)
const progressLineColor = computed(() => {
  if (props.accentEnabled && props.currentBeat === 0) {
    return '#e76f51'
  }
  return '#2a9d8f'
})

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
      <!-- Background line -->
      <line
        :x1="PADDING"
        y1="60"
        :x2="PADDING + (beats - 1) * CIRCLE_SPACING"
        y2="60"
        :stroke="lineColor"
        stroke-width="3"
        stroke-linecap="round"
      />

      <!-- Progress line -->
      <line
        v-if="isPlaying && beats > 1"
        :x1="PADDING"
        y1="60"
        :x2="progressLineX2"
        y2="60"
        :stroke="progressLineColor"
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
