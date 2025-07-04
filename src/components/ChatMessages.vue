<template>
  <div class="flex-1 overflow-y-auto bg-gray-50 p-4" ref="messagesContainer">
    <div class="max-w-none mx-auto px-4">
      <div v-if="messages.length === 0" class="text-center py-12">
        <div class="text-gray-400 text-lg mb-2">👋</div>
        <p class="text-gray-500">Start a conversation with your LLM</p>
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
  methods: {
    scrollToBottom() {
      const container = this.$refs.messagesContainer
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    }
  }
}
</script>