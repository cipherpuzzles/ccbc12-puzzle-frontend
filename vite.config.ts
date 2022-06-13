import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import * as fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  server: {
    host: "puzzle.ccbc11.test",
    https: {
      key: fs.readFileSync("D:\\MyWorks\\ccxc\\cache\\ccbc11test.key"),
      cert: fs.readFileSync("D:\\MyWorks\\ccxc\\cache\\ccbc11test.crt")
    }
  }
})
