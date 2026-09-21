import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { viteMockServe } from 'vite-plugin-mock'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      vue(),
      vueDevTools(),

      viteMockServe({
        mockPath: 'mock',
        // enable: mode === 'development', // 是否开启 mock
        // 开发环境：Vite 开发服务器提供 mock 接口
        localEnabled: mode === 'development',

        // 打包后的在线演示站点：浏览器端拦截请求并返回 mock 数据
        prodEnabled: mode === 'production',

        // 生产构建时，向入口文件注入启动 mock 的代码
        // injectCode: `
        //   import { setupProdMockServer } from './mockProdServer.js'
        //   setupProdMockServer()
        // `,
      }),
    ],
    base: '/bkmsystem/',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
