<template>
  <div
    :class="[
      'flex mb-4',
      message.role === 'user' ? 'justify-end' : message.role === 'system' ? 'justify-center' : 'justify-start'
    ]"
  >
    <div
      :class="[
        'w-full max-w-none px-4 py-3 rounded-2xl shadow-sm',
        message.role === 'user' 
          ? 'bg-blue-500 text-white rounded-br-md' 
          : message.role === 'system'
          ? 'bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-xl'
          : message.isWebSearchResult
          ? 'bg-green-50 text-green-800 border border-green-200 rounded-bl-md'
          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
      ]"
    >
      <div v-if="message.role === 'user'" class="text-sm leading-relaxed whitespace-pre-wrap">
        {{ message.content }}
      </div>
      <div v-else-if="message.role === 'system'" class="text-sm leading-relaxed whitespace-pre-wrap">
        <div class="flex items-center mb-2">
          <svg class="w-4 h-4 mr-2 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
          </svg>
          <span class="font-medium text-yellow-700">System Prompt Active</span>
        </div>
        {{ message.content }}
      </div>
      <div v-else class="text-sm leading-relaxed markdown-content">
        <div v-if="message.isWebSearchResult" class="flex items-center mb-2">
          <svg class="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L3 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.734.99A.996.996 0 0118 6v2a1 1 0 11-2 0v-.277l-1.254.145a1 1 0 11-.992-1.736L14.984 6l-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.577v.423a1 1 0 11-2 0v-.423L7.746 9.868a1 1 0 01-.364-1.364zm2.5 6.5a1 1 0 01-1.364.372L7.746 14.5a1 1 0 11.992-1.736L9.5 13.348V13a1 1 0 112 0v.348l.762-.584a1 1 0 11.992 1.736l-1.772 1.376z" clip-rule="evenodd"></path>
          </svg>
          <span class="font-medium text-green-700">Web Search Results</span>
          <span v-if="message.searchQuery" class="ml-2 text-xs text-green-600 bg-green-100 px-2 py-1 rounded">{{ message.searchQuery }}</span>
        </div>
        <div v-html="processedContent"></div>
      </div>
      <span v-if="message.isStreaming" class="inline-block w-2 h-4 bg-current animate-pulse ml-1"></span>
      <div 
        :class="[
          'text-xs mt-2 opacity-70',
          message.role === 'user' ? 'text-blue-100' : message.role === 'system' ? 'text-yellow-600' : 'text-gray-500'
        ]"
      >
        {{ formatTime(message.timestamp) }}
      </div>
    </div>
  </div>
</template>

<script>
import { processMarkdown } from '../utils/markdown.js'

export default {
  name: 'MessageBubble',
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  computed: {
    processedContent() {
      if (this.message.role === 'user') {
        return this.message.content
      }
      return processMarkdown(this.message.content)
    }
  },
  methods: {
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
  }
}
</script>