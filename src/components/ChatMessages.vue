<template>
  <div class="flex-1 overflow-y-auto bg-gray-50 p-4" ref="messagesContainer">
    <div class="max-w-none mx-auto px-4">
      <div v-if="messages.length === 0" class="text-center py-12">
        <div class="text-gray-400 text-lg mb-2">👋</div>
        <p class="text-gray-500 mb-6">Start a conversation with your LLM</p>
        
        <div class="max-w-2xl mx-auto">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-gray-700 text-sm font-medium">Try these conversation starters:</h3>
            <router-link 
              to="/roles" 
              class="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Edit Roles
            </router-link>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button 
              v-for="starter in conversationStarters" 
              :key="starter.id"
              @click="$emit('send-starter', starter)"
              class="p-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <div class="flex items-center space-x-2">
                <span class="text-lg">{{ starter.icon }}</span>
                <div>
                  <div class="text-sm font-medium text-gray-800">{{ starter.title }}</div>
                  <div class="text-xs text-gray-500 mt-1">{{ starter.description }}</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <MessageBubble
        v-for="message in messages"
        :key="message.id"
        :message="message"
      />
      
      <div v-if="isLoading" class="flex justify-start mb-4">
        <div class="max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-3 rounded-2xl rounded-bl-md bg-white border border-gray-200 shadow-sm">
          <div class="flex items-center space-x-2">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
            <span class="text-sm text-gray-600">Thinking...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MessageBubble from './MessageBubble.vue'

export default {
  name: 'ChatMessages',
  components: {
    MessageBubble
  },
  emits: ['send-starter'],
  props: {
    messages: {
      type: Array,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    messages: {
      handler() {
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      },
      deep: true
    },
    isLoading() {
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    }
  },
  data() {
    return {
      conversationStarters: []
    }
  },
  mounted() {
    this.loadConversationStarters()
  },
  methods: {
    loadConversationStarters() {
      // Always load from JSON file to get latest updates
      import('../data/conversationStarters.json').then(module => {
        this.conversationStarters = module.default
        // Update localStorage with latest data
        localStorage.setItem('conversationStarters', JSON.stringify(this.conversationStarters))
      }).catch(() => {
        // Fallback to localStorage if JSON import fails
        const savedStarters = localStorage.getItem('conversationStarters')
        if (savedStarters) {
          this.conversationStarters = JSON.parse(savedStarters)
        }
      })
    },
    
    scrollToBottom() {
      const container = this.$refs.messagesContainer
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    }
  }
}
</script>