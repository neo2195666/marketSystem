import { createApp } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import "./permission.js"
import router from './router'
import 'virtual:windi.css'
import App from './App.vue'
import store from "~/store/index.js";

const app = createApp(App).use(ElementPlus).use(router).use(store)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#app')


