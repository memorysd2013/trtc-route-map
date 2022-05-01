import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import ElementPlus from 'unplugin-element-plus/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// const fs = require("fs");

/**
 * https://vitejs.dev/config/
 * @Components 自動引入 components 插件 https://github.com/antfu/unplugin-vue-components
 * @ElementPlus 自動引入 Element Plus 的 style
 * @ElementPlusResolver 自動引入 Element Plus components
 */
export default defineConfig({
  plugins: [
    vue(),
    ElementPlus(),
    Components({
      resolvers: [
        ElementPlusResolver()
      ]
    })
  ],
  // for facebook sdk
  server: {
    https: true,
    // https: {
      // key: fs.readFileSync(`${__dirname}/src/assets/localhost-key.pem`),
      // cert: fs.readFileSync(`${__dirname}/src/assets/localhost.pem`),
    // },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // setting 要最先載入, 否則 public 使用到變數時會報錯
        additionalData: `
          @import "src/style/setting.scss";
          @import "src/style/init.scss";
          @import "src/style/public.scss";
        `
      }
    }
  },
  base: '/trtc-route-map/',
})
