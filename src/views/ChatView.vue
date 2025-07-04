<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="h-screen flex flex-col w-full bg-white shadow-2xl">
      <ChatHeader 
        :current-model="currentModel"
        :is-connected="isConnected"
        :message-count="messages.length"
        @toggle-web-search="toggleWebSearch"
      />
      
      <WebSearchInput 
        v-if="showWebSearch"
        @search="handleWebSearch"
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
import WebSearchInput from '../components/WebSearchInput.vue'
import { sendMessage as sendMessageAPI, sendMessageStream } from '../services/llm.js'
import { searchWebMock } from '../services/webSearch.js'

export default {
  name: 'ChatView',
  components: {
    ChatHeader,
    ChatMessages,
    ChatInput,
    WebSearchInput
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
      abortController: null,
      showWebSearch: false
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
    },

    toggleWebSearch() {
      this.showWebSearch = !this.showWebSearch
    },

    async handleWebSearch(searchData) {
      try {
        // Show search query in chat
        const searchMessage = {
          id: this.messageId++,
          role: 'user',
          content: `🌐 Search: ${searchData.query}`,
          timestamp: new Date().toISOString(),
          searchQuery: searchData.query
        }
        this.messages.push(searchMessage)

        // Show loading state
        this.isLoading = true

        // Perform web search
        const searchResults = await searchWebMock(searchData.query, 5)

        if (searchResults.error) {
          throw new Error(searchResults.error)
        }

        // Format search results for display
        let resultsContent = `Here are the web search results for "${searchData.query}":\n\n`
        
        searchResults.results.forEach((result, index) => {
          resultsContent += `**${index + 1}. ${result.title}**\n`
          resultsContent += `${result.snippet}\n`
          if (result.url) {
            resultsContent += `🔗 [${result.source}](${result.url})\n`
          }
          resultsContent += '\n'
        })

        // Add search results as a system message
        const resultsMessage = {
          id: this.messageId++,
          role: 'assistant',
          content: resultsContent,
          timestamp: new Date().toISOString(),
          isWebSearchResult: true,
          searchQuery: searchData.query,
          searchResults: searchResults.results
        }
        this.messages.push(resultsMessage)

        // Auto-send to AI for analysis
        const analysisPrompt = `Based on the web search results above for "${searchData.query}", please provide a comprehensive summary and analysis. Include key insights, relevant information, and answer any questions the user might have about this topic.`
        
        // Send analysis request to AI
        await this.sendMessage(analysisPrompt)

      } catch (error) {
        console.error('Web search error:', error)
        
        const errorMessage = {
          id: this.messageId++,
          role: 'assistant',
          content: `Sorry, I encountered an error while searching for "${searchData.query}". Please try again or rephrase your search query.`,
          timestamp: new Date().toISOString()
        }
        this.messages.push(errorMessage)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>