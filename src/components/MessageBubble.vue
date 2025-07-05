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
      <div 
        v-else 
        class="text-sm leading-relaxed markdown-content"
        v-html="processedContent"
      ></div>
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

<script setup>
import { computed, defineProps } from 'vue'
import { processMarkdown } from '@/utils/markdown.js'

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

const processedContent = computed(() => {
  if (props.message.role === 'user') {
    return props.message.content
  }
  return processMarkdown(props.message.content)
})

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}
</script>