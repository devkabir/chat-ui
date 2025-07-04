<template>
  <div class="flex-shrink-0 bg-white border-t border-gray-200 p-4">
    <div class="max-w-none mx-auto px-4">
      <div class="flex items-end space-x-3 mb-3">
        <div class="flex-1 min-w-0">
          <textarea
            ref="messageInput"
            v-model="currentMessage"
            @keydown="handleKeydown"
            @input="adjustTextareaHeight"
            placeholder="Type your message..."
            :disabled="isLoading"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32 disabled:bg-gray-50 disabled:text-gray-500"
            rows="1"
          />
        </div>
        <button 
          v-if="!isLoading"
          @click="sendMessage" 
          :disabled="!currentMessage.trim()"
          class="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
        >
          <span>Send</span>
        </button>
        <button 
          v-else
          @click="stopRequest" 
          class="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 flex items-center space-x-2"
        >
          <svg class="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>Stop</span>
        </button>
      </div>
      
      <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
        <div class="flex items-center space-x-2">
          <label class="text-gray-700 font-medium">Model:</label>
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
          <label class="text-gray-700 font-medium">
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
          <label class="text-gray-700 font-medium">Temperature:</label>
          <input 
            v-model.number="selectedTemperature" 
            @input="$emit('temperature-change', selectedTemperature)"
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            class="w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <span class="text-gray-500 min-w-[2rem]">{{ selectedTemperature }}</span>
        </div>
        
        <button 
          @click="$emit('clear-chat')" 
          class="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Clear Chat
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchAvailableModels } from '../services/models.js'

export default {
  name: 'ChatInput',
  props: {
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
    }
  },
  emits: ['send-message', 'model-change', 'temperature-change', 'clear-chat', 'streaming-change', 'stop-request'],
  data() {
    return {
      currentMessage: '',
      selectedModel: this.currentModel,
      selectedTemperature: this.temperature,
      useStreaming: true,
      availableModels: [],
      modelsLoading: true
    }
  },
  async mounted() {
    await this.loadModels()
  },
  watch: {
    currentModel(newValue) {
      this.selectedModel = newValue
    },
    temperature(newValue) {
      this.selectedTemperature = newValue
    }
  },
  methods: {
    sendMessage() {
      if (!this.currentMessage.trim() || this.isLoading) return
      
      this.$emit('send-message', this.currentMessage)
      this.currentMessage = ''
      this.resetTextareaHeight()
    },
    
    handleKeydown(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        this.sendMessage()
      }
    },
    
    adjustTextareaHeight() {
      const textarea = this.$refs.messageInput
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px'
    },
    
    resetTextareaHeight() {
      const textarea = this.$refs.messageInput
      textarea.style.height = 'auto'
    },
    
    stopRequest() {
      this.$emit('stop-request')
    },
    
    async loadModels() {
      try {
        this.modelsLoading = true
        this.availableModels = await fetchAvailableModels()
        
        // If current model is not in the list, select the first available model
        if (this.availableModels.length > 0) {
          const currentModelExists = this.availableModels.some(model => model.id === this.selectedModel)
          if (!currentModelExists) {
            this.selectedModel = this.availableModels[0].id
            this.$emit('model-change', this.selectedModel)
          }
        }
      } catch (error) {
        console.error('Failed to load models:', error)
      } finally {
        this.modelsLoading = false
      }
    },
    
    formatModelName(name) {
      // Clean up model names for display
      return name
        .replace(/^.*\//, '') // Remove namespace prefix
        .replace(/[-_]/g, ' ') // Replace hyphens and underscores with spaces
        .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize first letter of each word
    }
  }
}
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