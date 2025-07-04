<template>
  <div class="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">Chat with LLM</h1>
        <p class="text-sm text-gray-500 mt-1">{{ statusText }}</p>
      </div>
      <div class="flex items-center space-x-4">
        <button 
          @click="$emit('toggle-web-search')"
          class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Web search"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
          </svg>
        </button>
        
        <div class="flex items-center space-x-2">
          <div :class="['w-2 h-2 rounded-full', isConnected ? 'bg-green-400' : 'bg-red-400']"></div>
          <span class="text-sm text-gray-600">{{ isConnected ? 'Connected' : 'Disconnected' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatHeader',
  emits: ['toggle-web-search'],
  props: {
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
  },
  computed: {
    statusText() {
      return `${this.currentModel} • ${this.messageCount} messages`
    }
  }
}
</script>