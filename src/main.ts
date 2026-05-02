import './assets/main.css'

import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import HomeView from './views/HomeView.vue'
import History from './History.vue'
import Camera from './Camera.vue'
import { API_HOST } from './components/Const';

const routes = [
    { path: '/', component: HomeView },
    { path: '/temphistory', component: History },
    { path: '/camera', component: Camera },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes, // short for `routes: routes`
})

console.log("API_HOST", API_HOST)

createApp(App).use(router).mount('#app')
