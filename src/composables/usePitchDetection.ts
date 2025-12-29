import { ref, shallowRef, onUnmounted } from 'vue'
import { CHROMATIC_NOTES, A4_FREQUENCY, type NoteInfo } from '../types/tuner'

const MIN_FREQUENCY = 60
const MAX_FREQUENCY = 1000
const MIN_RMS = 0.01
const FFT_SIZE = 4096

export function usePitchDetection() {
  const isListening = ref(false)
  const detectedFrequency = ref<number | null>(null)
  const detectedNote = ref<NoteInfo | null>(null)
  const centsDeviation = ref(0)
  const signalStrength = ref(0)

  const audioContext = shallowRef<AudioContext | null>(null)
  const analyser = shallowRef<AnalyserNode | null>(null)
  const mediaStream = shallowRef<MediaStream | null>(null)
  let animationFrameId: number | null = null

  function autoCorrelate(buffer: Float32Array, sampleRate: number): number {
    const SIZE = buffer.length

    // Calculate RMS to check signal level
    let rms = 0
    for (let i = 0; i < SIZE; i++) {
      rms += buffer[i]! * buffer[i]!
    }
    rms = Math.sqrt(rms / SIZE)
    signalStrength.value = Math.min(1, rms * 10)

    if (rms < MIN_RMS) {
      return -1
    }

    // Normalize the buffer
    const normalizedBuffer = new Float32Array(SIZE)
    for (let i = 0; i < SIZE; i++) {
      normalizedBuffer[i] = buffer[i]!
    }

    // Find the first point where the signal crosses zero (going up)
    let r1 = 0
    let r2 = SIZE - 1
    const threshold = 0.2

    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(normalizedBuffer[i]!) < threshold) {
        r1 = i
        break
      }
    }
    for (let i = 1; i < SIZE / 2; i++) {
      if (Math.abs(normalizedBuffer[SIZE - i]!) < threshold) {
        r2 = SIZE - i
        break
      }
    }

    const trimmedBuffer = normalizedBuffer.slice(r1, r2)
    const trimmedSize = trimmedBuffer.length

    if (trimmedSize < 2) {
      return -1
    }

    // Autocorrelation
    const correlations = new Float32Array(trimmedSize)
    for (let lag = 0; lag < trimmedSize; lag++) {
      let sum = 0
      for (let i = 0; i < trimmedSize - lag; i++) {
        sum += trimmedBuffer[i]! * trimmedBuffer[i + lag]!
      }
      correlations[lag] = sum
    }

    // Find the first peak after initial decay
    let d = 0
    while (d < trimmedSize - 1 && correlations[d]! > correlations[d + 1]!) {
      d++
    }

    // Find the maximum correlation value and its position
    let maxCorrelation = -1
    let maxLag = -1
    for (let i = d; i < trimmedSize; i++) {
      if (correlations[i]! > maxCorrelation) {
        maxCorrelation = correlations[i]!
        maxLag = i
      }
    }

    if (maxLag < 1 || maxLag >= trimmedSize - 1) {
      return -1
    }

    // Parabolic interpolation for better accuracy
    const y1 = correlations[maxLag - 1] ?? 0
    const y2 = correlations[maxLag]!
    const y3 = correlations[maxLag + 1] ?? 0

    const a = (y1 + y3 - 2 * y2) / 2
    const b = (y3 - y1) / 2

    let interpolatedLag = maxLag
    if (a !== 0) {
      interpolatedLag = maxLag - b / (2 * a)
    }

    const frequency = sampleRate / interpolatedLag

    if (frequency < MIN_FREQUENCY || frequency > MAX_FREQUENCY) {
      return -1
    }

    return frequency
  }

  function frequencyToNote(frequency: number): { note: NoteInfo; cents: number } {
    // Calculate MIDI number from frequency (A4 = MIDI 69 = 440Hz)
    const midiNumber = 12 * Math.log2(frequency / A4_FREQUENCY) + 69
    const roundedMidi = Math.round(midiNumber)

    // Calculate cents deviation
    const cents = Math.round((midiNumber - roundedMidi) * 100)

    // Get note name and octave
    const noteIndex = ((roundedMidi % 12) + 12) % 12
    const noteName = CHROMATIC_NOTES[noteIndex]!
    const octave = Math.floor(roundedMidi / 12) - 1

    // Calculate exact frequency for this note
    const exactFrequency = A4_FREQUENCY * Math.pow(2, (roundedMidi - 69) / 12)

    return {
      note: {
        name: noteName,
        octave,
        frequency: exactFrequency,
        midiNumber: roundedMidi,
      },
      cents,
    }
  }

  function analyze() {
    if (!analyser.value || !audioContext.value) {
      return
    }

    const buffer = new Float32Array(FFT_SIZE)
    analyser.value.getFloatTimeDomainData(buffer)

    const frequency = autoCorrelate(buffer, audioContext.value.sampleRate)

    if (frequency > 0) {
      detectedFrequency.value = frequency
      const result = frequencyToNote(frequency)
      detectedNote.value = result.note
      centsDeviation.value = result.cents
    } else {
      detectedFrequency.value = null
      detectedNote.value = null
      centsDeviation.value = 0
    }

    if (isListening.value) {
      animationFrameId = requestAnimationFrame(analyze)
    }
  }

  async function startListening() {
    if (isListening.value) return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
        },
      })

      mediaStream.value = stream
      audioContext.value = new AudioContext()
      analyser.value = audioContext.value.createAnalyser()
      analyser.value.fftSize = FFT_SIZE

      const source = audioContext.value.createMediaStreamSource(stream)
      source.connect(analyser.value)

      isListening.value = true
      analyze()
    } catch (error) {
      console.error('Failed to access microphone:', error)
      throw error
    }
  }

  function stopListening() {
    isListening.value = false

    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }

    if (mediaStream.value) {
      mediaStream.value.getTracks().forEach((track) => track.stop())
      mediaStream.value = null
    }

    if (audioContext.value) {
      audioContext.value.close()
      audioContext.value = null
    }

    analyser.value = null
    detectedFrequency.value = null
    detectedNote.value = null
    centsDeviation.value = 0
    signalStrength.value = 0
  }

  onUnmounted(() => {
    stopListening()
  })

  return {
    isListening,
    detectedFrequency,
    detectedNote,
    centsDeviation,
    signalStrength,
    startListening,
    stopListening,
  }
}
