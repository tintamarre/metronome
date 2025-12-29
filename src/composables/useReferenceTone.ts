import { ref, shallowRef, onUnmounted } from 'vue'

export function useReferenceTone() {
  const isPlaying = ref(false)
  const currentFrequency = ref(440)

  const audioContext = shallowRef<AudioContext | null>(null)
  const oscillator = shallowRef<OscillatorNode | null>(null)
  const gainNode = shallowRef<GainNode | null>(null)

  function ensureAudioContext() {
    if (!audioContext.value) {
      audioContext.value = new AudioContext()
    }
    return audioContext.value
  }

  function setFrequency(frequency: number) {
    currentFrequency.value = frequency
    if (oscillator.value) {
      oscillator.value.frequency.setValueAtTime(frequency, audioContext.value!.currentTime)
    }
  }

  function start(frequency?: number) {
    if (isPlaying.value) {
      if (frequency !== undefined) {
        setFrequency(frequency)
      }
      return
    }

    const ctx = ensureAudioContext()

    if (frequency !== undefined) {
      currentFrequency.value = frequency
    }

    // Create oscillator
    oscillator.value = ctx.createOscillator()
    oscillator.value.type = 'sine'
    oscillator.value.frequency.setValueAtTime(currentFrequency.value, ctx.currentTime)

    // Create gain node for smooth volume control
    gainNode.value = ctx.createGain()
    gainNode.value.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.value.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05)

    // Connect nodes
    oscillator.value.connect(gainNode.value)
    gainNode.value.connect(ctx.destination)

    // Start oscillator
    oscillator.value.start()
    isPlaying.value = true
  }

  function stop() {
    if (!isPlaying.value || !oscillator.value || !gainNode.value || !audioContext.value) {
      return
    }

    // Smooth fade out to avoid clicks
    const ctx = audioContext.value
    gainNode.value.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05)

    // Stop and cleanup after fade out
    const osc = oscillator.value
    setTimeout(() => {
      osc.stop()
      osc.disconnect()
    }, 60)

    oscillator.value = null
    gainNode.value = null
    isPlaying.value = false
  }

  function toggle(frequency?: number) {
    if (isPlaying.value) {
      stop()
    } else {
      start(frequency)
    }
  }

  onUnmounted(() => {
    stop()
    if (audioContext.value) {
      audioContext.value.close()
      audioContext.value = null
    }
  })

  return {
    isPlaying,
    currentFrequency,
    setFrequency,
    start,
    stop,
    toggle,
  }
}
