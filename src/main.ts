import { createApp, nextTick } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import '@/assets/scss/index.scss'

import RequestPluginFun from './vendor/custom-plugin';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
RequestPluginFun(app)

app.use(VXETable)
app.use(store)
.use(ElementPlus, {
    locale: zhCn,
})
.use(router).mount('#app')
