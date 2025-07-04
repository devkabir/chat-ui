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
        @send-starter="sendMessage"
      />
      
      <ChatInput 
        :is-loading="isLoading"
        :current-model="currentModel"
        :temperature="temperature"
        :messages="messages"
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
import ChatHeader from '../components/ChatHeader.vue'
import ChatMessages from '../components/ChatMessages.vue'
import ChatInput from '../components/ChatInput.vue'
import { sendMessage as sendMessageAPI, sendMessageStream } from '../services/llm.js'

export default {
  name: 'ChatView',
  components: {
    ChatHeader,
    ChatMessages,
    ChatInput
  },
  data() {
    return {
      messages: [],
      isLoading: false,
      currentModel: 'google/gemma-3-12b',
      isConnected: true,
      temperature: 0.7,
      useStreaming: true,
      messageId: 0,
      abortController: null
    }
  },
  methods: {
    async sendMessage(messageContent) {
      // Handle starter object or string
      if (typeof messageContent === 'object' && messageContent.prompt) {
        // It's a starter object with system prompt
        const systemMessage = {
          id: this.messageId++,
          role: 'system',
          content: messageContent.prompt,
          timestamp: new Date().toISOString()
        }
        this.messages.push(systemMessage)
        return
      }
      
      // Handle regular string message
      if (!messageContent || !messageContent.trim() || this.isLoading) return

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
        } else {
          const response = await sendMessageAPI(
            chatMessages,
            this.currentModel,
            this.temperature,
            this.abortController.signal
          )
          
          // Update the assistant message with the complete response
          const lastMessage = this.messages[this.messages.length - 1]
          if (lastMessage && lastMessage.role === 'assistant') {
            lastMessage.content = response
          }
        }

        // Mark streaming as complete
        const lastMessage = this.messages[this.messages.length - 1]
        if (lastMessage && lastMessage.role === 'assistant') {
          lastMessage.isStreaming = false
        }

      } catch (error) {
        console.error('Error sending message:', error)
        
        // Remove the empty assistant message on error
        if (this.messages.length > 0 && this.messages[this.messages.length - 1].role === 'assistant' && this.messages[this.messages.length - 1].content === '') {
          this.messages.pop()
        }
        
        // Add error message
        const errorMessage = {
          id: this.messageId++,
          role: 'assistant',
          content: error.name === 'AbortError' ? 'Request cancelled.' : 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date().toISOString(),
          isStreaming: false
        }
        this.messages.push(errorMessage)
      } finally {
        this.isLoading = false
        this.abortController = null
      }
    },

    stopCurrentRequest() {
      if (this.abortController) {
        this.abortController.abort()
        this.isLoading = false
        
        // Mark the last assistant message as no longer streaming
        const lastMessage = this.messages[this.messages.length - 1]
        if (lastMessage && lastMessage.role === 'assistant') {
          lastMessage.isStreaming = false
        }
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

    clearChat() {
      this.messages = []
      this.messageId = 0
      if (this.abortController) {
        this.abortController.abort()
        this.isLoading = false
      }
    }
  }
}
</script>