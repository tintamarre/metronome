export interface MetronomeState {
  bpm: number
  beats: number
  isPlaying: boolean
  currentBeat: number
  iteration: number
}

export interface TempoRange {
  name: string
  min: number
  max: number
}

export interface ClickConfig {
  frequencies: number[]
  weights: number[]
  decayRate: number
  volume: number
  duration: number // in seconds
}

export const ACCENT_CLICK: ClickConfig = {
  frequencies: [1800, 2400, 3200, 4000],
  weights: [1.0, 0.6, 0.3, 0.15],
  decayRate: 150,
  volume: 1.0,
  duration: 0.03, // 30ms
}

export const REGULAR_CLICK: ClickConfig = {
  frequencies: [1200, 1800, 2400, 3000],
  weights: [1.0, 0.5, 0.25, 0.1],
  decayRate: 200,
  volume: 0.8,
  duration: 0.03, // 30ms
}

export const TEMPO_RANGES: TempoRange[] = [
  { name: 'Largo', min: 40, max: 58 },
  { name: 'Larghetto', min: 58, max: 63 },
  { name: 'Adagio', min: 63, max: 72 },
  { name: 'Andante', min: 72, max: 104 },
  { name: 'Moderato', min: 104, max: 116 },
  { name: 'Allegro', min: 116, max: 160 },
  { name: 'Presto', min: 160, max: 192 },
  { name: 'Prestissimo', min: 192, max: 216 },
]

export const BPM_MIN = 40
export const BPM_MAX = 208
export const BPM_DEFAULT = 120
export const BEATS_MIN = 1
export const BEATS_MAX = 8
export const BEATS_DEFAULT = 4
