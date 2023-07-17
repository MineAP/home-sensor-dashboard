import './assets/main.css'

import { createApp } from 'vue/dist/vue.esm-bundler.js'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import History from './History.vue'
import Camera from './Camera.vue'

const routes = [
    { path: '/', component: App },
    { path: '/temphistory', component: History },
    { path: '/camera', component: Camera },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes, // short for `routes: routes`
})

const app = createApp({})
app.use(router)
app.mount('#app')
