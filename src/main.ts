import './assets/main.css'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { OpenAPI } from '@/api/core/OpenAPI';

// 在应用启动时设置基础URL
OpenAPI.BASE = 'http://127.0.0.1:8000';

const app = createApp(App)

app.use(createPinia())
app.use(ElementPlus, { locale: zhCn });
app.use(router)

app.mount('#app')
