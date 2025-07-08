<template>
  <div class="flex-shrink-0 p-4 bg-white border-t border-gray-200">
    <div class="px-4 mx-auto max-w-none">
      <div class="flex items-end mb-3 space-x-3">
        <div class="flex-1 min-w-0">
          <textarea
            ref="messageInput"
            v-model="currentMessage"
            @keydown="handleKeydown"
            @input="adjustTextareaHeight"
            placeholder="Type your message..."
            :disabled="isLoading"
            class="w-full px-4 py-3 border border-gray-300 resize-none rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-32 disabled:bg-gray-50 disabled:text-gray-500"
            rows="1"
          />
        </div>
        <button 
          v-if="!isLoading"
          @click="sendMessage" 
          :disabled="!currentMessage.trim()"
          class="flex items-center px-6 py-3 space-x-2 text-white transition-colors duration-200 bg-blue-500 rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <span>Send</span>
        </button>
        <button 
          v-else
          @click="stopRequest" 
          class="flex items-center px-6 py-3 space-x-2 text-white transition-colors duration-200 bg-red-500 rounded-xl hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <svg class="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>Stop</span>
        </button>
      </div>
      
      <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
        <div class="flex items-center space-x-2">
          <label class="font-medium text-gray-700">Model:</label>
          <select 
            v-model="selectedModel" 
            @change="$emit('model-change', selectedModel)"
            :disabled="modelsLoading"
            class="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed min-w-[200px]"
          >
            <option v-if="modelsLoading" value="">Loading models...</option>
            <option 
              v-for="model in availableModels" 
              :key="model.id" 
              :value="model.id"
            >
              {{ formatModelName(model.name) }}
            </option>
          </select>
        </div>
        
        <div class="flex items-center space-x-2">
          <label class="font-medium text-gray-700">
            <input 
              type="checkbox" 
              v-model="useStreaming"
              @change="$emit('streaming-change', useStreaming)"
              class="mr-1"
            />
            Stream
          </label>
        </div>
        
        <div class="flex items-center space-x-2">
          <label class="font-medium text-gray-700">Temperature:</label>
          <div class="flex items-center space-x-2">
            <label class="text-xs text-gray-600">
              <input 
                type="checkbox" 
                v-model="autoTemperature"
                @change="toggleAutoTemperature"
                class="mr-1"
              />
              Auto
            </label>
            <input 
              v-model.number="selectedTemperature" 
              @input="$emit('temperature-change', selectedTemperature)"
              type="range" 
              min="0" 
              max="1" 
              step="0.1" 
              :disabled="autoTemperature"
              class="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span class="text-gray-500 min-w-[2rem]">{{ selectedTemperature }}</span>
          </div>
        </div>
        
        <button 
          @click="$emit('clear-chat')" 
          class="px-3 py-1 text-white transition-colors duration-200 bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Clear Chat
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { fetchAvailableModels } from '@/services/models.js'

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  currentModel: {
    type: String,
    default: 'google/gemma-3-12b'
  },
  temperature: {
    type: Number,
    default: 0.7
  },
  messages: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['send-message', 'model-change', 'temperature-change', 'clear-chat', 'streaming-change', 'stop-request'])

const messageInput = ref(null)
const currentMessage = ref('')
const selectedModel = ref(props.currentModel)
const selectedTemperature = ref(props.temperature)
const useStreaming = ref(true)
const availableModels = ref([])
const modelsLoading = ref(true)
const autoTemperature = ref(false)
const messageCount = ref(0)
const messageHistory = ref([])
const historyIndex = ref(-1)

const sendMessage = () => {
  if (!currentMessage.value.trim() || props.isLoading) return
  
  // Add to history
  addToHistory(currentMessage.value)
  
  emit('send-message', currentMessage.value)
  currentMessage.value = ''
  resetTextareaHeight()
  
  // Auto-adjust temperature based on message count
  if (autoTemperature.value) {
    messageCount.value++
    adjustAutoTemperature()
  }
}

const handleKeydown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    navigateHistory('up')
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    navigateHistory('down')
  }
}

const adjustTextareaHeight = () => {
  const textarea = messageInput.value
  textarea.style.height = 'auto'
  textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px'
}

const resetTextareaHeight = () => {
  const textarea = messageInput.value
  textarea.style.height = 'auto'
}

const stopRequest = () => {
  emit('stop-request')
}

const loadModels = async () => {
  try {
    modelsLoading.value = true
    availableModels.value = await fetchAvailableModels()
    
    // If current model is not in the list, select the first available model
    if (availableModels.value.length > 0) {
      const currentModelExists = availableModels.value.some(model => model.id === selectedModel.value)
      if (!currentModelExists) {
        selectedModel.value = availableModels.value[0].id
        emit('model-change', selectedModel.value)
      }
    }
  } catch (error) {
    console.error('Failed to load models:', error)
  } finally {
    modelsLoading.value = false
  }
}

const formatModelName = (name) => {
  // Clean up model names for display
  return name
    .replace(/^.*\//, '') // Remove namespace prefix
    .replace(/[-_]/g, ' ') // Replace hyphens and underscores with spaces
    .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize first letter of each word
}

const toggleAutoTemperature = () => {
  if (autoTemperature.value) {
    messageCount.value = 0
    adjustAutoTemperature()
  }
}

const adjustAutoTemperature = () => {
  // Auto-adjust temperature based on conversation progress
  // Start high for creativity, decrease for more focused responses
  const baseTemp = 0.8
  const decayRate = 0.05
  const minTemp = 0.3
  
  const newTemp = Math.max(minTemp, baseTemp - (messageCount.value * decayRate))
  selectedTemperature.value = Math.round(newTemp * 10) / 10
  emit('temperature-change', selectedTemperature.value)
}

const addToHistory = (message) => {
  // Add message to history, avoid duplicates
  if (messageHistory.value[messageHistory.value.length - 1] !== message) {
    messageHistory.value.push(message)
    // Keep only last 50 messages
    if (messageHistory.value.length > 50) {
      messageHistory.value.shift()
    }
  }
  historyIndex.value = -1
}

const navigateHistory = (direction) => {
  if (messageHistory.value.length === 0) return
  
  if (direction === 'up') {
    if (historyIndex.value < messageHistory.value.length - 1) {
      historyIndex.value++
      currentMessage.value = messageHistory.value[messageHistory.value.length - 1 - historyIndex.value]
    }
  } else if (direction === 'down') {
    if (historyIndex.value > 0) {
      historyIndex.value--
      currentMessage.value = messageHistory.value[messageHistory.value.length - 1 - historyIndex.value]
    } else if (historyIndex.value === 0) {
      historyIndex.value = -1
      currentMessage.value = ''
    }
  }
  
  nextTick(() => {
    adjustTextareaHeight()
  })
}

// Watchers
watch(() => props.currentModel, (newValue) => {
  selectedModel.value = newValue
})

watch(() => props.temperature, (newValue) => {
  selectedTemperature.value = newValue
})

watch(selectedModel, (newValue) => {
  emit('model-change', newValue)
})

watch(selectedTemperature, (newValue) => {
  emit('temperature-change', newValue)
})

watch(useStreaming, (newValue) => {
  emit('streaming-change', newValue)
})

onMounted(async () => {
  await loadModels()
})
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #3B82F6;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: #3B82F6;
  cursor: pointer;
  border: none;
}
</style>