import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const fs = require("fs");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // for facebook sdk
  server: {
    https: {
      key: fs.readFileSync(`${__dirname}/src/assets/localhost-key.pem`),
      cert: fs.readFileSync(`${__dirname}/src/assets/localhost.pem`),
    },
  },
  base: '/trtc-route-map/',
})
