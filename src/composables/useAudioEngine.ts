import { ref, shallowRef } from 'vue'
import { SOUND_PRESETS, DEFAULT_SOUND_PRESET, type ClickConfig } from '../types/metronome'

const SAMPLE_RATE = 44100
const SCHEDULE_AHEAD_TIME = 0.1 // 100ms look-ahead
const SCHEDULER_INTERVAL = 25 // 25ms

export function useAudioEngine() {
  const audioContext = shallowRef<AudioContext | null>(null)
  const accentBuffer = shallowRef<AudioBuffer | null>(null)
  const regularBuffer = shallowRef<AudioBuffer | null>(null)
  const isInitialized = ref(false)
  const currentPresetId = ref(DEFAULT_SOUND_PRESET)

  /**
   * Generate a click sound buffer using the same synthesis as the Python version
   */
  async function createClickBuffer(config: ClickConfig): Promise<AudioBuffer> {
    const numSamples = Math.floor(config.duration * SAMPLE_RATE)
    const offlineCtx = new OfflineAudioContext(1, numSamples, SAMPLE_RATE)

    // Create a buffer to hold our synthesized sound
    const buffer = offlineCtx.createBuffer(1, numSamples, SAMPLE_RATE)
    const data = buffer.getChannelData(0)

    // Generate time array
    for (let i = 0; i < numSamples; i++) {
      const t = i / SAMPLE_RATE

      // Main envelope (exponential decay)
      const envelope = Math.exp(-config.decayRate * t)

      // Sum harmonic components (sine waves at different frequencies)
      let harmonics = 0
      for (let j = 0; j < config.frequencies.length; j++) {
        const freq = config.frequencies[j]!
        const weight = config.weights[j]!
        harmonics += weight * Math.sin(2 * Math.PI * freq * t)
      }

      // Noise burst for percussive attack (faster decay)
      const noiseEnvelope = Math.exp(-300 * t)
      const noise = (Math.random() * 0.6 - 0.3) * noiseEnvelope

      // Combine and apply main envelope
      data[i] = (harmonics + noise) * envelope
    }

    // Normalize and apply volume
    let maxAbs = 0
    for (let i = 0; i < numSamples; i++) {
      maxAbs = Math.max(maxAbs, Math.abs(data[i] ?? 0))
    }
    if (maxAbs > 0) {
      for (let i = 0; i < numSamples; i++) {
        data[i] = ((data[i] ?? 0) / maxAbs) * config.volume
      }
    }

    return buffer
  }

  /**
   * Get preset by ID
   */
  function getPreset(presetId: string) {
    return SOUND_PRESETS.find(p => p.id === presetId) || SOUND_PRESETS[0]!
  }

  /**
   * Generate buffers for a preset
   */
  async function generateBuffersForPreset(presetId: string): Promise<void> {
    const preset = getPreset(presetId)
    accentBuffer.value = await createClickBuffer(preset.accent)
    regularBuffer.value = await createClickBuffer(preset.regular)
    currentPresetId.value = presetId
  }

  /**
   * Initialize audio context - MUST be called from a user gesture (click/tap)
   */
  async function initialize(presetId?: string): Promise<void> {
    if (isInitialized.value) return

    // Create audio context
    audioContext.value = new (window.AudioContext || (window as any).webkitAudioContext)()

    // Resume if suspended (iOS requirement)
    if (audioContext.value.state === 'suspended') {
      await audioContext.value.resume()
    }

    // Pre-generate click buffers
    await generateBuffersForPreset(presetId || DEFAULT_SOUND_PRESET)

    isInitialized.value = true
  }

  /**
   * Change sound preset
   */
  async function setSoundPreset(presetId: string): Promise<void> {
    if (!isInitialized.value) {
      currentPresetId.value = presetId
      return
    }
    await generateBuffersForPreset(presetId)
  }

  /**
   * Resume audio context (for iOS when app comes back to foreground)
   */
  async function resume(): Promise<void> {
    if (audioContext.value && audioContext.value.state === 'suspended') {
      await audioContext.value.resume()
    }
  }

  /**
   * Schedule a click to play at a specific time
   */
  function scheduleClick(time: number, isAccent: boolean): void {
    if (!audioContext.value) return

    const buffer = isAccent ? accentBuffer.value : regularBuffer.value
    if (!buffer) return

    const source = audioContext.value.createBufferSource()
    source.buffer = buffer
    source.connect(audioContext.value.destination)
    source.start(time)
  }

  /**
   * Get current audio context time
   */
  function getCurrentTime(): number {
    return audioContext.value?.currentTime ?? 0
  }

  /**
   * Create a scheduler that calls the callback with precise timing
   */
  function createScheduler(
    getBeatInterval: () => number,
    getBeats: () => number,
    getAccentEnabled: () => boolean,
    onBeat: (beatIndex: number) => void
  ) {
    let nextBeatTime = 0
    let currentBeat = 0
    let schedulerTimerId: number | null = null
    let isRunning = false

    function scheduler() {
      if (!audioContext.value || !isRunning) return

      // Schedule all beats that fall within the look-ahead window
      while (nextBeatTime < audioContext.value.currentTime + SCHEDULE_AHEAD_TIME) {
        const isAccent = getAccentEnabled() && currentBeat === 0
        scheduleClick(nextBeatTime, isAccent)

        // Schedule the visual callback slightly before the audio
        // Capture beatIndex now since currentBeat will be incremented
        const beatIndex = currentBeat
        const timeUntilBeat = (nextBeatTime - audioContext.value.currentTime) * 1000
        if (timeUntilBeat > 0) {
          setTimeout(() => onBeat(beatIndex), timeUntilBeat)
        } else {
          onBeat(beatIndex)
        }

        // Advance to next beat
        nextBeatTime += getBeatInterval()
        currentBeat = (currentBeat + 1) % getBeats()
      }
    }

    function start() {
      if (!audioContext.value) return

      isRunning = true
      currentBeat = 0
      nextBeatTime = audioContext.value.currentTime + 0.05 // Small delay to allow setup

      scheduler() // Initial scheduling
      schedulerTimerId = window.setInterval(scheduler, SCHEDULER_INTERVAL)
    }

    function stop() {
      isRunning = false
      if (schedulerTimerId !== null) {
        clearInterval(schedulerTimerId)
        schedulerTimerId = null
      }
      currentBeat = 0
    }

    function reset() {
      currentBeat = 0
      if (audioContext.value) {
        nextBeatTime = audioContext.value.currentTime + 0.05
      }
    }

    return { start, stop, reset }
  }

  return {
    isInitialized,
    currentPresetId,
    initialize,
    resume,
    setSoundPreset,
    scheduleClick,
    getCurrentTime,
    createScheduler,
  }
}
