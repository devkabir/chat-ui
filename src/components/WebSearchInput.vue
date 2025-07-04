<template>
  <div class="bg-white border-b border-gray-200 p-4">
    <div class="max-w-none mx-auto">
      <div class="flex items-center space-x-3">
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
            </svg>
          </div>
          <input
            v-model="searchQuery"
            @keydown.enter="performSearch"
            type="text"
            placeholder="Search the web and discuss with AI..."
            class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <button 
          @click="performSearch"
          :disabled="!searchQuery.trim() || isSearching"
          class="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
        >
          <svg v-if="isSearching" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <span>{{ isSearching ? 'Searching...' : 'Search' }}</span>
        </button>
      </div>
      
      <!-- Search suggestions/recent searches -->
      <div v-if="showSuggestions && searchSuggestions.length > 0" class="mt-3">
        <div class="text-xs text-gray-500 mb-2">Recent searches:</div>
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="suggestion in searchSuggestions" 
            :key="suggestion"
            @click="searchQuery = suggestion; performSearch()"
            class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WebSearchInput',
  emits: ['search'],
  data() {
    return {
      searchQuery: '',
      isSearching: false,
      showSuggestions: false,
      searchSuggestions: []
    }
  },
  mounted() {
    this.loadSearchHistory()
  },
  methods: {
    async performSearch() {
      if (!this.searchQuery.trim() || this.isSearching) return
      
      this.isSearching = true
      
      try {
        this.$emit('search', {
          query: this.searchQuery.trim(),
          timestamp: new Date().toISOString()
        })
        
        // Add to search history
        this.addToSearchHistory(this.searchQuery.trim())
        
        // Clear search query after successful search
        this.searchQuery = ''
        this.showSuggestions = false
        
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        this.isSearching = false
      }
    },
    
    loadSearchHistory() {
      try {
        const history = localStorage.getItem('webSearchHistory')
        if (history) {
          this.searchSuggestions = JSON.parse(history).slice(0, 5) // Show last 5 searches
        }
      } catch (error) {
        console.error('Error loading search history:', error)
      }
    },
    
    addToSearchHistory(query) {
      try {
        let history = []
        const existingHistory = localStorage.getItem('webSearchHistory')
        
        if (existingHistory) {
          history = JSON.parse(existingHistory)
        }
        
        // Remove if already exists
        history = history.filter(item => item !== query)
        
        // Add to beginning
        history.unshift(query)
        
        // Keep only last 10 searches
        history = history.slice(0, 10)
        
        localStorage.setItem('webSearchHistory', JSON.stringify(history))
        this.loadSearchHistory()
        
      } catch (error) {
        console.error('Error saving search history:', error)
      }
    },
    
    clearSearchHistory() {
      localStorage.removeItem('webSearchHistory')
      this.searchSuggestions = []
    }
  },
  watch: {
    searchQuery(newValue) {
      this.showSuggestions = newValue.length === 0 && this.searchSuggestions.length > 0
    }
  }
}
</script>