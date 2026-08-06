import { createApp } from 'vue'
import { createPinia } from 'pinia'

import '@/css/main.css'

import App from './App.vue'
/* import router from './router' */

import { VueUiXy } from 'vue-data-ui/vue-ui-xy'
import { VueUiRadar } from 'vue-data-ui'

const app = createApp(App)

app.use(createPinia())
/* app.use(router) */

app.component('VueUiRadar', VueUiRadar)
app.component('VueUiXy', VueUiXy)

app.mount('#app')
