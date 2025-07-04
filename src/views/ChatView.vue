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

<script setup>
import { ref } from 'vue'
import ChatHeader from '../components/ChatHeader.vue'
import ChatMessages from '../components/ChatMessages.vue'
import ChatInput from '../components/ChatInput.vue'
import { sendMessage as sendMessageAPI, sendMessageStream } from '../services/llm.js'

const messages = ref([])
const isLoading = ref(false)
const currentModel = ref('google/gemma-3-12b')
const isConnected = ref(true)
const temperature = ref(0.7)
const useStreaming = ref(true)
const messageId = ref(0)
const abortController = ref(null)

const sendMessage = async (messageContent) => {
  // Handle starter object or string
  if (typeof messageContent === 'object' && messageContent.prompt) {
    // It's a starter object with system prompt
    const systemMessage = {
      id: messageId.value++,
      role: 'system',
      content: messageContent.prompt,
      timestamp: new Date().toISOString()
    }
    messages.value.push(systemMessage)
    return
  }
  
  // Handle regular string message
  if (!messageContent || !messageContent.trim() || isLoading.value) return

  // Create new AbortController for this request
  abortController.value = new AbortController()

  const userMessage = {
    id: messageId.value++,
    role: 'user',
    content: messageContent,
    timestamp: new Date().toISOString()
  }

  messages.value.push(userMessage)
  isLoading.value = true

  // Create assistant message placeholder
  const assistantMessage = {
    id: messageId.value++,
    role: 'assistant',
    content: '',
    timestamp: new Date().toISOString(),
    isStreaming: useStreaming.value
  }

  messages.value.push(assistantMessage)

  try {
    const chatMessages = messages.value
      .filter(msg => msg.content.trim() !== '')
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }))

    if (useStreaming.value) {
      await sendMessageStream(
        chatMessages,
        currentModel.value,
        temperature.value,
        (token) => {
          // Update the last message (assistant) with new content
          const lastMessage = messages.value[messages.value.length - 1]
          if (lastMessage && lastMessage.role === 'assistant') {
            lastMessage.content += token
          }
        },
        abortController.value.signal
      )
    } else {
      const response = await sendMessageAPI(
        chatMessages,
        currentModel.value,
        temperature.value,
        abortController.value.signal
      )
      
      // Update the assistant message with the complete response
      const lastMessage = messages.value[messages.value.length - 1]
      if (lastMessage && lastMessage.role === 'assistant') {
        lastMessage.content = response
      }
    }

    // Mark streaming as complete
    const lastMessage = messages.value[messages.value.length - 1]
    if (lastMessage && lastMessage.role === 'assistant') {
      lastMessage.isStreaming = false
    }

  } catch (error) {
    console.error('Error sending message:', error)
    
    // Remove the empty assistant message on error
    if (messages.value.length > 0 && messages.value[messages.value.length - 1].role === 'assistant' && messages.value[messages.value.length - 1].content === '') {
      messages.value.pop()
    }
    
    // Add error message
    const errorMessage = {
      id: messageId.value++,
      role: 'assistant',
      content: error.name === 'AbortError' ? 'Request cancelled.' : 'Sorry, I encountered an error. Please try again.',
      timestamp: new Date().toISOString(),
      isStreaming: false
    }
    messages.value.push(errorMessage)
  } finally {
    isLoading.value = false
    abortController.value = null
  }
}

const stopCurrentRequest = () => {
  if (abortController.value) {
    abortController.value.abort()
    isLoading.value = false
    
    // Mark the last assistant message as no longer streaming
    const lastMessage = messages.value[messages.value.length - 1]
    if (lastMessage && lastMessage.role === 'assistant') {
      lastMessage.isStreaming = false
    }
  }
}

const handleModelChange = (newModel) => {
  currentModel.value = newModel
}

const handleTemperatureChange = (newTemperature) => {
  temperature.value = newTemperature
}

const handleStreamingChange = (streaming) => {
  useStreaming.value = streaming
}

const clearChat = () => {
  messages.value = []
  messageId.value = 0
  if (abortController.value) {
    abortController.value.abort()
    isLoading.value = false
  }
}
</script>