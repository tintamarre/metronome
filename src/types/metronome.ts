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

export interface SoundPreset {
  id: string
  name: string
  accent: ClickConfig
  regular: ClickConfig
}

export const SOUND_PRESETS: SoundPreset[] = [
  {
    id: 'mechanical',
    name: 'Mechanical',
    accent: {
      frequencies: [400, 800, 1200, 2000],
      weights: [0.5, 1.0, 0.6, 0.3],
      decayRate: 180,
      volume: 1.0,
      duration: 0.02,
    },
    regular: {
      frequencies: [350, 700, 1000, 1600],
      weights: [0.5, 1.0, 0.5, 0.2],
      decayRate: 220,
      volume: 0.85,
      duration: 0.02,
    },
  },
  {
    id: 'bip',
    name: 'Bip',
    accent: {
      frequencies: [1000],
      weights: [1.0],
      decayRate: 120,
      volume: 0.9,
      duration: 0.04,
    },
    regular: {
      frequencies: [800],
      weights: [1.0],
      decayRate: 150,
      volume: 0.7,
      duration: 0.04,
    },
  },
  {
    id: 'classic',
    name: 'Classic',
    accent: {
      frequencies: [1800, 2400, 3200, 4000],
      weights: [1.0, 0.6, 0.3, 0.15],
      decayRate: 150,
      volume: 1.0,
      duration: 0.03,
    },
    regular: {
      frequencies: [1200, 1800, 2400, 3000],
      weights: [1.0, 0.5, 0.25, 0.1],
      decayRate: 200,
      volume: 0.8,
      duration: 0.03,
    },
  },
  {
    id: 'wood',
    name: 'Wood Block',
    accent: {
      frequencies: [800, 1200, 1600],
      weights: [1.0, 0.7, 0.3],
      decayRate: 250,
      volume: 1.0,
      duration: 0.025,
    },
    regular: {
      frequencies: [600, 900, 1200],
      weights: [1.0, 0.6, 0.2],
      decayRate: 300,
      volume: 0.75,
      duration: 0.025,
    },
  },
  {
    id: 'digital',
    name: 'Digital',
    accent: {
      frequencies: [2200, 3300, 4400],
      weights: [1.0, 0.4, 0.2],
      decayRate: 400,
      volume: 0.9,
      duration: 0.015,
    },
    regular: {
      frequencies: [1800, 2700, 3600],
      weights: [1.0, 0.3, 0.1],
      decayRate: 500,
      volume: 0.7,
      duration: 0.015,
    },
  },
  {
    id: 'soft',
    name: 'Soft',
    accent: {
      frequencies: [600, 900, 1200],
      weights: [1.0, 0.8, 0.5],
      decayRate: 80,
      volume: 0.7,
      duration: 0.05,
    },
    regular: {
      frequencies: [500, 750, 1000],
      weights: [1.0, 0.7, 0.4],
      decayRate: 100,
      volume: 0.5,
      duration: 0.05,
    },
  },
  {
    id: 'deep',
    name: 'Deep',
    accent: {
      frequencies: [150, 300, 450, 600],
      weights: [1.0, 0.8, 0.4, 0.2],
      decayRate: 60,
      volume: 1.0,
      duration: 0.06,
    },
    regular: {
      frequencies: [120, 240, 360, 480],
      weights: [1.0, 0.7, 0.3, 0.1],
      decayRate: 80,
      volume: 0.8,
      duration: 0.06,
    },
  },
]

export const DEFAULT_SOUND_PRESET = 'mechanical'

// Legacy exports for compatibility
export const ACCENT_CLICK: ClickConfig = SOUND_PRESETS[0]!.accent
export const REGULAR_CLICK: ClickConfig = SOUND_PRESETS[0]!.regular

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

export const OFFICIAL_TEMPOS = [
  40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 63, 66, 69, 72,
  80, 84, 88, 92, 96, 100, 104, 108, 112, 116, 120, 126, 132,
  138, 144, 152, 160, 168, 176, 184, 192, 200, 208
] as const
export const BEATS_MIN = 1
export const BEATS_MAX = 8
export const BEATS_DEFAULT = 4

