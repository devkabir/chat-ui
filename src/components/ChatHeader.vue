<template>
  <div class="flex-shrink-0 px-6 py-4 bg-white border-b border-gray-200">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">Chat with LLM</h1>
        <p class="mt-1 text-sm text-gray-500">{{ statusText }}</p>
      </div>
      <div class="flex items-center space-x-2">
        <div :class="['w-2 h-2 rounded-full', isConnected ? 'bg-green-400' : 'bg-red-400']"></div>
        <span class="text-sm text-gray-600">{{ isConnected ? 'Connected' : 'Disconnected' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentModel: {
    type: String,
    default: 'google/gemma-3-12b'
  },
  isConnected: {
    type: Boolean,
    default: true
  },
  messageCount: {
    type: Number,
    default: 0
  }
})

const statusText = computed(() => {
  return `${props.currentModel} • ${props.messageCount} messages`
})
</script>