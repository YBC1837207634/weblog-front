import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import ArcoVue from '@arco-design/web-vue'
import { Message } from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'
// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

import infiniteScroll from 'vue3-infinite-scroll-better'

import App from './App.vue'

const app = createApp(App)
Message._context = app._context

app.use(ArcoVue)
app.use(ArcoVueIcon)
app.use(router)
app.use(createPinia())
app.use(mavonEditor)
app.use(infiniteScroll)
app.mount('#app')
