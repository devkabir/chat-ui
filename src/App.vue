<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="h-screen flex flex-col w-full bg-white shadow-2xl">
      <ChatHeader 
        :current-model="currentModel"
        :is-connected="isConnected"
        :message-count="messages.length"
      />
      
      <ChatMessages 
        :messages="messages"
        :is-loading="isLoading"
      />
      
      <ChatInput 
        :is-loading="isLoading"
        :current-model="currentModel"
        :temperature="temperature"
        @send-message="sendMessage"
        @model-change="handleModelChange"
        @temperature-change="handleTemperatureChange"
        @streaming-change="handleStreamingChange"
        @stop-request="stopCurrentRequest"
        @clear-chat="clearChat"
      />
    </div>
  </div>
</template>

<script>
import { sendMessage as apiSendMessage, sendMessageStream } from './services/llm.js'
import ChatHeader from './components/ChatHeader.vue'
import ChatMessages from './components/ChatMessages.vue'
import ChatInput from './components/ChatInput.vue'

export default {
  name: 'App',
  components: {
    ChatHeader,
    ChatMessages,
    ChatInput
  },
  data() {
    return {
      messages: [],
      isLoading: false,
      isConnected: true,
      currentModel: 'google/gemma-3-12b',
      temperature: 0.7,
      useStreaming: true,
      messageId: 0,
      abortController: null
    }
  },
  methods: {
    async sendMessage(messageContent) {
      if (!messageContent.trim() || this.isLoading) return

      // Create new AbortController for this request
      this.abortController = new AbortController()

      const userMessage = {
        id: this.messageId++,
        role: 'user',
        content: messageContent,
        timestamp: new Date().toISOString()
      }

      this.messages.push(userMessage)
      this.isLoading = true

      // Create assistant message placeholder
      const assistantMessage = {
        id: this.messageId++,
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        isStreaming: this.useStreaming
      }

      this.messages.push(assistantMessage)

      try {
        const chatMessages = this.messages
          .filter(msg => msg.content.trim() !== '')
          .map(msg => ({
            role: msg.role,
            content: msg.content
          }))

        if (this.useStreaming) {
          await sendMessageStream(
            chatMessages,
            this.currentModel,
            this.temperature,
            (token) => {
              // Update the last message (assistant) with new content
              const lastMessage = this.messages[this.messages.length - 1]
              if (lastMessage && lastMessage.role === 'assistant') {
                lastMessage.content += token
              }
            },
            this.abortController.signal
          )
          
          // Mark streaming as complete
          const lastMessage = this.messages[this.messages.length - 1]
          if (lastMessage && lastMessage.role === 'assistant') {
            lastMessage.isStreaming = false
          }
        } else {
          const response = await apiSendMessage(
            chatMessages,
            this.currentModel,
            this.temperature,
            this.abortController.signal
          )

          // Update the placeholder message with full response
          const lastMessage = this.messages[this.messages.length - 1]
          if (lastMessage && lastMessage.role === 'assistant') {
            lastMessage.content = response
            lastMessage.isStreaming = false
          }
        }
        
        this.isConnected = true
      } catch (error) {
        // Update the placeholder message with error
        const lastMessage = this.messages[this.messages.length - 1]
        if (lastMessage && lastMessage.role === 'assistant') {
          if (error.message === 'Request was cancelled') {
            lastMessage.content = '🛑 Request was stopped by user'
          } else {
            lastMessage.content = `❌ Error: ${error.message}`
            this.isConnected = false
          }
          lastMessage.isStreaming = false
        }
      } finally {
        this.isLoading = false
        this.abortController = null
      }
    },
    
    handleModelChange(newModel) {
      this.currentModel = newModel
    },
    
    handleTemperatureChange(newTemperature) {
      this.temperature = newTemperature
    },
    
    handleStreamingChange(useStreaming) {
      this.useStreaming = useStreaming
    },
    
    stopCurrentRequest() {
      if (this.abortController) {
        this.abortController.abort()
      }
    },
    
    clearChat() {
      this.messages = []
      this.messageId = 0
    }
  }
}
</script>

<style>
</style>