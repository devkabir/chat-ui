<template>
  <div
    :class="[
      'flex mb-4',
      message.role === 'user' ? 'justify-end' : 'justify-start'
    ]"
  >
    <div
      :class="[
        'max-w-xs sm:max-w-md lg:max-w-2xl xl:max-w-4xl px-4 py-3 rounded-2xl shadow-sm',
        message.role === 'user' 
          ? 'bg-blue-500 text-white rounded-br-md' 
          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
      ]"
    >
      <div v-if="message.role === 'user'" class="text-sm leading-relaxed whitespace-pre-wrap">
        {{ message.content }}
      </div>
      <div 
        v-else 
        class="text-sm leading-relaxed markdown-content"
        v-html="processedContent"
      ></div>
      <span v-if="message.isStreaming" class="inline-block w-2 h-4 bg-current animate-pulse ml-1"></span>
      <div 
        :class="[
          'text-xs mt-2 opacity-70',
          message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
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