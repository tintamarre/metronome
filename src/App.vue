<script setup lang="ts">
import { ref } from 'vue'
import { useMetronome } from './composables/useMetronome'
import { useTuner } from './composables/useTuner'
import { useTheme } from './composables/useTheme'
import MetronomeControls from './components/MetronomeControls.vue'
import MetronomeDisplay from './components/MetronomeDisplay.vue'
import BeatVisualization from './components/BeatVisualization.vue'
import TabNavigation from './components/tabs/TabNavigation.vue'
import TunerDisplay from './components/tuner/TunerDisplay.vue'
import TunerControls from './components/tuner/TunerControls.vue'

// Tab state
const activeTab = ref<'metronome' | 'tuner'>('metronome')

// Metronome
const {
  bpm,
  beats,
  isPlaying,
  currentBeat,
  iteration,
  tempoName,
  accentEnabled,
  soundPreset,
  soundPresets,
  isOfficialTempo,
  beatIntervalMs,
  toggle,
} = useMetronome()

// Tuner
const {
  mode: tunerMode,
  selectedTuningId,
  selectedStringIndex,
  isListening,
  detectedFrequency,
  detectedNote,
  centsDeviation,
  signalStrength,
  currentTuning,
  detectedStringIndex,
  setMode,
  setTuning,
  selectString,
  toggleTuning,
} = useTuner()

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-white flex flex-col transition-colors duration-200">
    <!-- Header: Tabs + Theme Toggle -->
    <div class="w-full max-w-md mx-auto pt-4 px-4 flex items-center gap-2">
      <TabNavigation v-model:active-tab="activeTab" class="flex-1" />
      <button
        @click="toggleTheme"
        class="p-2 rounded-lg bg-gray-200 dark:bg-dark-700 hover:bg-gray-300 dark:hover:bg-dark-800 transition-colors shrink-0"
        :title="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <!-- Sun icon (show in dark mode) -->
        <svg v-if="theme === 'dark'" class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
        </svg>
        <!-- Moon icon (show in light mode) -->
        <svg v-else class="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </button>
    </div>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col items-center justify-center px-4 py-4">
      <!-- Metronome Tab -->
      <template v-if="activeTab === 'metronome'">
        <!-- Display -->
        <MetronomeDisplay
          :tempo-name="tempoName"
          :bpm="bpm"
          :iteration="iteration"
          :beats="beats"
        />

        <!-- Visualization -->
        <div class="w-full max-w-md mx-auto my-2 px-3">
          <BeatVisualization
            :beats="beats"
            :current-beat="currentBeat"
            :is-playing="isPlaying"
            :accent-enabled="accentEnabled"
            :beat-interval-ms="beatIntervalMs"
          />
        </div>

        <!-- Controls -->
        <MetronomeControls
          :bpm="bpm"
          :beats="beats"
          :is-playing="isPlaying"
          :accent-enabled="accentEnabled"
          :sound-preset="soundPreset"
          :sound-presets="soundPresets"
          :is-official-tempo="isOfficialTempo"
          @update:bpm="bpm = $event"
          @update:beats="beats = $event"
          @update:accent-enabled="accentEnabled = $event"
          @update:sound-preset="soundPreset = $event"
          @toggle="toggle"
        />
      </template>

      <!-- Tuner Tab -->
      <template v-else>
        <TunerDisplay
          :note-name="detectedNote?.name ?? null"
          :octave="detectedNote?.octave ?? null"
          :cents="centsDeviation"
          :frequency="detectedFrequency"
          :is-listening="isListening"
          :signal-strength="signalStrength"
        />

        <TunerControls
          :mode="tunerMode"
          :selected-tuning-id="selectedTuningId"
          :selected-string-index="selectedStringIndex"
          :detected-string-index="detectedStringIndex"
          :current-tuning="currentTuning"
          :is-listening="isListening"
          @update:mode="setMode($event)"
          @update:selected-tuning-id="setTuning($event)"
          @update:selected-string-index="selectString($event)"
          @toggle="toggleTuning()"
        />
      </template>
    </main>

    <!-- Footer -->
    <footer class="py-2 text-center text-gray-500 dark:text-gray-600 text-sm">
      
        Built with ❤️ by Martin – <a
        href="https://github.com/tintamarre/metronome"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-gray-700 dark:hover:text-gray-400 transition-colors"
      >Source code
      </a>
    </footer>
  </div>
</template>
