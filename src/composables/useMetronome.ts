import { ref, computed, watch } from 'vue'
import { useAudioEngine } from './useAudioEngine'
import { useTempoNames } from './useTempoNames'
import { BPM_DEFAULT, BEATS_DEFAULT } from '../types/metronome'

export function useMetronome() {
  // State
  const bpm = ref(BPM_DEFAULT)
  const beats = ref(BEATS_DEFAULT)
  const isPlaying = ref(false)
  const currentBeat = ref(0)
  const iteration = ref(0)
  const accentEnabled = ref(true)

  // Audio engine
  const audioEngine = useAudioEngine()

  // Tempo name
  const { tempoName } = useTempoNames(bpm)

  // Computed: beat interval in seconds
  const beatInterval = computed(() => 60 / bpm.value)

  // Computed: beat interval in milliseconds
  const beatIntervalMs = computed(() => beatInterval.value * 1000)

  // Scheduler reference
  let scheduler: ReturnType<typeof audioEngine.createScheduler> | null = null

  // Handle beat callback
  function onBeat(beatIndex: number) {
    currentBeat.value = beatIndex
    if (beatIndex === 0 && isPlaying.value) {
      // Don't increment on the very first beat
      if (iteration.value > 0 || currentBeat.value > 0) {
        // Only increment when we loop back to beat 0
      }
    }
    // Increment iteration when we complete a full cycle
    if (beatIndex === 0 && currentBeat.value === 0) {
      iteration.value++
    }
  }

  // Watch for beats changes to recreate scheduler
  watch(beats, () => {
    if (scheduler && isPlaying.value) {
      scheduler.reset()
    }
  })

  // Start metronome
  async function start() {
    // Initialize audio on first start (user gesture)
    if (!audioEngine.isInitialized.value) {
      await audioEngine.initialize()
    } else {
      // Resume if needed (iOS)
      await audioEngine.resume()
    }

    // Reset state
    currentBeat.value = 0
    iteration.value = 0

    // Create and start scheduler
    scheduler = audioEngine.createScheduler(
      () => beatInterval.value,
      () => beats.value,
      () => accentEnabled.value,
      onBeat
    )
    scheduler.start()
    isPlaying.value = true
  }

  // Stop metronome
  function stop() {
    if (scheduler) {
      scheduler.stop()
      scheduler = null
    }
    isPlaying.value = false
    currentBeat.value = 0
  }

  // Toggle play/stop
  async function toggle() {
    if (isPlaying.value) {
      stop()
    } else {
      await start()
    }
  }

  return {
    // State
    bpm,
    beats,
    isPlaying,
    currentBeat,
    iteration,
    accentEnabled,

    // Computed
    tempoName,
    beatIntervalMs,

    // Methods
    start,
    stop,
    toggle,

    // Audio engine (for manual control if needed)
    isAudioInitialized: audioEngine.isInitialized,
  }
}
