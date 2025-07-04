<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-gray-800">Role Editor</h1>
          <router-link 
            to="/"
            class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors inline-block"
          >
            Back to Chat
          </router-link>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Role List -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-700">Available Roles</h2>
              <button 
                @click="createNewRole"
                class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Add New Role
              </button>
            </div>
            
            <div class="space-y-3">
              <div 
                v-for="role in conversationStarters" 
                :key="role.id"
                :class="[
                  'p-4 border rounded-lg cursor-pointer transition-colors',
                  selectedRole?.id === role.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                ]"
                @click="selectRole(role)"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <span class="text-2xl">{{ role.icon }}</span>
                    <div>
                      <h3 class="font-medium text-gray-800">{{ role.title }}</h3>
                      <p class="text-sm text-gray-600">{{ role.description }}</p>
                    </div>
                  </div>
                  <button 
                    @click.stop="deleteRole(role.id)"
                    class="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clip-rule="evenodd"></path>
                      <path fill-rule="evenodd" d="M4 5a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm3 3a1 1 0 011 1v6a1 1 0 11-2 0V9a1 1 0 011-1zm4 0a1 1 0 011 1v6a1 1 0 11-2 0V9a1 1 0 011-1z" clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Role Editor -->
          <div class="space-y-4">
            <h2 class="text-lg font-semibold text-gray-700">
              {{ selectedRole ? 'Edit Role' : 'Select a role to edit' }}
            </h2>
            
            <div v-if="selectedRole" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <input 
                  v-model="selectedRole.icon"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter an emoji"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  v-model="selectedRole.title"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Role title"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input 
                  v-model="selectedRole.description"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Short description"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">System Prompt</label>
                <textarea 
                  v-model="selectedRole.prompt"
                  rows="8"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the system prompt for this role..."
                />
              </div>
              
              <div class="flex space-x-3">
                <button 
                  @click="saveRole"
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Save Changes
                </button>
                <button 
                  @click="cancelEdit"
                  class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
            
            <div v-else class="text-center py-12 text-gray-500">
              <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              <p>Select a role from the list to edit its details</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import conversationStartersData from '../data/conversationStarters.json'

export default {
  name: 'RoleEditor',
  data() {
    return {
      conversationStarters: [],
      selectedRole: null,
      originalRole: null
    }
  },
  mounted() {
    this.loadRoles()
  },
  methods: {
    loadRoles() {
      // Load from localStorage or use default data
      const savedRoles = localStorage.getItem('conversationStarters')
      if (savedRoles) {
        this.conversationStarters = JSON.parse(savedRoles)
      } else {
        this.conversationStarters = [...conversationStartersData]
        this.saveToLocalStorage()
      }
    },
    
    saveToLocalStorage() {
      localStorage.setItem('conversationStarters', JSON.stringify(this.conversationStarters))
    },
    
    selectRole(role) {
      this.selectedRole = { ...role }
      this.originalRole = { ...role }
    },
    
    createNewRole() {
      const newId = Math.max(...this.conversationStarters.map(r => r.id)) + 1
      const newRole = {
        id: newId,
        title: 'New Role',
        description: 'Enter description',
        role: 'system',
        prompt: 'Enter your system prompt here...',
        icon: '🤖'
      }
      this.conversationStarters.push(newRole)
      this.selectRole(newRole)
      this.saveToLocalStorage()
    },
    
    saveRole() {
      if (!this.selectedRole) return
      
      const index = this.conversationStarters.findIndex(r => r.id === this.selectedRole.id)
      if (index !== -1) {
        this.conversationStarters[index] = { ...this.selectedRole }
        this.saveToLocalStorage()
        this.originalRole = { ...this.selectedRole }
        this.$emit('roles-updated', this.conversationStarters)
      }
    },
    
    cancelEdit() {
      if (this.originalRole) {
        this.selectedRole = { ...this.originalRole }
      } else {
        this.selectedRole = null
      }
    },
    
    deleteRole(roleId) {
      if (confirm('Are you sure you want to delete this role?')) {
        this.conversationStarters = this.conversationStarters.filter(r => r.id !== roleId)
        if (this.selectedRole?.id === roleId) {
          this.selectedRole = null
          this.originalRole = null
        }
        this.saveToLocalStorage()
        this.$emit('roles-updated', this.conversationStarters)
      }
    }
  }
}
</script>