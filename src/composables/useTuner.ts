import { ref, computed, watch } from 'vue'
import { usePitchDetection } from './usePitchDetection'
import { useReferenceTone } from './useReferenceTone'
import { GUITAR_TUNINGS, CENTS_TOLERANCE, type TunerMode, type NoteInfo } from '../types/tuner'

export function useTuner() {
  // Mode and tuning selection
  const mode = ref<TunerMode>('chromatic')
  const selectedTuningId = ref('standard')
  const selectedStringIndex = ref<number | null>(null)
  const referenceToneEnabled = ref(false)

  // Sub-composables
  const pitchDetection = usePitchDetection()
  const referenceTone = useReferenceTone()

  // Computed values
  const currentTuning = computed(() => {
    return GUITAR_TUNINGS.find((t) => t.id === selectedTuningId.value) ?? GUITAR_TUNINGS[0]!
  })

  const targetNote = computed((): NoteInfo | null => {
    if (mode.value === 'guitar' && selectedStringIndex.value !== null) {
      return currentTuning.value.strings[selectedStringIndex.value] ?? null
    }
    return null
  })

  // Auto-detect which string is being played in guitar mode
  const detectedStringIndex = computed((): number | null => {
    if (mode.value !== 'guitar' || !pitchDetection.detectedNote.value) {
      return null
    }

    const detectedMidi = pitchDetection.detectedNote.value.midiNumber
    let closestIndex: number | null = null
    let closestDistance = Infinity

    currentTuning.value.strings.forEach((string, index) => {
      const distance = Math.abs(string.midiNumber - detectedMidi)
      if (distance < closestDistance && distance <= 2) {
        // Within 2 semitones
        closestDistance = distance
        closestIndex = index
      }
    })

    return closestIndex
  })

  const tuningStatus = computed((): 'flat' | 'sharp' | 'in-tune' | null => {
    if (!pitchDetection.detectedNote.value) {
      return null
    }

    const cents = pitchDetection.centsDeviation.value
    if (Math.abs(cents) <= CENTS_TOLERANCE) {
      return 'in-tune'
    }
    return cents < 0 ? 'flat' : 'sharp'
  })

  // Watch for reference tone updates
  watch(
    [referenceToneEnabled, targetNote, () => pitchDetection.isListening.value],
    ([enabled, target, listening]) => {
      if (enabled && target && listening) {
        referenceTone.start(target.frequency)
      } else {
        referenceTone.stop()
      }
    }
  )

  // Methods
  async function startTuning() {
    await pitchDetection.startListening()
  }

  function stopTuning() {
    pitchDetection.stopListening()
    referenceTone.stop()
  }

  async function toggleTuning() {
    if (pitchDetection.isListening.value) {
      stopTuning()
    } else {
      await startTuning()
    }
  }

  function selectString(index: number | null) {
    selectedStringIndex.value = index
  }

  function setMode(newMode: TunerMode) {
    mode.value = newMode
    if (newMode === 'chromatic') {
      selectedStringIndex.value = null
    }
  }

  function setTuning(tuningId: string) {
    selectedTuningId.value = tuningId
    selectedStringIndex.value = null
  }

  function toggleReferenceTone() {
    referenceToneEnabled.value = !referenceToneEnabled.value
  }

  function playReferenceNote(frequency: number) {
    if (referenceToneEnabled.value) {
      referenceTone.start(frequency)
    }
  }

  return {
    // State
    mode,
    selectedTuningId,
    selectedStringIndex,
    referenceToneEnabled,

    // Pitch detection state
    isListening: pitchDetection.isListening,
    detectedFrequency: pitchDetection.detectedFrequency,
    detectedNote: pitchDetection.detectedNote,
    centsDeviation: pitchDetection.centsDeviation,
    signalStrength: pitchDetection.signalStrength,

    // Reference tone state
    isPlayingReference: referenceTone.isPlaying,

    // Computed
    currentTuning,
    targetNote,
    detectedStringIndex,
    tuningStatus,

    // Methods
    startTuning,
    stopTuning,
    toggleTuning,
    selectString,
    setMode,
    setTuning,
    toggleReferenceTone,
    playReferenceNote,
  }
}
