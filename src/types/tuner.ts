export interface NoteInfo {
  name: string
  octave: number
  frequency: number
  midiNumber: number
}

export interface TunerState {
  isListening: boolean
  detectedFrequency: number | null
  detectedNote: NoteInfo | null
  centsDeviation: number
  signalStrength: number
}

export type TunerMode = 'chromatic' | 'guitar'

export interface GuitarTuning {
  id: string
  name: string
  strings: NoteInfo[]
}

export const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const

export const SOLFEGE_NAMES: Record<string, string> = {
  'C': 'Do',
  'C#': 'Do#',
  'D': 'Ré',
  'D#': 'Ré#',
  'E': 'Mi',
  'F': 'Fa',
  'F#': 'Fa#',
  'G': 'Sol',
  'G#': 'Sol#',
  'A': 'La',
  'A#': 'La#',
  'B': 'Si',
}

export const A4_FREQUENCY = 440
export const CENTS_TOLERANCE = 10

export const GUITAR_TUNINGS: GuitarTuning[] = [
  {
    id: 'standard',
    name: 'Standard (EADGBE)',
    strings: [
      { name: 'E', octave: 2, frequency: 82.41, midiNumber: 40 },
      { name: 'A', octave: 2, frequency: 110.0, midiNumber: 45 },
      { name: 'D', octave: 3, frequency: 146.83, midiNumber: 50 },
      { name: 'G', octave: 3, frequency: 196.0, midiNumber: 55 },
      { name: 'B', octave: 3, frequency: 246.94, midiNumber: 59 },
      { name: 'E', octave: 4, frequency: 329.63, midiNumber: 64 },
    ],
  },
  {
    id: 'drop-d',
    name: 'Drop D (DADGBE)',
    strings: [
      { name: 'D', octave: 2, frequency: 73.42, midiNumber: 38 },
      { name: 'A', octave: 2, frequency: 110.0, midiNumber: 45 },
      { name: 'D', octave: 3, frequency: 146.83, midiNumber: 50 },
      { name: 'G', octave: 3, frequency: 196.0, midiNumber: 55 },
      { name: 'B', octave: 3, frequency: 246.94, midiNumber: 59 },
      { name: 'E', octave: 4, frequency: 329.63, midiNumber: 64 },
    ],
  },
  {
    id: 'half-step-down',
    name: 'Half Step Down (Eb)',
    strings: [
      { name: 'D#', octave: 2, frequency: 77.78, midiNumber: 39 },
      { name: 'G#', octave: 2, frequency: 103.83, midiNumber: 44 },
      { name: 'C#', octave: 3, frequency: 138.59, midiNumber: 49 },
      { name: 'F#', octave: 3, frequency: 185.0, midiNumber: 54 },
      { name: 'A#', octave: 3, frequency: 233.08, midiNumber: 58 },
      { name: 'D#', octave: 4, frequency: 311.13, midiNumber: 63 },
    ],
  },
  {
    id: 'open-g',
    name: 'Open G (DGDGBD)',
    strings: [
      { name: 'D', octave: 2, frequency: 73.42, midiNumber: 38 },
      { name: 'G', octave: 2, frequency: 98.0, midiNumber: 43 },
      { name: 'D', octave: 3, frequency: 146.83, midiNumber: 50 },
      { name: 'G', octave: 3, frequency: 196.0, midiNumber: 55 },
      { name: 'B', octave: 3, frequency: 246.94, midiNumber: 59 },
      { name: 'D', octave: 4, frequency: 293.66, midiNumber: 62 },
    ],
  },
  {
    id: 'dadgad',
    name: 'DADGAD',
    strings: [
      { name: 'D', octave: 2, frequency: 73.42, midiNumber: 38 },
      { name: 'A', octave: 2, frequency: 110.0, midiNumber: 45 },
      { name: 'D', octave: 3, frequency: 146.83, midiNumber: 50 },
      { name: 'G', octave: 3, frequency: 196.0, midiNumber: 55 },
      { name: 'A', octave: 3, frequency: 220.0, midiNumber: 57 },
      { name: 'D', octave: 4, frequency: 293.66, midiNumber: 62 },
    ],
  },
]
