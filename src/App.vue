<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="w-full max-w-4xl h-[90vh] bg-white rounded-lg shadow-lg flex flex-col">
      <div class="p-6 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Chat with LLM</h1>
        <div class="text-sm text-gray-600">Model: {{ currentModel }}</div>
      </div>
      
      <div class="flex-1 overflow-y-auto p-6 space-y-4" ref="messagesContainer">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="[
            'flex',
            message.role === 'user' ? 'justify-end' : 'justify-start'
          ]"
        >
          <div
            :class="[
              'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
              message.role === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-800'
            ]"
          >
            {{ message.content }}
          </div>
        </div>
        <div v-if="isLoading" class="flex justify-start">
          <div class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-200 text-gray-800 animate-pulse">
            Thinking...
          </div>
        </div>
      </div>
      
      <div class="p-6 border-t border-gray-200 bg-white rounded-b-lg">
        <div class="flex gap-2 mb-4">
          <input
            v-model="currentMessage"
            @keyup.enter="sendMessage"
            @keyup.shift.enter="sendMessage"
            placeholder="Type your message..."
            :disabled="isLoading"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button 
            @click="sendMessage" 
            :disabled="isLoading || !currentMessage.trim()"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
        <div class="flex flex-wrap gap-4 items-center text-sm">
          <label class="flex items-center gap-2">
            <span class="text-gray-700">Model:</span>
            <select v-model="currentModel" class="px-2 py-1 border border-gray-300 rounded">
              <option value="google/gemma-3-12b">Gemma 3 12B</option>
            </select>
          </label>
          <label class="flex items-center gap-2">
            <span class="text-gray-700">Temperature:</span>
            <input v-model.number="temperature" type="range" min="0" max="1" step="0.1" class="w-20" />
            <span class="text-gray-600">{{ temperature }}</span>
          </label>
          <button 
            @click="clearChat" 
            class="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { sendMessage as apiSendMessage } from './services/llm.js'

export default {
  name: 'App',
  data() {
    return {
      messages: [],
      currentMessage: '',
      isLoading: false,
      currentModel: 'google/gemma-3-12b',
      temperature: 0.7,
      messageId: 0
    }
  },
  methods: {
    async sendMessage() {
      if (!this.currentMessage.trim() || this.isLoading) return

      const userMessage = {
        id: this.messageId++,
        role: 'user',
        content: this.currentMessage
      }

      this.messages.push(userMessage)
      const messageToSend = this.currentMessage
      this.currentMessage = ''
      this.isLoading = true

      try {
        const chatMessages = this.messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))

        const response = await apiSendMessage(
          chatMessages,
          this.currentModel,
          this.temperature
        )

        this.messages.push({
          id: this.messageId++,
          role: 'assistant',
          content: response
        })
      } catch (error) {
        this.messages.push({
          id: this.messageId++,
          role: 'assistant',
          content: `Error: ${error.message}`
        })
      } finally {
        this.isLoading = false
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }
    },
    
    clearChat() {
      this.messages = []
      this.messageId = 0
    },
    
    scrollToBottom() {
      const container = this.$refs.messagesContainer
      container.scrollTop = container.scrollHeight
    }
  }
}
</script>

<style>
</style>