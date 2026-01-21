import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/css/template.css'
import './assets/css/font-awesome5.css'

const app = createApp(App)

app.use(router)
app.mount('#app')
