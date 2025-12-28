import { computed, type Ref } from 'vue'
import { TEMPO_RANGES } from '../types/metronome'

export function useTempoNames(bpm: Ref<number>) {
  const tempoName = computed(() => {
    for (const range of TEMPO_RANGES) {
      if (bpm.value >= range.min && bpm.value < range.max) {
        return range.name
      }
    }
    // Handle edge case for max BPM
    if (bpm.value >= 192) {
      return 'Prestissimo'
    }
    return 'Moderato'
  })

  return {
    tempoName,
  }
}
