<script setup lang="ts">
import { useMetronome } from './composables/useMetronome'
import { useTheme } from './composables/useTheme'
import MetronomeControls from './components/MetronomeControls.vue'
import MetronomeDisplay from './components/MetronomeDisplay.vue'
import BeatVisualization from './components/BeatVisualization.vue'

const {
  bpm,
  beats,
  isPlaying,
  currentBeat,
  iteration,
  tempoName,
  accentEnabled,
  toggle,
} = useMetronome()

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-white flex flex-col transition-colors duration-200">
    <!-- Theme Toggle -->
    <div class="absolute top-4 right-4">
      <button
        @click="toggleTheme"
        class="p-2 rounded-lg bg-gray-200 dark:bg-dark-700 hover:bg-gray-300 dark:hover:bg-dark-800 transition-colors"
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
    <main class="flex-1 flex flex-col items-center justify-center px-4 py-8">
      <!-- Display -->
      <MetronomeDisplay
        :tempo-name="tempoName"
        :bpm="bpm"
        :iteration="iteration"
        :beats="beats"
      />

      <!-- Visualization -->
      <div class="w-full max-w-2xl my-8">
        <BeatVisualization
          :beats="beats"
          :current-beat="currentBeat"
          :is-playing="isPlaying"
          :accent-enabled="accentEnabled"
        />
      </div>

      <!-- Controls -->
      <MetronomeControls
        :bpm="bpm"
        :beats="beats"
        :is-playing="isPlaying"
        :accent-enabled="accentEnabled"
        @update:bpm="bpm = $event"
        @update:beats="beats = $event"
        @update:accent-enabled="accentEnabled = $event"
        @toggle="toggle"
      />
    </main>

    <!-- Footer -->
    <footer class="py-4 text-center text-gray-500 dark:text-gray-600 text-sm">
      <a
        href="https://github.com/tintamarre/metronome"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:text-gray-700 dark:hover:text-gray-400 transition-colors"
      >
        Source on GitHub
      </a>
    </footer>
  </div>
</template>
