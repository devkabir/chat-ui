<template>
  <div class="flex-1 p-4 overflow-y-auto bg-gray-50" ref="messagesContainer">
    <div class="px-4 mx-auto max-w-none">
      <div v-if="messages.length === 0" class="py-12 text-center">
        <div class="mb-2 text-lg text-gray-400">👋</div>
        <p class="mb-6 text-gray-500">Start a conversation with your LLM</p>
        
        <div class="max-w-2xl mx-auto">
          <div class="mb-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-medium text-gray-700">Try these conversation starters:</h3>
              <button 
                @click="showGistConfig = !showGistConfig"
                class="text-xs text-blue-600 hover:text-blue-800"
              >
                {{ showGistConfig ? 'Hide' : 'Add Personal Prompts' }}
              </button>
            </div>
            
            <div v-if="showGistConfig" class="p-3 mb-4 border border-blue-200 rounded-lg bg-blue-50">
              <label class="block mb-2 text-xs text-gray-700">
                Personal Prompts Gist URL (optional):
              </label>
              <div class="flex gap-2">
                <input
                  v-model="gistUrl"
                  type="url"
                  placeholder="https://gist.githubusercontent.com/username/gist-id/raw/prompts.json"
                  class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  @click="saveGistUrl"
                  class="px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
              <p class="mt-1 text-xs text-gray-500">
                Add a private GitHub Gist URL containing your personal prompts in JSON format.
              </p>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
            <button 
              v-for="starter in conversationStarters" 
              :key="starter.id"
              @click="$emit('send-starter', starter)"
              class="p-3 text-left transition-colors bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300"
            >
              <div class="flex items-center space-x-2">
                <span class="text-lg">{{ starter.icon }}</span>
                <div>
                  <div class="text-sm font-medium text-gray-800">{{ starter.title }}</div>
                  <div class="mt-1 text-xs text-gray-500">{{ starter.description }}</div>
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
        <div class="max-w-xs px-4 py-3 bg-white border border-gray-200 shadow-sm sm:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl rounded-bl-md">
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

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import MessageBubble from './MessageBubble.vue'

const props = defineProps({
  messages: {
    type: Array,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['send-starter'])

const messagesContainer = ref(null)
const conversationStarters = ref([])
const showGistConfig = ref(false)
const gistUrl = ref('')

const loadGistUrl = () => {
  const saved = localStorage.getItem('gist-url')
  if (saved) {
    gistUrl.value = saved
  }
}

const saveGistUrl = () => {
  if (gistUrl.value) {
    localStorage.setItem('gist-url', gistUrl.value)
  } else {
    localStorage.removeItem('gist-url')
  }
  loadConversationStarters()
}

const loadPersonalPrompts = async () => {
  const savedUrl = localStorage.getItem('gist-url')
  if (!savedUrl) return []
  
  try {
    // Convert gist URL to raw content URL to avoid CORS issues
    const rawUrl = savedUrl.replace('gist.github.com', 'gist.githubusercontent.com').replace('/gists/', '/') + '/raw'
    const response = await fetch(rawUrl)
    if (!response.ok) throw new Error('Failed to fetch gist')
    const prompts = await response.json()
    return Array.isArray(prompts) ? prompts : []
  } catch (error) {
    console.error('Failed to load personal prompts:', error)
    return []
  }
}

const loadConversationStarters = async () => {
  try {
    // Load default prompts
    const module = await import('@/data/conversationStarters.json')
    const defaultPrompts = module.default || []
    
    // Load personal prompts
    const personalPrompts = await loadPersonalPrompts()
    
    // Combine prompts
    conversationStarters.value = [...defaultPrompts, ...personalPrompts]
  } catch (error) {
    console.error('Failed to load conversation starters:', error)
    conversationStarters.value = []
  }
}

const scrollToBottom = () => {
  const container = messagesContainer.value
  if (container) {
    container.scrollTop = container.scrollHeight
  }
}

// Watch for message changes
watch(() => props.messages, () => {
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })

// Watch for loading changes
watch(() => props.isLoading, () => {
  nextTick(() => {
    scrollToBottom()
  })
})

onMounted(() => {
  loadGistUrl()
  loadConversationStarters()
})
</script>