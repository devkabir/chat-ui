import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from './MainLayout.vue'
import ChatView from './views/ChatView.vue'
import RoleEditor from './views/RoleEditor.vue'
import './style.css'

const routes = [
  { path: '/', component: ChatView },
  { path: '/roles', component: RoleEditor }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

createApp(MainLayout).use(router).mount('#app')