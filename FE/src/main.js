import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/main.scss'
import api from './apis/useApi';
console.log(api.files.deleteFileById);

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.provide('$api', api);
app.use(createPinia())
app.use(router)

app.mount('#app')
