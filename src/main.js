import { createApp } from 'vue'
import App from './App.vue'

import pinia from '@/stores'
import router from '@/router'

import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import '@/assets/styles/index.scss'
import 'element-plus/dist/index.css'

import '@/router/permission'
import { hasPermission } from '@/utils/vpermission'

async function bootstrap() {
  if (import.meta.env.PROD) {
    // 生产环境加载 mock
    import('../mockProdServer.js').then(({ setupProdMockServer }) => {
      setupProdMockServer()
    })
  }

  const app = createApp(App)

  app.use(pinia)
  app.use(router)

  app.use(ElementPlus, {
    locale: zhCn,
  })

  app.directive('permission', {
    mounted(el, binding) {
      const permission = binding.value
      if (!hasPermission(permission)) {
        el.parentNode?.removeChild(el)
      }
    },
  })

  app.mount('#app')
}

bootstrap()
